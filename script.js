// Student: Satoria Somers, 2306905

// CART SYSTEM FUNCTIONS

function getCart() {
    const cartString = localStorage.getItem('cart');
    if (cartString) {
        return JSON.parse(cartString);
    } else {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Updates the cart badge number in navigation
 
function updateCartBadge() {
    const cart = getCart();
    let totalItems = 0;
    for (let i = 0; i < cart.length; i++) {
        totalItems = totalItems + cart[i].quantity;
    }
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = totalItems;
    }
}

// EVENT HANDLER - Adds product to shopping cart

function addToCart() {
    const productName = document.querySelector('.product-detail-name').textContent;
    const priceText = document.querySelector('.product-detail-price').textContent;
    const productPrice = parseFloat(priceText.replace('$', ''));
    const productImage = document.querySelector('.main-product-image').src;
    
    const selectedSize = document.querySelector('.size-option.active');
    if (!selectedSize) {
        alert('Please select a size!');
        return;
    }
    const size = selectedSize.textContent;
    
    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput.value);
    
    const noteInput = document.getElementById('note');
    const note = noteInput.value;
    
    const cartItem = {
        id: Date.now(),
        name: productName,
        price: productPrice,
        image: productImage,
        size: size,
        quantity: quantity,
        note: note
    };
    
    const cart = getCart();
    cart.push(cartItem);
    saveCart(cart);
    updateCartBadge();
    alert('Added to cart!');
}

// CART PAGE FUNCTIONS

// Displays all cart items on cart page

function displayCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (!cartItemsContainer) {
        return;
    }
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        updateCartTotal();
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const itemTotal = item.price * item.quantity;
        
        const cartItemHTML = `
            <div class="cart-item-simple">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Size: ${item.size} | Qty: ${item.quantity}</p>
                    ${item.note ? `<p class="item-note">Note: ${item.note}</p>` : ''}
                </div>
                <div class="cart-item-price-section">
                    <p class="item-price">$${itemTotal.toFixed(2)}</p>
                    <button class="remove-btn-simple" onclick="removeFromCart(${i})">Remove</button>
                </div>
            </div>
        `;
        
        cartItemsContainer.innerHTML += cartItemHTML;
    }
    
    updateCartTotal();
}

// Removes an item from the cart

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    displayCart();
    updateCartBadge();
}

// Calculates and displays cart total

function updateCartTotal() {
    const cart = getCart();
    
    // Calculate subtotal using a loop 
    let subtotal = 0;
    for (let i = 0; i < cart.length; i++) {
        const itemTotal = cart[i].price * cart[i].quantity;
        subtotal = subtotal + itemTotal;
    }
    
    // Calculate 2% discount
    const discountAmount = subtotal * 0.02;
    
    // Calculate subtotal after discount
    const subtotalAfterDiscount = subtotal - discountAmount;
    
    // Calculate 10% tax on discounted amount
    const taxAmount = subtotalAfterDiscount * 0.10;
    
    // Calculate final total
    const finalTotal = subtotalAfterDiscount + taxAmount;
    
    //  Update all total elements
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    // Check if elements exist before updating
    if (subtotalElement) {
        subtotalElement.textContent = '$' + subtotal.toFixed(2);
    }
    if (discountElement) {
        discountElement.textContent = '-$' + discountAmount.toFixed(2);
    }
    if (taxElement) {
        taxElement.textContent = '$' + taxAmount.toFixed(2);
    }
    if (totalElement) {
        totalElement.textContent = '$' + finalTotal.toFixed(2);
    }
}
// CHECKOUT PAGE FUNCTIONS

// Displays order summary on checkout page

function displayOrderSummary() {
    const cart = getCart();
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (!orderItemsContainer) {
        return;
    }
    
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty. <a href="products.html">Start shopping!</a></div>';
        
        const amountPaid = document.getElementById('amountPaid');
        const summarySubtotal = document.getElementById('summarySubtotal');
        const summaryTotal = document.getElementById('summaryTotal');
        
        if (amountPaid) amountPaid.value = '0.00';
        if (summarySubtotal) summarySubtotal.textContent = '$0.00';
        if (summaryTotal) summaryTotal.textContent = '$0.00';
        return;
    }
    
    orderItemsContainer.innerHTML = '';
    
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const itemTotal = item.price * item.quantity;
        
        const orderItemHTML = `
    <div class="order-item">
        <div class="order-item-details">
            <h4>${item.name}</h4>
            <p>Size: ${item.size}</p>
            <p>Quantity: ${item.quantity}</p>
            <p class="order-item-price">$${itemTotal.toFixed(2)}</p>
        </div>
    </div>
`;
        
        orderItemsContainer.innerHTML += orderItemHTML;
    }
    
    updateCheckoutTotal();
}

// Calculates checkout totals
function updateCheckoutTotal() {
    const cart = getCart();
    
    // Calculate subtotal
    let subtotal = 0;
    for (let i = 0; i < cart.length; i++) {
        subtotal = subtotal + (cart[i].price * cart[i].quantity);
    }
    
    // Calculate 2% discount
    const discountAmount = subtotal * 0.02;
    
    // Calculate subtotal after discount
    const subtotalAfterDiscount = subtotal - discountAmount;
    
    // Calculate 10% tax on discounted amount
    const taxAmount = subtotalAfterDiscount * 0.10;
    
    // Calculate final total
    const finalTotal = subtotalAfterDiscount + taxAmount;
    
    // Update all total elements
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryDiscount = document.getElementById('summaryDiscount');
    const summaryTax = document.getElementById('summaryTax');
    const summaryTotal = document.getElementById('summaryTotal');
    
    if (summarySubtotal) summarySubtotal.textContent = '$' + subtotal.toFixed(2);
    if (summaryDiscount) summaryDiscount.textContent = '-$' + discountAmount.toFixed(2);
    if (summaryTax) summaryTax.textContent = '$' + taxAmount.toFixed(2);
    if (summaryTotal) summaryTotal.textContent = '$' + finalTotal.toFixed(2);
}

// Cancels checkout and returns to cart
 
function cancelCheckout() {
    if (confirm('Are you sure you want to cancel? Your cart items will be saved.')) {
        window.location.href = 'cart.html';
    }
}

// Closes checkout and returns to home

function closeCheckout() {
    window.location.href = 'index.html';
}

// USER AUTHENTICATION FUNCTIONS

// Gets all registered users from storage
 
function getUsers() {
    const usersString = localStorage.getItem('users');
    if (usersString) {
        return JSON.parse(usersString);
    } else {
        return [];
    }
}

// Saves users to storage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Gets current logged in user
 
function getCurrentUser() {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
        return JSON.parse(userString);
    } else {
        return null;
    }
}

// Saves current user to storage

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Logs out user

function clearCurrentUser() {
    localStorage.removeItem('currentUser');
}

// Opens authentication modal
 function openAuthModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

// Closes authentication modal
function closeAuthModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Switches from login to register modal

function switchToRegister() {
    closeAuthModal('loginModal');
    openAuthModal('registerModal');
}

// Switches from register to login modal
function switchToLogin() {
    closeAuthModal('registerModal');
    openAuthModal('loginModal');
}

// Handles user registration
function handleRegister(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('regFullName').value;
    const dob = document.getElementById('regDOB').value;
    const email = document.getElementById('regEmail').value;
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    const users = getUsers();
    
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username || users[i].email === email) {
            alert('Username or email already exists!');
            return;
        }
    }
    
    const newUser = {
        id: Date.now(),
        fullName: fullName,
        dob: dob,
        email: email,
        username: username,
        password: password,
        registeredDate: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    const userToLogin = {
        id: newUser.id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email
    };
    setCurrentUser(userToLogin);
    
    closeAuthModal('registerModal');
    updateAuthUI();
    
    alert('Registration successful! Welcome, ' + fullName + '!');
    
    document.getElementById('registerForm').reset();
}

// Handles user login

function handleLogin(event) {
    event.preventDefault();
    
    const usernameOrEmail = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = getUsers();
    let foundUser = null;
    
    for (let i = 0; i < users.length; i++) {
        if ((users[i].username === usernameOrEmail || users[i].email === usernameOrEmail) 
            && users[i].password === password) {
            foundUser = users[i];
            break;
        }
    }
    
    if (!foundUser) {
        alert('Invalid username/email or password!');
        return;
    }
    
    const userToLogin = {
        id: foundUser.id,
        fullName: foundUser.fullName,
        username: foundUser.username,
        email: foundUser.email
    };
    setCurrentUser(userToLogin);
    
    closeAuthModal('loginModal');
    updateAuthUI();
    
    alert('Welcome back, ' + foundUser.fullName + '!');
    
    document.getElementById('loginForm').reset();
}

// Logs out current user

function handleLogout(event) {
    event.preventDefault();
    
    if (confirm('Are you sure you want to logout?')) {
        clearCurrentUser();
 	localStorage.removeItem('cart');
        updateCartBadge();
        updateAuthUI();
        alert('You have been logged out.');
    }
}

// Updates UI based on login state
 
function updateAuthUI() {
    const currentUser = getCurrentUser();
    const notLoggedIn = document.getElementById('notLoggedIn');
    const loggedIn = document.getElementById('loggedIn');
    const userName = document.getElementById('userName');
    
    if (!notLoggedIn || !loggedIn) {
        return;
    }
    
    if (currentUser) {
        notLoggedIn.style.display = 'none';
        loggedIn.style.display = 'block';
        
        if (userName) {
            const firstName = currentUser.fullName.split(' ')[0];
            userName.textContent = firstName;
        }
    } else {
        notLoggedIn.style.display = 'block';
        loggedIn.style.display = 'none';
    }
}

// Toggles account dropdown menu
 
function toggleAccountMenu() {
    const accountMenu = document.getElementById('accountMenu');
    if (accountMenu) {
        accountMenu.classList.toggle('active');
    }
}

// Shows login modal if user is not logged in

function checkAndPromptLogin() {
    const currentUser = getCurrentUser();   
    if (!currentUser) {
        setTimeout(function() {
            openAuthModal('loginModal');
        }, 1000);
    }
}

// INVOICE FUNCTIONS

//  Generates a random invoice number

function generateInvoiceNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return 'INV-' + timestamp + '-' + random;
}

// Gets current date in readable format

function getCurrentDate() {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Calculates tax (10% of subtotal)

function calculateTax(subtotal) {
    return subtotal * 0.10;
}

// Calculates discount

function calculateDiscount(subtotal) {
    return subtotal * 0.02;
}

// Loads invoice data and displays it
    function loadInvoice() {
    const orderData = JSON.parse(localStorage.getItem('orderData') || '{}');
    const cart = JSON.parse(localStorage.getItem('invoiceCart') || '[]');
    
    if (!orderData.fullName) {
        alert('No order data found!');
        window.location.href = 'checkout.html';
        return;
    }
    
    const invoiceNumberElement = document.getElementById('invoiceNumber');
    const invoiceDateElement = document.getElementById('invoiceDate');
    
    if (invoiceNumberElement) invoiceNumberElement.textContent = generateInvoiceNumber();
    if (invoiceDateElement) invoiceDateElement.textContent = getCurrentDate();
    
    const customerNameElement = document.getElementById('customerName');
    const customerEmailElement = document.getElementById('customerEmail');
    const customerPhoneElement = document.getElementById('customerPhone');
    
    if (customerNameElement) customerNameElement.textContent = orderData.fullName;
    if (customerEmailElement) customerEmailElement.textContent = orderData.email;
    if (customerPhoneElement) customerPhoneElement.textContent = orderData.phone;
    
    const shippingAddressElement = document.getElementById('shippingAddress');
    const shippingCityElement = document.getElementById('shippingCity');
    const shippingCountryElement = document.getElementById('shippingCountry');
    
    if (shippingAddressElement) shippingAddressElement.textContent = orderData.address;
    if (shippingCityElement) {
        shippingCityElement.textContent = orderData.city + ', ' + orderData.state + ' ' + orderData.zipCode;
    }
    if (shippingCountryElement) shippingCountryElement.textContent = orderData.country;
    
    const itemsTableBody = document.getElementById('invoiceItems');
    
    if (!itemsTableBody) {
        return;
    }
    
    itemsTableBody.innerHTML = '';
    
    let subtotal = 0;
    
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.size}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${itemTotal.toFixed(2)}</td>
        `;
        itemsTableBody.appendChild(row);
    }
    
    const discount = calculateDiscount(subtotal);
    const subtotalAfterDiscount = subtotal - discount;
    const tax = calculateTax(subtotalAfterDiscount);
    const total = subtotalAfterDiscount + tax;
    
    const invoiceSubtotalElement = document.getElementById('invoiceSubtotal');
    const invoiceDiscountElement = document.getElementById('invoiceDiscount');
    const invoiceTaxElement = document.getElementById('invoiceTax');
    const invoiceShippingElement = document.getElementById('invoiceShipping');
    const invoiceTotalElement = document.getElementById('invoiceTotal');
    
    if (invoiceSubtotalElement) invoiceSubtotalElement.textContent = '$' + subtotal.toFixed(2);
    if (invoiceDiscountElement) {
        invoiceDiscountElement.textContent = discount > 0 ? '-$' + discount.toFixed(2) : '$0.00';
    }
    if (invoiceTaxElement) invoiceTaxElement.textContent = '$' + tax.toFixed(2);
    if (invoiceShippingElement) invoiceShippingElement.textContent = 'FREE';
    if (invoiceTotalElement) invoiceTotalElement.textContent = '$' + total.toFixed(2);
}

// CONTACT FORM FUNCTIONS

// Handles contact form submission

function handleContactForm(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    console.log('Form submitted:', { fullName, email, phone, message });
    
   
    alert('Thank you for contacting us, ' + fullName + '! We will get back to you soon.');
    
    // Reset the form
    const form = document.getElementById('contactForm');
    if (form) {
        form.reset();
    }
}


// QUANTITY CONTROL FUNCTIONS

// Increases product quantity
function increaseQty() {
    const qtyInput = document.getElementById('quantity');
    if (qtyInput) {
        const currentQty = parseInt(qtyInput.value);
        qtyInput.value = currentQty + 1;
    }
}

// Decreases product quantity
function decreaseQty() {
    const qtyInput = document.getElementById('quantity');
    if (qtyInput) {
        const currentQty = parseInt(qtyInput.value);
        if (currentQty > 1) {
            qtyInput.value = currentQty - 1;
        }
    }
}

// PAGE INITIALIZATION - EVENT LISTENERS

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart badge and auth UI on every page
    updateCartBadge();
    updateAuthUI();
    
    // AUTO LOGIN PROMPT
    checkAndPromptLogin();
    
    // INVOICE PAGE - Load invoice if on invoice page
    if (document.getElementById('invoiceItems')) {
        loadInvoice();
    }
    
    // Add to Cart button
    const addCartBtn = document.querySelector('.add-cart-btn');
    if (addCartBtn) {
        addCartBtn.addEventListener('click', addToCart);
    }
    
    // Size selection buttons
    const sizeButtons = document.querySelectorAll('.size-option');
    for (let i = 0; i < sizeButtons.length; i++) {
        sizeButtons[i].addEventListener('click', function() {
            for (let j = 0; j < sizeButtons.length; j++) {
                sizeButtons[j].classList.remove('active');
            }
            this.classList.add('active');
        });
    }
    
    // CART PAGE
    const cartItemsContainer = document.getElementById('cartItems');
    if (cartItemsContainer) {
        displayCart();
    }
    
    // CHECKOUT PAGE
    const orderItemsContainer = document.getElementById('orderItems');
    if (orderItemsContainer) {
        displayOrderSummary();
    }
    
    // Checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const cart = getCart();
            
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            // Get all form data
            const orderData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zipCode: document.getElementById('zipCode').value,
                country: document.getElementById('country').value,
                orderDate: new Date().toISOString()
            };
            
            // Save order data and cart to localStorage for invoice
            localStorage.setItem('orderData', JSON.stringify(orderData));
            localStorage.setItem('invoiceCart', JSON.stringify(cart));
            
            // Clear the cart
            localStorage.removeItem('cart');
            updateCartBadge();
            
            // Redirect to invoice page
            window.location.href = 'invoice.html';
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Account button
    const accountBtn = document.getElementById('accountBtn');
    if (accountBtn) {
        accountBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            toggleAccountMenu();
        });
    }
    
    // Login link
    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        loginLink.addEventListener('click', function(event) {
            event.preventDefault();
            const accountMenu = document.getElementById('accountMenu');
            if (accountMenu) accountMenu.classList.remove('active');
            openAuthModal('loginModal');
        });
    }
    
    // Register link
    const registerLink = document.getElementById('registerLink');
    if (registerLink) {
        registerLink.addEventListener('click', function(event) {
            event.preventDefault();
            const accountMenu = document.getElementById('accountMenu');
            if (accountMenu) accountMenu.classList.remove('active');
            openAuthModal('registerModal');
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Close account menu when clicking outside
    document.addEventListener('click', function(event) {
        const accountDropdown = document.querySelector('.account-dropdown');
        const accountMenu = document.getElementById('accountMenu');
        
        if (accountDropdown && accountMenu) {
            if (!accountDropdown.contains(event.target)) {
                accountMenu.classList.remove('active');
            }
        }
    });
    
    // Close auth modals when clicking outside
    const authModals = document.querySelectorAll('.auth-modal');
    for (let i = 0; i < authModals.length; i++) {
        authModals[i].addEventListener('click', function(event) {
            if (event.target === this) {
                this.classList.remove('active');
            }
        });
    }
    
    
    // Dropdown menu toggle
    const dropdown = document.querySelector('.dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    
    if (dropdown && dropdownToggle) {
        dropdownToggle.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!dropdown.contains(event.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
});