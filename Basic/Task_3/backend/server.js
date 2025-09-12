/* 
 * REST API Server for Yakubu's Frontend Showcase
 * Author: Yakubu Abdul Manaf
 * Email: yakubumamaf732hub@gmail.com
 * Description: Express.js REST API with CRUD operations for users resource
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for all routes
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// In-memory data store (in production, use a real database)
let users = [
    {
        id: uuidv4(),
        name: "Yakubu Abdul Manaf",
        email: "yakubumamaf732hub@gmail.com",
        role: "Fullstack Developer",
        avatar: "https://ui-avatars.com/api/?name=Yakubu+Abdul+Manaf&background=6366f1&color=fff&size=120",
        bio: "Passionate fullstack developer with expertise in modern web technologies",
        skills: ["JavaScript", "React", "Node.js", "CSS3", "HTML5"],
        joinDate: "2024-01-15",
        isActive: true,
        projects: 12,
        location: "Ghana"
    },
    {
        id: uuidv4(),
        name: "Sarah Johnson",
        email: "sarah.johnson@gmail.com",
        role: "UI/UX Designer",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=f59e0b&color=fff&size=120",
        bio: "Creative designer focused on user experience and interface design",
        skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
        joinDate: "2023-08-20",
        isActive: true,
        projects: 8,
        location: "Canada"
    },
    {
        id: uuidv4(),
        name: "Michael Chen",
        email: "michael.chen@gmails.com",
        role: "Full Stack Developer",
        avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=10b981&color=fff&size=120",
        bio: "Full stack developer with experience in both frontend and backend technologies",
        skills: ["Python", "Django", "React", "PostgreSQL", "Docker"],
        joinDate: "2023-03-10",
        isActive: true,
        projects: 15,
        location: "Singapore"
    },
    {
        id: uuidv4(),
        name: "Emily Rodriguez",
        email: "emily.rodriguez@gmail.com",
        role: "Backend Developer",
        avatar: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=ef4444&color=fff&size=120",
        bio: "Backend specialist with expertise in scalable server architectures",
        skills: ["Node.js", "Express", "MongoDB", "AWS", "Microservices"],
        joinDate: "2023-11-05",
        isActive: false,
        projects: 6,
        location: "Mexico"
    }
];

// Helper function to find user by ID
const findUserById = (id) => users.find(user => user.id === id);

// Helper function to validate user data
const validateUser = (userData) => {
    const errors = [];
    
    if (!userData.name || userData.name.trim().length < 2) {
        errors.push('Name is required and must be at least 2 characters long');
    }
    
    if (!userData.email || !isValidEmail(userData.email)) {
        errors.push('Valid email is required');
    }
    
    if (!userData.role || userData.role.trim().length < 2) {
        errors.push('Role is required and must be at least 2 characters long');
    }
    
    return errors;
};

// Helper function to validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// API Routes

// GET /api/health - Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API is running successfully',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// GET /api/users - Get all users with optional filtering and pagination
app.get('/api/users', asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, role, isActive, search } = req.query;
    
    let filteredUsers = [...users];
    
    // Filter by role
    if (role) {
        filteredUsers = filteredUsers.filter(user => 
            user.role.toLowerCase().includes(role.toLowerCase())
        );
    }
    
    // Filter by active status
    if (isActive !== undefined) {
        const activeStatus = isActive === 'true';
        filteredUsers = filteredUsers.filter(user => user.isActive === activeStatus);
    }
    
    // Search by name or email
    if (search) {
        filteredUsers = filteredUsers.filter(user =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    res.status(200).json({
        status: 'success',
        data: {
            users: paginatedUsers,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(filteredUsers.length / limit),
                totalUsers: filteredUsers.length,
                hasNext: endIndex < filteredUsers.length,
                hasPrev: startIndex > 0
            }
        },
        message: `Retrieved ${paginatedUsers.length} users successfully`
    });
}));

// GET /api/users/:id - Get a specific user by ID
app.get('/api/users/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = findUserById(id);
    
    if (!user) {
        return res.status(404).json({
            status: 'error',
            message: 'User not found',
            error: {
                code: 'USER_NOT_FOUND',
                details: `No user found with ID: ${id}`
            }
        });
    }
    
    res.status(200).json({
        status: 'success',
        data: { user },
        message: 'User retrieved successfully'
    });
}));

// POST /api/users - Create a new user
app.post('/api/users', asyncHandler(async (req, res) => {
    const userData = req.body;
    
    // Validate user data
    const validationErrors = validateUser(userData);
    if (validationErrors.length > 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            error: {
                code: 'VALIDATION_ERROR',
                details: validationErrors
            }
        });
    }
    
    // Check if email already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
        return res.status(409).json({
            status: 'error',
            message: 'User with this email already exists',
            error: {
                code: 'EMAIL_ALREADY_EXISTS',
                details: `Email ${userData.email} is already registered`
            }
        });
    }
    
    // Create new user
    const newUser = {
        id: uuidv4(),
        name: userData.name.trim(),
        email: userData.email.toLowerCase().trim(),
        role: userData.role.trim(),
        avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6366f1&color=fff&size=120`,
        bio: userData.bio || '',
        skills: userData.skills || [],
        joinDate: new Date().toISOString().split('T')[0],
        isActive: userData.isActive !== undefined ? userData.isActive : true,
        projects: userData.projects || 0,
        location: userData.location || ''
    };
    
    users.push(newUser);
    
    res.status(201).json({
        status: 'success',
        data: { user: newUser },
        message: 'User created successfully'
    });
}));

// PUT /api/users/:id - Update a user completely
app.put('/api/users/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userData = req.body;
    
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({
            status: 'error',
            message: 'User not found',
            error: {
                code: 'USER_NOT_FOUND',
                details: `No user found with ID: ${id}`
            }
        });
    }
    
    // Validate user data
    const validationErrors = validateUser(userData);
    if (validationErrors.length > 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            error: {
                code: 'VALIDATION_ERROR',
                details: validationErrors
            }
        });
    }
    
    // Check if email already exists (excluding current user)
    const existingUser = users.find(user => user.email === userData.email && user.id !== id);
    if (existingUser) {
        return res.status(409).json({
            status: 'error',
            message: 'User with this email already exists',
            error: {
                code: 'EMAIL_ALREADY_EXISTS',
                details: `Email ${userData.email} is already registered`
            }
        });
    }
    
    // Update user (keep original ID and joinDate)
    const updatedUser = {
        ...users[userIndex],
        name: userData.name.trim(),
        email: userData.email.toLowerCase().trim(),
        role: userData.role.trim(),
        avatar: userData.avatar || users[userIndex].avatar,
        bio: userData.bio || '',
        skills: userData.skills || [],
        isActive: userData.isActive !== undefined ? userData.isActive : users[userIndex].isActive,
        projects: userData.projects !== undefined ? userData.projects : users[userIndex].projects,
        location: userData.location || ''
    };
    
    users[userIndex] = updatedUser;
    
    res.status(200).json({
        status: 'success',
        data: { user: updatedUser },
        message: 'User updated successfully'
    });
}));

// PATCH /api/users/:id - Partially update a user
app.patch('/api/users/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({
            status: 'error',
            message: 'User not found',
            error: {
                code: 'USER_NOT_FOUND',
                details: `No user found with ID: ${id}`
            }
        });
    }
    
    // Validate only provided fields
    const errors = [];
    if (updates.name !== undefined && (!updates.name || updates.name.trim().length < 2)) {
        errors.push('Name must be at least 2 characters long');
    }
    if (updates.email !== undefined && !isValidEmail(updates.email)) {
        errors.push('Valid email is required');
    }
    if (updates.role !== undefined && (!updates.role || updates.role.trim().length < 2)) {
        errors.push('Role must be at least 2 characters long');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            error: {
                code: 'VALIDATION_ERROR',
                details: errors
            }
        });
    }
    
    // Check email uniqueness if email is being updated
    if (updates.email) {
        const existingUser = users.find(user => user.email === updates.email && user.id !== id);
        if (existingUser) {
            return res.status(409).json({
                status: 'error',
                message: 'User with this email already exists',
                error: {
                    code: 'EMAIL_ALREADY_EXISTS',
                    details: `Email ${updates.email} is already registered`
                }
            });
        }
    }
    
    // Apply updates
    const updatedUser = { ...users[userIndex] };
    Object.keys(updates).forEach(key => {
        if (key !== 'id' && key !== 'joinDate') { // Protect immutable fields
            if (key === 'name' || key === 'role') {
                updatedUser[key] = updates[key].trim();
            } else if (key === 'email') {
                updatedUser[key] = updates[key].toLowerCase().trim();
            } else {
                updatedUser[key] = updates[key];
            }
        }
    });
    
    users[userIndex] = updatedUser;
    
    res.status(200).json({
        status: 'success',
        data: { user: updatedUser },
        message: 'User updated successfully'
    });
}));

// DELETE /api/users/:id - Delete a user
app.delete('/api/users/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({
            status: 'error',
            message: 'User not found',
            error: {
                code: 'USER_NOT_FOUND',
                details: `No user found with ID: ${id}`
            }
        });
    }
    
    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);
    
    res.status(200).json({
        status: 'success',
        data: { user: deletedUser },
        message: 'User deleted successfully'
    });
}));

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
        error: {
            code: 'ROUTE_NOT_FOUND',
            details: `Cannot ${req.method} ${req.originalUrl}`
        }
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Error:', error);
    
    res.status(error.status || 500).json({
        status: 'error',
        message: error.message || 'Internal server error',
        error: {
            code: error.code || 'INTERNAL_SERVER_ERROR',
            details: process.env.NODE_ENV === 'development' ? error.stack : 'Something went wrong'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation:`);
    console.log(`   Health Check: GET http://localhost:${PORT}/api/health`);
    console.log(`   Get All Users: GET http://localhost:${PORT}/api/users`);
    console.log(`   Get User: GET http://localhost:${PORT}/api/users/:id`);
    console.log(`   Create User: POST http://localhost:${PORT}/api/users`);
    console.log(`   Update User: PUT http://localhost:${PORT}/api/users/:id`);
    console.log(`   Patch User: PATCH http://localhost:${PORT}/api/users/:id`);
    console.log(`   Delete User: DELETE http://localhost:${PORT}/api/users/:id`);
    console.log(`✅ Ready to accept requests!`);
});

module.exports = app;
