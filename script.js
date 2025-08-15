document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('#cart-icon');
    const cartSidebar = document.querySelector('#shopping-cart');
    const closeCartButton = document.querySelector('#close-cart');
    const cartItemsContainer = document.querySelector('#cart-items');
    const cartTotalElement = document.querySelector('#cart-total');
    const cartCountElement = document.querySelector('#cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartCheckoutButton = document.querySelector('.checkout-btn');
    const overlay = document.querySelector('#overlay');
    const checkoutModal = document.querySelector('#checkout-modal');
    const closeModalButton = document.querySelector('.close-modal');
    const checkoutForm = document.querySelector('#checkout-form');
    const summaryItemsContainer = document.querySelector('#checkout-summary-items');
    const summaryTotalElement = document.querySelector('#checkout-total');
    const mobileMenuIcon = document.querySelector('#mobile-menu-icon');
    const mainNav = document.querySelector('#main-nav');
    const navLinks = document.querySelectorAll('#main-nav ul li a');

 
    let cart = [];

    function openCart() {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
    }

    function closeCart() {
        cartSidebar.classList.remove('active');
        if (!mainNav.classList.contains('active')) {
            overlay.classList.remove('active');
        }
    }

    function addToCart(event) {
        const button = event.target;
        const menuItem = button.closest('.menu-item');
        const id = menuItem.dataset.id;
        const name = menuItem.dataset.name;
        const price = parseFloat(menuItem.dataset.price);
        const image = menuItem.querySelector('img').src;
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, image, quantity: 1 });
        }
        updateCartDisplay();
        openCart();
    }

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                </div>
                <button class="remove-btn" data-id="${item.id}">&times;</button>
            `;
            cartItemsContainer.appendChild(cartItemElement);
            total += item.price * item.quantity;
            totalItems += item.quantity;
        });
        cartTotalElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    function handleCartActions(event) {
        const target = event.target;
        const id = target.dataset.id;
        if (!id) return;
        const itemInCart = cart.find(item => item.id === id);
        if (target.classList.contains('quantity-btn')) {
            const action = target.dataset.action;
            if (action === 'increase') {
                itemInCart.quantity++;
            } else if (action === 'decrease') {
                itemInCart.quantity--;
                if (itemInCart.quantity <= 0) cart = cart.filter(item => item.id !== id);
            }
        } else if (target.classList.contains('remove-btn')) {
            cart = cart.filter(item => item.id !== id);
        }
        updateCartDisplay();
    }

  
    function openCheckoutModal() {
        if (cart.length === 0) {
            alert("Keranjang Anda kosong. Silakan pilih item terlebih dahulu.");
            return;
        }
        summaryItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            summaryItemsContainer.innerHTML += `
                <div class="summary-item">
                    <span>${item.quantity}x ${item.name}</span>
                    <span>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
            `;
            total += item.price * item.quantity;
        });
        summaryTotalElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
        closeCart();
        checkoutModal.style.display = 'block';
    }

    function closeCheckoutModal() {
        checkoutModal.style.display = 'none';
    }

    function handleCheckoutSubmit(event) {
        event.preventDefault();
        const customerData = {
            name: document.querySelector('#customer-name').value,
            phone: document.querySelector('#customer-phone').value,
            serviceMethod: document.querySelector('input[name="service-method"]:checked').value,
            paymentMethod: document.querySelector('input[name="payment-method"]:checked').value,
        };
        const orderNumber = `KS-${Date.now().toString().slice(-6)}`;
        const fullOrderDetails = {
            orderNumber: orderNumber,
            customer: customerData,
            items: cart,
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            orderDate: new Date().toISOString()
        };
        localStorage.setItem('latestOrder', JSON.stringify(fullOrderDetails));
        cart = [];
        updateCartDisplay();
        closeCheckoutModal();
        window.location.href = 'invoice.html';
    }

  
    function openMobileNav() {
        mainNav.classList.add('active');
        overlay.classList.add('active');
    }

    function closeMobileNav() {
        mainNav.classList.remove('active');
        if (!cartSidebar.classList.contains('active')) {
            overlay.classList.remove('active');
        }
    }


    cartIcon.addEventListener('click', openCart);
    closeCartButton.addEventListener('click', closeCart);
    addToCartButtons.forEach(button => button.addEventListener('click', addToCart));
    cartItemsContainer.addEventListener('click', handleCartActions);
    cartCheckoutButton.addEventListener('click', openCheckoutModal);
    closeModalButton.addEventListener('click', closeCheckoutModal);
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    mobileMenuIcon.addEventListener('click', openMobileNav);
    navLinks.forEach(link => link.addEventListener('click', closeMobileNav));
    overlay.addEventListener('click', () => {
        closeCart();
        closeMobileNav();
    });
    window.addEventListener('click', (event) => {
        if (event.target == checkoutModal) {
            closeCheckoutModal();
        }
    });
});