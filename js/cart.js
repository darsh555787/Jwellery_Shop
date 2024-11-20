
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count in the header
    function updateCartCount() {
        const cartCounts = document.querySelectorAll('.bx-cart + .d-flex');
        cartCounts.forEach(count => {
            count.textContent = cart.length;
        });
    }

    // Calculate and update totals
    function updateTotals() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1; // Assuming 10% tax
        const total = subtotal + tax;

        document.querySelector('.total-price table tr:nth-child(1) td:last-child').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.total-price table tr:nth-child(2) td:last-child').textContent = `$${tax.toFixed(2)}`;
        document.querySelector('.total-price table tr:nth-child(3) td:last-child').textContent = `$${total.toFixed(2)}`;
    }

    // Update cart display
    function updateCartDisplay() {
        const cartTableBody = document.querySelector('.cart table');
        // Clear existing rows except header
        while (cartTableBody.rows.length > 1) {
            cartTableBody.deleteRow(1);
        }

        // Add items to cart display
        cart.forEach((item, index) => {
            const row = cartTableBody.insertRow();
            row.innerHTML = `
                <td>
                    <div class="cart-info">
                        <img src="${item.image}" alt="${item.name}" />
                        <div>
                            <p>${item.name}</p>
                            <span>Price: $${item.price.toFixed(2)}</span><br />
                            <a href="#" data-index="${index}" class="remove-item">remove</a>
                        </div>
                    </div>
                </td>
                <td><input type="number" value="${item.quantity}" min="1" data-index="${index}" class="quantity-input"></td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
            `;
        });

        updateTotals();
        updateCartCount();
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Add click event listeners to all "Add to Cart" icons
    document.querySelectorAll('.product-item .icons li:nth-child(3)').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productItem = this.closest('.product-item');
            const name = productItem.querySelector('.product-info a').textContent;
            const price = parseFloat(productItem.querySelector('.product-info h4').textContent.replace('$', ''));
            const image = productItem.querySelector('.product-thumb img').src;

            // Check if item is already in cart
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }

            updateCartDisplay();
        });
    });

    // Event delegation for remove buttons and quantity inputs
    document.querySelector('.cart table').addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            e.preventDefault();
            const index = e.target.dataset.index;
            cart.splice(index, 1);
            updateCartDisplay();
        }
    });

    document.querySelector('.cart table').addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            const index = e.target.dataset.index;
            const newQuantity = parseInt(e.target.value);
            if (newQuantity > 0) {
                cart[index].quantity = newQuantity;
                updateCartDisplay();
            }
        }
    });

    // Initial update
    updateCartDisplay();
});