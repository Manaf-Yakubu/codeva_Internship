/**
 * Professional Portfolio JavaScript
 * Author: Yakubu Abdul Manaf
 * Modern, clean JavaScript with proper error handling
 */

// API Configuration
const API_CONFIG = {
    users: {
        baseUrl: 'http://localhost:3001/api',
        fallbackUrl: 'https://jsonplaceholder.typicode.com'
    },
    quotes: {
        baseUrl: 'https://api.quotable.io'
    },
    github: {
        baseUrl: 'https://api.github.com',
        username: 'Manaf-Yakubu'
    }
};

// Global state
let users = [];
let currentQuote = null;
let githubProfile = null;

// DOM Elements
const elements = {
    navbar: document.getElementById('navbar'),
    navToggle: document.getElementById('nav-toggle'),
    navMenu: document.getElementById('nav-menu'),
    navLinks: document.querySelectorAll('.nav-link'),
    backToTop: document.getElementById('back-to-top'),
    loadUsersBtn: document.getElementById('load-users'),
    addUserBtn: document.getElementById('add-user'),
    refreshUsersBtn: document.getElementById('refresh-users'),
    usersContainer: document.getElementById('users-container'),
    quoteCard: document.getElementById('quote-card'),
    newQuoteBtn: document.getElementById('new-quote'),
    githubProfile: document.getElementById('github-profile'),
    contactForm: document.getElementById('contact-form')
};

// Utility Functions
const utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Show loading state
    showLoading(container, message = 'Loading...') {
        container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
    },

    // Show error state
    showError(container, message = 'Something went wrong') {
        container.innerHTML = `
            <div class="error" style="text-align: center; padding: 2rem; color: var(--danger-color);">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>${message}</p>
            </div>
        `;
    },

    // Format date
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Smooth scroll to element
    scrollTo(elementId) {
        const element = document.getElementById(elementId.replace('#', ''));
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'var(--accent-color)' : 'var(--danger-color)'};
            color: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'}"></i>
            <span style="margin-left: 0.5rem;">${message}</span>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
};

// API Functions
const api = {
    // Fetch with error handling
    async fetchWithFallback(url, fallbackUrl = null) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.warn(`Primary API failed: ${error.message}`);
            if (fallbackUrl) {
                console.log('Trying fallback API...');
                const fallbackResponse = await fetch(fallbackUrl);
                if (!fallbackResponse.ok) {
                    throw new Error(`Fallback API failed! status: ${fallbackResponse.status}`);
                }
                return await fallbackResponse.json();
            }
            throw error;
        }
    },

    // Get users
    async getUsers() {
        const primaryUrl = `${API_CONFIG.users.baseUrl}/users`;
        const fallbackUrl = `${API_CONFIG.users.fallbackUrl}/users`;
        return await this.fetchWithFallback(primaryUrl, fallbackUrl);
    },

    // Add user
    async addUser(userData) {
        try {
            const response = await fetch(`${API_CONFIG.users.baseUrl}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.warn('Local API not available, simulating user creation...');
            // Simulate user creation for demo
            const newUser = {
                id: Date.now(),
                name: userData.name,
                email: userData.email,
                username: userData.username || userData.name.toLowerCase().replace(/\s+/g, ''),
                website: userData.website || 'N/A',
                company: { name: userData.company || 'Freelancer' },
                address: { city: userData.city || 'Accra, Ghana' }
            };
            users.push(newUser);
            return newUser;
        }
    },

    // Delete user
    async deleteUser(userId) {
        try {
            const response = await fetch(`${API_CONFIG.users.baseUrl}/users/${userId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return true;
        } catch (error) {
            console.warn('Local API not available, simulating user deletion...');
            // Simulate user deletion for demo
            users = users.filter(user => user.id !== userId);
            return true;
        }
    },

    // Get random quote
    async getQuote() {
        try {
            const response = await fetch(`${API_CONFIG.quotes.baseUrl}/random?minLength=50&maxLength=150`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.warn('Quote API failed, using fallback quote...');
            // Fallback quotes
            const fallbackQuotes = [
                {
                    content: "The only way to do great work is to love what you do.",
                    author: "Steve Jobs"
                },
                {
                    content: "Innovation distinguishes between a leader and a follower.",
                    author: "Steve Jobs"
                },
                {
                    content: "Code is like humor. When you have to explain it, it's bad.",
                    author: "Cory House"
                },
                {
                    content: "First, solve the problem. Then, write the code.",
                    author: "John Johnson"
                },
                {
                    content: "The best error message is the one that never shows up.",
                    author: "Thomas Fuchs"
                }
            ];
            return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        }
    },

    // Get GitHub profile
    async getGitHubProfile() {
        try {
            const response = await fetch(`${API_CONFIG.github.baseUrl}/users/${API_CONFIG.github.username}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.warn('GitHub API failed, using fallback data...');
            // Fallback GitHub data
            return {
                login: 'Manaf-Yakubu',
                name: 'Yakubu Abdul Manaf',
                bio: 'Full Stack Developer passionate about creating amazing web experiences',
                avatar_url: 'https://via.placeholder.com/120x120/4f46e5/ffffff?text=YM',
                public_repos: 25,
                followers: 150,
                following: 75,
                html_url: 'https://github.com/Manaf-Yakubu',
                location: 'Accra, Ghana',
                company: 'Full Stack Developer'
            };
        }
    }
};

// UI Components
const components = {
    // Render user card
    renderUserCard(user) {
        return `
            <div class="user-card" data-user-id="${user.id}">
                <img src="${user.avatar || `https://via.placeholder.com/80x80/4f46e5/ffffff?text=${user.name.charAt(0)}`}" 
                     alt="${user.name}" class="user-avatar">
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <div class="user-role">${user.role || user.company?.name || 'Developer'}</div>
                    <p class="user-email">${user.email}</p>
                    <p style="color: var(--gray-500); font-size: 0.875rem; margin-top: 0.5rem;">
                        📍 ${user.location || user.address?.city || 'Location not specified'}
                    </p>
                    ${user.bio ? `<p style="color: var(--gray-600); font-size: 0.875rem; margin-top: 0.5rem; font-style: italic;">${user.bio}</p>` : ''}
                    <div style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: center;">
                        <button class="btn-small btn-danger" onclick="handleDeleteUser('${user.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                        ${user.website && user.website !== 'N/A' ? 
                            `<a href="http://${user.website}" target="_blank" class="btn-small btn-secondary">
                                <i class="fas fa-external-link-alt"></i>
                            </a>` : ''
                        }
                    </div>
                </div>
            </div>
        `;
    },

    // Render quote
    renderQuote(quote) {
        return `
            <div class="quote-icon">
                <i class="fas fa-quote-left"></i>
            </div>
            <blockquote>"${quote.content}"</blockquote>
            <cite>— ${quote.author}</cite>
        `;
    },

    // Render GitHub profile
    renderGitHubProfile(profile) {
        return `
            <div class="profile-card">
                <img src="${profile.avatar_url}" alt="${profile.name}" class="profile-avatar">
                <div class="profile-info">
                    <h3>${profile.name || profile.login}</h3>
                    <p>${profile.bio || 'Frontend Developer passionate about creating amazing web experiences.'}</p>
                    <div class="profile-stats">
                        <div class="stat">
                            <span class="stat-number">${profile.public_repos}</span>
                            <span class="stat-label">Repositories</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">${profile.followers}</span>
                            <span class="stat-label">Followers</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">${profile.following}</span>
                            <span class="stat-label">Following</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

// Event Handlers
const handlers = {
    // Navigation toggle
    handleNavToggle() {
        elements.navToggle.classList.toggle('active');
        elements.navMenu.classList.toggle('active');
        document.body.style.overflow = elements.navMenu.classList.contains('active') ? 'hidden' : '';
    },

    // Navigation link click
    handleNavClick(e) {
        if (e.target.classList.contains('nav-link')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            
            // Update active link
            elements.navLinks.forEach(link => link.classList.remove('active'));
            e.target.classList.add('active');
            
            // Close mobile menu
            elements.navToggle.classList.remove('active');
            elements.navMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Smooth scroll
            utils.scrollTo(targetId);
        }
    },

    // Scroll handling
    handleScroll: utils.debounce(() => {
        // Navbar background
        if (window.scrollY > 50) {
            elements.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            elements.navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            elements.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            elements.navbar.style.boxShadow = 'none';
        }

        // Back to top button
        if (window.scrollY > 300) {
            elements.backToTop.classList.add('visible');
        } else {
            elements.backToTop.classList.remove('visible');
        }

        // Update active nav link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 10),

    // Load users
    async handleLoadUsers() {
        const usersContainer = document.getElementById('users-container');
        if (!usersContainer) {
            console.error('Users container element not found');
            return;
        }
        
        utils.showLoading(usersContainer, 'Loading users...');
        
        try {
            const userData = await api.getUsers();
            console.log('Raw API response:', userData);
            
            // Handle the API response structure from backend
            if (userData.status === 'success' && userData.data && userData.data.users) {
                users = userData.data.users;
            } else if (Array.isArray(userData)) {
                users = userData;
            } else {
                users = userData.users || [];
            }
            
            console.log('Users loaded:', users.length, users);
            
            if (users.length === 0) {
                usersContainer.innerHTML = `
                    <div class="text-center" style="padding: 2rem;">
                        <i class="fas fa-users" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
                        <p style="color: var(--gray-600);">No users found. Try adding some users!</p>
                    </div>
                `;
                return;
            }
            
            usersContainer.innerHTML = `
                <div class="users-grid">
                    ${users.map(user => components.renderUserCard(user)).join('')}
                </div>
            `;
            
            utils.showNotification(`Loaded ${users.length} users successfully!`);
        } catch (error) {
            console.error('Error loading users:', error);
            utils.showError(usersContainer, 'Failed to load users. Please try again.');
            utils.showNotification('Failed to load users', 'error');
        }
    },

    // Add user
    async handleAddUser() {
        const name = prompt('Enter user name:');
        if (!name) return;
        
        const email = prompt('Enter user email:');
        if (!email) return;
        
        const company = prompt('Enter company (optional):') || 'Freelancer';
        const city = prompt('Enter city (optional):') || 'Accra, Ghana';
        
        try {
            const newUser = await api.addUser({
                name: name.trim(),
                email: email.trim(),
                company: company.trim(),
                city: city.trim()
            });
            
            // Refresh users display
            await handlers.handleLoadUsers();
            utils.showNotification('User added successfully!');
        } catch (error) {
            console.error('Error adding user:', error);
            utils.showNotification('Failed to add user', 'error');
        }
    },

    // Delete user
    async handleDeleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user?')) return;
        
        try {
            await api.deleteUser(userId);
            await handlers.handleLoadUsers();
            utils.showNotification('User deleted successfully!');
        } catch (error) {
            console.error('Error deleting user:', error);
            utils.showNotification('Failed to delete user', 'error');
        }
    },

    // Load quote
    async handleLoadQuote() {
        const quoteCard = document.getElementById('quote-card');
        if (!quoteCard) {
            console.error('Quote card element not found');
            return;
        }
        
        utils.showLoading(quoteCard, 'Loading inspirational quote...');
        
        try {
            currentQuote = await api.getQuote();
            quoteCard.innerHTML = components.renderQuote(currentQuote);
            console.log('Quote loaded successfully:', currentQuote);
        } catch (error) {
            console.error('Error loading quote:', error);
            utils.showError(quoteCard, 'Failed to load quote. Please try again.');
        }
    },

    // Load GitHub profile
    async handleLoadGitHub() {
        const githubProfile = document.getElementById('github-profile');
        if (!githubProfile) {
            console.error('GitHub profile element not found');
            return;
        }
        
        utils.showLoading(githubProfile, 'Loading GitHub profile...');
        
        try {
            const profileData = await api.getGitHubProfile();
            githubProfile.innerHTML = components.renderGitHubProfile(profileData);
        } catch (error) {
            console.error('Error loading GitHub profile:', error);
            utils.showError(githubProfile, 'Failed to load GitHub profile. Please try again.');
        }
    },

    // Handle contact form
    handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Simulate form submission
        console.log('Contact form submitted:', data);
        utils.showNotification('Message sent successfully! I\'ll get back to you soon.');
        e.target.reset();
    },

    // Back to top
    handleBackToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

// Global functions for inline event handlers
window.handleDeleteUser = handlers.handleDeleteUser;

// Initialize application
function init() {
    console.log('🚀 Portfolio initialized');
    
    // Wait for DOM to be fully loaded
    setTimeout(() => {
        // Re-query elements to ensure they exist
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const loadUsersBtn = document.getElementById('load-users');
        const addUserBtn = document.getElementById('add-user');
        const refreshUsersBtn = document.getElementById('refresh-users');
        const newQuoteBtn = document.getElementById('new-quote');
        const contactForm = document.getElementById('contact-form');
        const backToTop = document.getElementById('back-to-top');
        
        console.log('Elements found:', {
            navToggle: !!navToggle,
            navMenu: !!navMenu,
            loadUsersBtn: !!loadUsersBtn,
            newQuoteBtn: !!newQuoteBtn
        });
        
        // Navigation events with explicit checks
        if (navToggle) {
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Hamburger clicked');
                navToggle.classList.toggle('active');
                if (navMenu) {
                    navMenu.classList.toggle('active');
                    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
                }
            });
        }
        
        if (navMenu) {
            navMenu.addEventListener('click', handlers.handleNavClick);
        }
        
        // Scroll events
        window.addEventListener('scroll', handlers.handleScroll);
        
        // User management events
        if (loadUsersBtn) {
            loadUsersBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Load users clicked');
                handlers.handleLoadUsers();
            });
        }
        
        if (addUserBtn) {
            addUserBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handlers.handleAddUser();
            });
        }
        
        if (refreshUsersBtn) {
            refreshUsersBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handlers.handleLoadUsers();
            });
        }
        
        // Quote events
        if (newQuoteBtn) {
            newQuoteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('New quote clicked');
                handlers.handleLoadQuote();
            });
        }
        
        // Contact form
        if (contactForm) {
            contactForm.addEventListener('submit', handlers.handleContactForm);
        }
        
        // Back to top
        if (backToTop) {
            backToTop.addEventListener('click', handlers.handleBackToTop);
        }
        
        // Load initial data
        handlers.handleLoadQuote();
        handlers.handleLoadGitHub();
        
    }, 100);
    
    // Add CSS for small buttons
    const style = document.createElement('style');
    style.textContent = `
        .btn-small {
            padding: 0.5rem;
            font-size: 0.875rem;
            border: none;
            border-radius: var(--radius-sm);
            cursor: pointer;
            transition: all var(--transition);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 35px;
            height: 35px;
        }
        .btn-small.btn-danger {
            background: var(--danger-color);
            color: white;
        }
        .btn-small.btn-danger:hover {
            background: #dc2626;
            transform: translateY(-1px);
        }
        .btn-small.btn-secondary {
            background: var(--gray-200);
            color: var(--gray-700);
        }
        .btn-small.btn-secondary:hover {
            background: var(--gray-300);
            transform: translateY(-1px);
        }
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
