// Product data with inventory
const products = [
    {
        id: 1,
        name: "Coca-Cola",
        description: "Refreshing carbonated soft drink",
        price: 150,
        stock: 20,
        image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Pepsi",
        description: "Delicious cola with a refreshing taste",
        price: 140,
        stock: 15,
        image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Fanta",
        description: "Sparkling orange flavored drink",
        price: 130,
        stock: 18,
        image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Sprite",
        description: "Crisp, lemon-lime flavored soda",
        price: 130,
        stock: 12,
        image: "https://images.unsplash.com/photo-1640145827375-58e21b5c5145?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
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
const uploadBtn = document.getElementById('upload-btn');
const emailBtn = document.getElementById('email-btn');
const receiptUpload = document.getElementById('receipt-upload');

// Display products with inventory
function displayProducts() {
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
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

// Email button functionality
emailBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Create order summary message
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let orderMessage = "ORDER DETAILS:%0D%0A%0D%0A";
    
    cart.forEach(item => {
        orderMessage += `- ${item.name} x ${item.quantity} = ₦${(item.price * item.quantity).toFixed(2)}%0D%0A`;
    });
    
    orderMessage += `%0D%0ATOTAL AMOUNT: ₦${total.toFixed(2)}%0D%0A%0D%0A`;
    orderMessage += "PAYMENT RECEIPT ATTACHED%0D%0A%0D%0A";
    orderMessage += "Customer Information:%0D%0A";
    orderMessage += "Name: [Your Name]%0D%0A";
    orderMessage += "Phone: [Your Phone Number]%0D%0A";
    orderMessage += "Address: [Your Address]%0D%0A%0D%0A";
    orderMessage += "Please process my order upon verification. Thank you!";
    
    // Open email client with your email address pre-filled
    const emailSubject = "Payment Receipt for Order from Ugbos Venture";
    window.location.href = `mailto:momodurakinoshioke@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${orderMessage}`;
    
    showNotification('Email client opened. Please attach your receipt and fill in your details.');
});

// Upload button
uploadBtn.addEventListener('click', () => {
    if (!receiptUpload.files.length) {
        showNotification('Please select a receipt file');
        return;
    }
    
    showNotification('Please use the Email option to send receipts with order details');
});

// Initialize the page
function init() {
    displayProducts();
    updateCart();
    
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