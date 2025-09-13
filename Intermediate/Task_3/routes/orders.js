const express = require('express');
const { Order, User, Product } = require('../models');
const { orderValidation, commonValidation } = require('../middleware/validation');
const router = express.Router();

// GET /api/orders - Get all orders with pagination
router.get('/', 
  commonValidation.validatePagination,
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;
      
      const { status, paymentStatus, region } = req.query;
      
      let whereClause = {};
      if (status) whereClause.status = status;
      if (paymentStatus) whereClause.paymentStatus = paymentStatus;
      if (region) whereClause.shippingRegion = region;

      const { count, rows: orders } = await Order.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        offset,
        limit,
        order: [['createdAt', 'DESC']]
      });

      // Add computed fields
      const ordersWithComputedFields = orders.map(order => {
        const orderData = order.toJSON();
        orderData.customerName = order.getCustomerName();
        orderData.itemCount = order.getItemCount();
        return orderData;
      });

      res.json({
        success: true,
        data: {
          orders: ordersWithComputedFields,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalOrders: count,
            hasNext: page < Math.ceil(count / limit),
            hasPrev: page > 1
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/orders/stats - Get order statistics
router.get('/stats', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const dateRange = {};
    
    if (startDate) dateRange.start = startDate;
    if (endDate) dateRange.end = endDate;
    
    const stats = await Order.getOrderStats(dateRange);
    
    res.json({
      success: true,
      data: stats[0] || {}
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/regions - Get orders by Ghana regions
router.get('/regions', async (req, res, next) => {
  try {
    const regionStats = await Order.getOrdersByRegion();
    
    res.json({
      success: true,
      data: regionStats
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/payment-methods - Get payment method statistics
router.get('/payment-methods', async (req, res, next) => {
  try {
    const paymentStats = await Order.getPaymentMethodStats();
    
    res.json({
      success: true,
      data: paymentStats
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/user/:userId - Get orders by user
router.get('/user/:userId',
  commonValidation.validateId,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const { count, rows: orders } = await Order.findAndCountAll({
        where: { userId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        offset,
        limit,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          orders,
          userId,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalOrders: count
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/orders/:id - Get order by ID
router.get('/:id',
  commonValidation.validateId,
  async (req, res, next) => {
    try {
      const order = await Order.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          }
        ]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Add computed fields
      const orderData = order.toJSON();
      orderData.customerName = order.getCustomerName();
      orderData.itemCount = order.getItemCount();

      res.json({
        success: true,
        data: orderData
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/orders - Create new order
router.post('/',
  orderValidation.create,
  async (req, res, next) => {
    try {
      // Validate products exist and calculate totals
      const productIds = req.body.items.map(item => item.productId);
      const products = await Product.findAll({
        where: { 
          id: productIds,
          isActive: true 
        }
      });

      if (products.length !== productIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more products not found or inactive'
        });
      }

      // Validate stock availability
      for (const item of req.body.items) {
        const product = products.find(p => p.id === item.productId);
        if (product.trackQuantity && product.quantity < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for product: ${product.name}`
          });
        }
      }

      // Calculate shipping cost
      const tempOrder = { 
        shippingRegion: req.body.shippingRegion,
        items: req.body.items 
      };
      const shippingCost = Order.prototype.calculateShippingCost.call(tempOrder);
      
      // Create order with calculated shipping
      const orderData = {
        ...req.body,
        shippingCost,
        shippingMethod: {
          name: req.body.shippingMethod?.name || 'Standard Delivery',
          cost: shippingCost,
          estimatedDays: req.body.shippingMethod?.estimatedDays || 3
        }
      };

      const order = await Order.create(orderData);
      
      // Update product quantities
      for (const item of req.body.items) {
        const product = products.find(p => p.id === item.productId);
        if (product.trackQuantity) {
          await product.update({ 
            quantity: product.quantity - item.quantity,
            salesCount: product.salesCount + item.quantity
          });
        }
      }

      // Fetch created order with associations
      const createdOrder = await Order.findByPk(order.id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: createdOrder
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status',
  commonValidation.validateId,
  orderValidation.updateStatus,
  async (req, res, next) => {
    try {
      const { status, note } = req.body;
      const order = await Order.findByPk(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      await order.updateStatus(status, note);

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: {
          orderId: order.id,
          status: order.status,
          statusHistory: order.statusHistory
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/orders/:id - Update order
router.put('/:id',
  commonValidation.validateId,
  async (req, res, next) => {
    try {
      const order = await Order.findByPk(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Prevent updating certain fields after order is confirmed
      if (order.status !== 'pending' && (req.body.items || req.body.shippingAddress)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot modify items or shipping address after order is confirmed'
        });
      }

      await order.update(req.body);

      res.json({
        success: true,
        message: 'Order updated successfully',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/orders/:id - Cancel order
router.delete('/:id',
  commonValidation.validateId,
  async (req, res, next) => {
    try {
      const order = await Order.findByPk(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Only allow cancellation for pending or confirmed orders
      if (!['pending', 'confirmed'].includes(order.status)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel order in current status'
        });
      }

      await order.updateStatus('cancelled', 'Order cancelled by request');

      // Restore product quantities
      for (const item of order.items) {
        const product = await Product.findByPk(item.productId);
        if (product && product.trackQuantity) {
          await product.update({ 
            quantity: product.quantity + item.quantity,
            salesCount: Math.max(0, product.salesCount - item.quantity)
          });
        }
      }

      res.json({
        success: true,
        message: 'Order cancelled successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
