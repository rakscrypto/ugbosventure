// Product data (fallback if API fails)
const localProducts = [
    {
        id: 1,
        name: "Coca-Cola",
        price: 150,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
    },
    {
        id: 2,
        name: "Pepsi",
        price: 140,
        image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
        id: 3,
        name: "Fanta Orange",
        price: 130,
        image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80"
    },
    {
        id: 4,
        name: "Sprite",
        price: 130,
        image: "https://images.unsplash.com/photo-1642770310702-d56de5b50636?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
        id: 5,
        name: "7UP",
        price: 130,
        image: "https://images.unsplash.com/photo-1631549916788-30f2d5a2a4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
        id: 6,
        name: "Mountain Dew",
        price: 160,
        image: "https://images.unsplash.com/photo-1642770311236-0c6a7295c5b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
        id: 7,
        name: "Dr Pepper",
        price: 170,
        image: "https://images.unsplash.com/photo-1642770311881-2c1ffa3d58d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
        id: 8,
        name: "Fanta Lemon",
        price: 130,
        image: "https://images.unsplash.com/photo-1629203851283-08b63f53d308?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
        id: 9,
        name: "Tango Orange",
        price: 125,
        image: "https://images.unsplash.com/photo-1642770311236-0c6a7295c5b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
        id: 10,
        name: "Mirinda",
        price: 135,
        image: "https://images.unsplash.com/photo-1642770311236-0c6a7295c5b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    }
];

// API base URL - Update this to your backend URL
const API_BASE_URL = 'http://localhost:5000/api';

// Cart functionality
let cart = [];
let searchTimeout;
let products = [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const checkoutForm = document.getElementById('checkoutForm');
const signupForm = document.getElementById('signupForm');
const orderItems = document.getElementById('orderItems');
const orderTotal = document.getElementById('orderTotal');
const copyOrderBtn = document.getElementById('copyOrder');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');
const showCheckoutFormBtn = document.getElementById('showCheckoutForm');
const showSignupFormBtn = document.getElementById('showSignupForm');
const footerSignupBtn = document.getElementById('footerSignup');
const checkoutSection = document.getElementById('checkout');
const signupSection = document.getElementById('signup');
const cartIcon = document.querySelector('.fa-shopping-cart');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const searchResults = document.getElementById('searchResults');

// Initialize the application
async function init() {
    await loadProducts();
    setupEventListeners();
    setupSearch();
    checkLoggedInStatus();
}

// Check if user is logged in
function checkLoggedInStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        // Update UI to show logged in state
        const userData = JSON.parse(user);
        showNotification(`Welcome back, ${userData.name}!`, 'success');
        
        // Update sign up button to show account
        if (showSignupFormBtn) {
            showSignupFormBtn.textContent = 'My Account';
        }
    }
}

// Load products from API or fallback to local data
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.status === 'success') {
                products = data.data.products;
            } else {
                throw new Error('Failed to load products from API');
            }
        } else {
            throw new Error('API not available');
        }
    } catch (err) {
        console.error('Error loading products from API:', err);
        // Fallback to local products
        products = localProducts;
    }
    
    displayProducts(products);
}

// Display products in the grid
function displayProducts(productsToDisplay) {
    productsGrid.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">₦${product.price.toFixed(2)}</p>
                <button class="btn add-to-cart" data-id="${product._id || product.id}">Add to Cart</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Add to cart buttons
    productsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.getAttribute('data-id');
            addToCart(productId);
        }
    });
    
    // Checkout form submission
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        processOrder();
    });
    
    // Signup form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        processSignup();
    });
    
    // Copy order details
    copyOrderBtn.addEventListener('click', copyOrderDetails);
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Show checkout form
    showCheckoutFormBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showCheckoutForm();
    });
    
    // Show signup form
    showSignupFormBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSignupForm();
    });
    
    // Footer signup button
    footerSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSignupForm();
    });
}

// Setup search functionality
function setupSearch() {
    // Search input event
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        
        // Show/hide clear button
        if (this.value.length > 0) {
            clearSearchBtn.classList.add('active');
        } else {
            clearSearchBtn.classList.remove('active');
            searchResults.textContent = '';
            displayProducts(products); // Reset to show all products
            return;
        }
        
        // Debounce search
        searchTimeout = setTimeout(() => {
            performSearch(this.value);
        }, 300);
    });
    
    // Clear search button
    clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        clearSearchBtn.classList.remove('active');
        searchResults.textContent = '';
        displayProducts(products); // Reset to show all products
    });
    
    // Press Enter to search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(this.value);
        }
    });
}

// Perform search
function performSearch(query) {
    if (!query || query.length < 2) {
        searchResults.textContent = 'Please enter at least 2 characters to search';
        return;
    }
    
    const lowerCaseQuery = query.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(lowerCaseQuery)
    );
    
    displaySearchResults(filteredProducts, query);
}

// Display search results
function displaySearchResults(results, query) {
    if (results.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <h3>No drinks found</h3>
                <p>We couldn't find any drinks matching "${query}"</p>
                <button class="btn" id="clearSearchResults">Show All Drinks</button>
            </div>
        `;
        
        // Add event listener to the clear button
        document.getElementById('clearSearchResults').addEventListener('click', function() {
            searchInput.value = '';
            clearSearchBtn.classList.remove('active');
            searchResults.textContent = '';
            displayProducts(products);
        });
        
        searchResults.textContent = `No results found for "${query}"`;
    } else {
        searchResults.textContent = `Found ${results.length} product(s) matching "${query}"`;
        
        // Highlight the search term in results
        displayProducts(results);
    }
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => (p._id || p.id) === productId);
    
    if (!product) {
        showNotification('Product not found!', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    updateCartCount();
    showCartNotification(`${product.name} added to cart!`);
}

// Update cart count in the UI
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartCount > 0) {
        if (!cartIcon.nextElementSibling || !cartIcon.nextElementSibling.classList.contains('cart-count')) {
            const countBadge = document.createElement('span');
            countBadge.className = 'cart-count';
            countBadge.textContent = cartCount;
            cartIcon.parentNode.appendChild(countBadge);
        } else {
            cartIcon.nextElementSibling.textContent = cartCount;
        }
    } else if (cartIcon.nextElementSibling && cartIcon.nextElementSibling.classList.contains('cart-count')) {
        cartIcon.nextElementSibling.remove();
    }
}

// Show cart notification near the cart icon
function showCartNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    
    // Position it near the cart icon
    const cartElement = document.querySelector('#showCheckoutForm');
    const rect = cartElement.getBoundingClientRect();
    
    notification.style.position = 'fixed';
    notification.style.top = `${rect.bottom + window.scrollY + 10}px`;
    notification.style.right = `${window.innerWidth - rect.right}px`;
    notification.style.padding = '8px 16px';
    notification.style.borderRadius = 'var(--rounded)';
    notification.style.color = 'white';
    notification.style.fontWeight = '500';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = 'var(--shadow)';
    notification.style.animation = 'slideIn 0.3s ease';
    notification.style.background = 'var(--primary)';
    notification.style.fontSize = '0.9rem';
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Toggle mobile menu
function toggleMobileMenu() {
    mainNav.classList.toggle('active');
    
    // Create or remove overlay
    const overlay = document.querySelector('.nav-overlay');
    if (mainNav.classList.contains('active')) {
        if (!overlay) {
            const newOverlay = document.createElement('div');
            newOverlay.className = 'nav-overlay';
            document.body.appendChild(newOverlay);
            
            // Add close button to menu
            const closeButton = document.createElement('button');
            closeButton.className = 'mobile-close-btn';
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            mainNav.appendChild(closeButton);
            
            // Close menu when overlay is clicked
            newOverlay.addEventListener('click', closeMobileMenu);
            
            // Close menu when close button is clicked
            closeButton.addEventListener('click', closeMobileMenu);
        } else {
            overlay.classList.add('active');
        }
    } else {
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                if (overlay && overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    }
}

// Close mobile menu
function closeMobileMenu() {
    mainNav.classList.remove('active');
    const overlay = document.querySelector('.nav-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
    
    // Remove close button
    const closeButton = document.querySelector('.mobile-close-btn');
    if (closeButton && closeButton.parentNode) {
        closeButton.parentNode.removeChild(closeButton);
    }
}

// Show checkout form
function showCheckoutForm() {
    // Hide all form sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show checkout section
    checkoutSection.classList.remove('hidden');
    
    // Update order summary
    updateOrderSummary();
    
    // Scroll to checkout
    checkoutSection.scrollIntoView({ behavior: 'smooth' });
}

// Show signup form
function showSignupForm() {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        showNotification('You are already logged in!', 'success');
        return;
    }
    
    // Hide all form sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show signup section
    signupSection.classList.remove('hidden');
    
    // Scroll to signup
    signupSection.scrollIntoView({ behavior: 'smooth' });
}

// Update order summary
function updateOrderSummary() {
    orderItems.innerHTML = '';
    
    if (cart.length === 0) {
        orderItems.innerHTML = '<p>Your cart is empty</p>';
        orderTotal.textContent = '₦0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>₦${itemTotal.toFixed(2)}</span>
        `;
        orderItems.appendChild(orderItem);
    });
    
    orderTotal.textContent = `₦${total.toFixed(2)}`;
}

// Process order
async function processOrder() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
        showNotification('Please create an account or log in to complete your order', 'error');
        showSignupForm();
        return;
    }
    
    // Create order items for API
    const orderItemsForAPI = cart.map(item => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price
    }));
    
    try {
        // Create order in backend
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                items: orderItemsForAPI,
                totalAmount: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
                shippingAddress: {
                    name,
                    address,
                    phone
                }
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Create order summary for WhatsApp
            let orderSummary = `Order Details:\n`;
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                orderSummary += `${item.name} x${item.quantity} - ₦${itemTotal.toFixed(2)}\n`;
            });
            
            orderSummary += `\nTotal: ₦${total.toFixed(2)}\n`;
            orderSummary += `\nCustomer Information:\n`;
            orderSummary += `Name: ${name}\n`;
            orderSummary += `Address: ${address}\n`;
            orderSummary += `Phone: ${phone}\n`;
            orderSummary += `\nPlease transfer payment to:\n`;
            orderSummary += `Account Name: Ugbos Venture\n`;
            orderSummary += `Account Number: 7042104027\n`;
            orderSummary += `Bank: Opay`;
            
            // Replace with your actual WhatsApp number (with country code but without + or 0)
            const whatsappNumber = "2347042104027"; // Your WhatsApp number here
            
            // Encode for WhatsApp
            const encodedMessage = encodeURIComponent(orderSummary);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Show success message
            showNotification('Order placed successfully! Redirecting to WhatsApp...');
            
            // Clear cart
            cart = [];
            updateCartCount();
            
            // Reset form
            checkoutForm.reset();
        } else {
            showNotification('Error creating order: ' + data.message, 'error');
        }
    } catch (err) {
        console.error('Order processing error:', err);
        showNotification('Error processing order. Please try again.', 'error');
    }
}

// Process signup with API
async function processSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                passwordConfirm: confirmPassword
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Save token to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            
            showNotification('Account created successfully!');
            signupForm.reset();
            signupSection.classList.add('hidden');
            
            // Update UI
            if (showSignupFormBtn) {
                showSignupFormBtn.textContent = 'My Account';
            }
        } else {
            showNotification(data.message, 'error');
        }
    } catch (err) {
        showNotification('Error creating account. Please try again.', 'error');
        console.error('Signup error:', err);
    }
}

// Copy order details
function copyOrderDetails() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    
    if (!name || !address || !phone) {
        showNotification('Please fill in all customer information!', 'error');
        return;
    }
    
    // Create order summary
    let orderSummary = `Order Details:\n`;
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        orderSummary += `${item.name} x${item.quantity} - ₦${itemTotal.toFixed(2)}\n`;
    });
    
    orderSummary += `\nTotal: ₦${total.toFixed(2)}\n`;
    orderSummary += `\nCustomer Information:\n`;
    orderSummary += `Name: ${name}\n`;
    orderSummary += `Address: ${address}\n`;
    orderSummary += `Phone: ${phone}\n`;
    orderSummary += `\nPlease transfer payment to:\n`;
    orderSummary += `Account Name: Ugbos Venture\n`;
    orderSummary += `Account Number: 0123456789\n`;
    orderSummary += `Bank: Zenith Bank`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(orderSummary)
        .then(() => {
            showNotification('Order details copied to clipboard!');
        })
        .catch(err => {
            showNotification('Failed to copy order details!', 'error');
            console.error('Could not copy text: ', err);
        });
}

// Show notification (for other types of notifications)
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = 'var(--rounded)';
    notification.style.color = 'white';
    notification.style.fontWeight = '500';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = 'var(--shadow)';
    notification.style.animation = 'slideIn 0.3s ease';
    
    if (type === 'success') {
        notification.style.background = 'var(--primary)';
    } else {
        notification.style.background = '#e74c3c';
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .cart-count {
        background: var(--primary);
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        position: absolute;
        top: -5px;
        right: -5px;
    }
    
    #showCheckoutForm {
        position: relative;
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);