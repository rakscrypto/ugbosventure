// Product data with inventory
const products = [
    {
        id: 1,
        name: "Coca-Cola",
        description: "Refreshing carbonated soft drink",
        price: 150,
        stock: 20,
        image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "soda"
    },
    {
        id: 2,
        name: "Pepsi",
        description: "Delicious cola with a refreshing taste",
        price: 140,
        stock: 15,
        image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "soda"
    },
    {
        id: 3,
        name: "Fanta",
        description: "Sparkling orange flavored drink",
        price: 130,
        stock: 18,
        image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "soda"
    },
    {
        id: 4,
        name: "Sprite",
        description: "Crisp, lemon-lime flavored soda",
        price: 130,
        stock: 12,
        image: "https://images.unsplash.com/photo-1640145827375-58e21b5c5145?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "soda"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const modal = document.getElementById('checkout-modal');
const closeModal = document.querySelector('.close');
const whatsappBtn = document.getElementById('whatsapp-btn');
const copyOrderBtn = document.getElementById('copy-order-details');

// Display products with inventory
function displayProducts() {
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.category = product.category;
        
        // Determine stock status
        let stockClass = '';
        let buttonDisabled = '';
        let buttonText = 'Add to Cart';
        
        if (product.stock === 0) {
            stockClass = 'out-of-stock';
            buttonDisabled = 'disabled';
            buttonText = 'Out of Stock';
        } else if (product.stock < 5) {
            stockClass = 'low-stock';
        }
        
        // Create product image or placeholder
        let imageHtml = '';
        if (product.image) {
            imageHtml = `<img src="${product.image}" alt="${product.name}" onerror="handleImageError(this)">`;
        } else {
            imageHtml = `
                <div class="image-placeholder">
                    <i class="fas fa-wine-bottle"></i>
                </div>
            `;
        }
        
        productCard.innerHTML = `
            <div class="product-image">
                ${imageHtml}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="product-price">₦${product.price.toFixed(2)}</p>
                <p class="product-stock ${stockClass}">In stock: <span id="stock-${product.id}">${product.stock}</span></p>
                <button class="btn add-to-cart ${product.stock === 0 ? 'out-of-stock-btn' : ''}" 
                        data-id="${product.id}" ${buttonDisabled}>
                    ${buttonText}
                </button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                addToCart(productId);
            });
        }
    });
}

// Handle image loading errors
function handleImageError(img) {
    img.src = 'https://via.placeholder.com/300x200?text=Product+Image';
    img.alt = 'Product Image Placeholder';
    img.onerror = null; // Prevent infinite loop
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product.stock > 0) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            // Check if we have enough stock
            if (existingItem.quantity < product.stock) {
                existingItem.quantity += 1;
                updateInventory(productId, -1);
            } else {
                showNotification(`Only ${product.stock} ${product.name} available!`);
                return;
            }
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
            updateInventory(productId, -1);
        }
        
        updateCart();
        showNotification(`${product.name} added to cart!`);
    } else {
        showNotification(`${product.name} is out of stock!`);
    }
}

// Update inventory
function updateInventory(productId, change) {
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex !== -1) {
        products[productIndex].stock += change;
        
        // Ensure stock doesn't go below 0
        if (products[productIndex].stock < 0) {
            products[productIndex].stock = 0;
        }
        
        // Update stock display
        const stockElement = document.getElementById(`stock-${productId}`);
        if (stockElement) {
            stockElement.textContent = products[productIndex].stock;
            
            // Update stock class for styling
            const stockText = stockElement.closest('.product-stock');
            if (stockText) {
                if (products[productIndex].stock === 0) {
                    stockText.className = 'product-stock out-of-stock';
                    // Disable the add to cart button
                    const addButton = stockText.nextElementSibling;
                    if (addButton) {
                        addButton.className = 'btn add-to-cart out-of-stock-btn';
                        addButton.textContent = 'Out of Stock';
                        addButton.disabled = true;
                    }
                } else if (products[productIndex].stock < 5) {
                    stockText.className = 'product-stock low-stock';
                } else {
                    stockText.className = 'product-stock';
                }
            }
        }
    }
}

// Remove item from cart
function removeFromCart(productId, quantity) {
    cart = cart.filter(item => item.id !== productId);
    updateInventory(productId, quantity); // Return the quantity to inventory
    updateCart();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (item) {
        if (change > 0) {
            // Adding more items - check stock first
            if (product.stock > 0) {
                item.quantity += change;
                updateInventory(productId, -change);
            } else {
                showNotification(`No more ${product.name} in stock!`);
            }
        } else {
            // Removing items - return to inventory
            item.quantity += change; // change is negative
            updateInventory(productId, -change); // -change is positive
        }
        
        if (item.quantity <= 0) {
            removeFromCart(productId, item.quantity);
        } else {
            updateCart();
        }
    }
}

// Update cart display
function updateCart() {
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = '';
        
        cart.forEach(item => {
            let imageHtml = '';
            if (item.image) {
                imageHtml = `<img src="${item.image}" alt="${item.name}" onerror="handleCartImageError(this)">`;
            } else {
                imageHtml = `
                    <div class="image-placeholder">
                        <i class="fas fa-wine-bottle"></i>
                    </div>
                `;
            }
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    ${imageHtml}
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">₦${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">
                    ₦${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                updateQuantity(id, 1);
            });
        });
        
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                updateQuantity(id, -1);
            });
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.remove-item').getAttribute('data-id'));
                const item = cart.find(item => item.id === id);
                removeFromCart(id, item.quantity);
            });
        });
    }
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
    
    // Update WhatsApp link with order details
    updateWhatsAppLink();
    
    // Update order summary in modal
    updateOrderSummary();
}

// Update WhatsApp link with order details
function updateWhatsAppLink() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order details message
    let message = "Hello, I would like to place an order:%0A%0A";
    
    cart.forEach(item => {
        message += `${item.name} x ${item.quantity} - ₦${(item.price * item.quantity).toFixed(2)}%0A`;
    });
    
    message += `%0ATotal: ₦${total.toFixed(2)}%0A%0A`;
    message += "Please confirm availability and provide payment details.";
    
    whatsappBtn.href = `https://wa.me/2347042104027?text=${message}`;
}

// Update order summary in modal
function updateOrderSummary() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let orderSummary = "<h4>Your Order Details:</h4><ul>";
    
    cart.forEach(item => {
        orderSummary += `<li>${item.name} x ${item.quantity} - ₦${(item.price * item.quantity).toFixed(2)}</li>`;
    });
    
    orderSummary += `</ul><p><strong>Total: ₦${total.toFixed(2)}</strong></p>`;
    orderSummary += "<p>Please include this information when emailing your receipt.</p>";
    
    const orderSummaryElement = document.getElementById('email-order-summary');
    if (orderSummaryElement) {
        orderSummaryElement.innerHTML = orderSummary;
    }
}

// Handle cart image loading errors
function handleCartImageError(img) {
    img.src = 'https://via.placeholder.com/80x80?text=Product';
    img.alt = 'Product Image Placeholder';
    img.onerror = null; // Prevent infinite loop
}

// Show notification
function showNotification(message) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

// Copy order details to clipboard
copyOrderBtn.addEventListener('click', () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let orderDetails = "Order Details:\n\n";
    
    cart.forEach(item => {
        orderDetails += `${item.name} x ${item.quantity} - ₦${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    orderDetails += `\nTotal: ₦${total.toFixed(2)}\n\n`;
    orderDetails += "Please process my order upon verification. Thank you!";
    
    // Copy to clipboard
    navigator.clipboard.writeText(orderDetails).then(() => {
        showNotification('Order details copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy details. Please manually type your order.');
    });
});

// Product filtering and search
function initProductFilters() {
    const searchInput = document.getElementById('product-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterProducts(searchTerm);
    });
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            e.target.classList.add('active');
            
            // Filter products
            const filter = e.target.dataset.filter;
            filterProducts('', filter);
        });
    });
}

function filterProducts(searchTerm = '', filter = 'all') {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productDesc = card.querySelector('p').textContent.toLowerCase();
        const productCategory = card.dataset.category || 'soda';
        
        const matchesSearch = productName.includes(searchTerm) || productDesc.includes(searchTerm);
        const matchesFilter = filter === 'all' || productCategory === filter;
        
        if (matchesSearch && matchesFilter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize the page
function init() {
    displayProducts();
    updateCart();
    initProductFilters();
    
    // Checkout button event
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        
        modal.style.display = 'flex';
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);