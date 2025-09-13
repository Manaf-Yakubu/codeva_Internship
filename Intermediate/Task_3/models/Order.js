const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    validate: {
      isValidItems(value) {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error('Order must have at least one item');
        }
        value.forEach(item => {
          if (!item.productId || !item.quantity || !item.price) {
            throw new Error('Each item must have productId, quantity, and price');
          }
          if (item.quantity < 1) {
            throw new Error('Quantity must be at least 1');
          }
          if (item.price < 0) {
            throw new Error('Price cannot be negative');
          }
        });
      }
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
    defaultValue: 'pending'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'mobile_money', 'card', 'bank_transfer', 'paystack'),
    allowNull: false
  },
  paymentDetails: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  // Ghana-specific payment methods
  mobileMoneyDetails: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: [0], msg: 'Subtotal cannot be negative' }
    }
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Tax cannot be negative' }
    }
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Shipping cost cannot be negative' }
    }
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Discount cannot be negative' }
    }
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: [0], msg: 'Total cannot be negative' }
    }
  },
  currency: {
    type: DataTypes.ENUM('GHS', 'USD', 'EUR'),
    defaultValue: 'GHS'
  },
  // Shipping Address
  shippingFirstName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  shippingLastName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  shippingPhone: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  shippingEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true }
  },
  shippingStreet: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingCity: {
    type: DataTypes.ENUM('Accra', 'Kumasi', 'Tamale', 'Cape Coast', 'Sekondi-Takoradi', 'Sunyani', 'Koforidua', 'Ho', 'Wa', 'Bolgatanga'),
    allowNull: false
  },
  shippingRegion: {
    type: DataTypes.ENUM('Greater Accra', 'Ashanti', 'Northern', 'Central', 'Western', 'Brong-Ahafo', 'Eastern', 'Volta', 'Upper West', 'Upper East'),
    allowNull: false
  },
  shippingPostalCode: {
    type: DataTypes.STRING(10)
  },
  shippingCountry: {
    type: DataTypes.STRING(50),
    defaultValue: 'Ghana'
  },
  shippingInstructions: {
    type: DataTypes.TEXT
  },
  // Billing Address
  billingAddress: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  // Shipping Method
  shippingMethod: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidShippingMethod(value) {
        if (!value.name || !value.cost) {
          throw new Error('Shipping method must have name and cost');
        }
      }
    }
  },
  // Tracking
  tracking: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  // Notes
  notes: {
    type: DataTypes.JSONB,
    defaultValue: { customer: '', admin: '', vendor: '' }
  },
  // Status History
  statusHistory: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
}, {
  tableName: 'orders',
  indexes: [
    { fields: ['orderNumber'], unique: true },
    { fields: ['userId'] },
    { fields: ['status'] },
    { fields: ['paymentStatus'] },
    { fields: ['createdAt'] },
    { fields: ['shippingCity'] },
    { fields: ['shippingRegion'] },
    { fields: ['paymentMethod'] }
  ],
  hooks: {
    beforeCreate: (order) => {
      // Generate order number if not exists
      if (!order.orderNumber) {
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        order.orderNumber = `ORD-${timestamp}-${random}`;
      }
      
      // Calculate subtotal and total
      if (order.items && order.items.length > 0) {
        order.subtotal = order.items.reduce((total, item) => {
          item.total = item.quantity * item.price;
          return total + item.total;
        }, 0);
        
        order.total = parseFloat(order.subtotal) + parseFloat(order.tax || 0) + 
                     parseFloat(order.shippingCost || 0) - parseFloat(order.discount || 0);
      }
      
      // Initialize status history
      if (!order.statusHistory || order.statusHistory.length === 0) {
        order.statusHistory = [{
          status: order.status,
          timestamp: new Date(),
          note: 'Order created'
        }];
      }
    },
    beforeUpdate: (order) => {
      // Recalculate totals if items changed
      if (order.changed('items') && order.items && order.items.length > 0) {
        order.subtotal = order.items.reduce((total, item) => {
          item.total = item.quantity * item.price;
          return total + item.total;
        }, 0);
        
        order.total = parseFloat(order.subtotal) + parseFloat(order.tax || 0) + 
                     parseFloat(order.shippingCost || 0) - parseFloat(order.discount || 0);
      }
      
      // Add to status history if status changed
      if (order.changed('status')) {
        const history = order.statusHistory || [];
        history.push({
          status: order.status,
          timestamp: new Date(),
          note: `Order status changed to ${order.status}`
        });
        order.statusHistory = history;
      }
    }
  }
});

// Instance methods
Order.prototype.getCustomerName = function() {
  return `${this.shippingFirstName} ${this.shippingLastName}`;
};

Order.prototype.getItemCount = function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
};

Order.prototype.updateStatus = async function(newStatus, note = '', updatedBy = null) {
  const history = this.statusHistory || [];
  history.push({
    status: newStatus,
    timestamp: new Date(),
    note: note,
    updatedBy: updatedBy
  });
  
  this.status = newStatus;
  this.statusHistory = history;
  
  // Update payment status for certain order statuses
  if (newStatus === 'delivered' && this.paymentStatus === 'pending') {
    this.paymentStatus = 'paid';
    const paymentDetails = this.paymentDetails || {};
    paymentDetails.paidAt = new Date();
    this.paymentDetails = paymentDetails;
  }
  
  return await this.save();
};

Order.prototype.calculateShippingCost = function() {
  const region = this.shippingRegion;
  const baseRates = {
    'Greater Accra': 15,
    'Ashanti': 25,
    'Central': 20,
    'Western': 30,
    'Eastern': 25,
    'Volta': 35,
    'Northern': 40,
    'Brong-Ahafo': 35,
    'Upper West': 45,
    'Upper East': 45
  };
  
  const baseRate = baseRates[region] || 30;
  const weightMultiplier = this.items.reduce((total, item) => total + (item.quantity * 0.5), 0);
  
  return Math.round(baseRate + (weightMultiplier * 2));
};

// Static methods
Order.getOrderStats = async function(dateRange = {}) {
  const where = {};
  
  if (dateRange.start && dateRange.end) {
    where.createdAt = {
      [sequelize.Sequelize.Op.between]: [new Date(dateRange.start), new Date(dateRange.end)]
    };
  }
  
  const stats = await this.findAll({
    where,
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders'],
      [sequelize.fn('SUM', sequelize.col('total')), 'totalRevenue'],
      [sequelize.fn('AVG', sequelize.col('total')), 'averageOrderValue'],
      [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'pending' THEN 1 END")), 'pendingOrders'],
      [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'delivered' THEN 1 END")), 'completedOrders'],
      [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'cancelled' THEN 1 END")), 'cancelledOrders']
    ],
    raw: true
  });
  
  return stats[0] || {};
};

Order.getOrdersByRegion = async function() {
  return await this.findAll({
    attributes: [
      'shippingRegion',
      [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount'],
      [sequelize.fn('SUM', sequelize.col('total')), 'totalRevenue']
    ],
    group: ['shippingRegion'],
    order: [[sequelize.literal('orderCount'), 'DESC']],
    raw: true
  });
};

Order.getPaymentMethodStats = async function() {
  return await this.findAll({
    attributes: [
      'paymentMethod',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount']
    ],
    group: ['paymentMethod'],
    order: [[sequelize.literal('count'), 'DESC']],
    raw: true
  });
};

module.exports = Order;
