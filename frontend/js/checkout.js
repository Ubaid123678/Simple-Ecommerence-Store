// Checkout page logic

async function initCheckoutPage() {
    initPage();

    if (!getUser()) {
        window.location.href = 'auth.html';
        return;
    }

    loadCheckout();
}

async function loadCheckout() {
    const container = document.getElementById('checkoutContent');
    showLoading(container);

    try {
        const cart = await CartAPI.get();

        if (!cart.items || cart.items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Your cart is empty</h3>
                    <p>Add some products before checking out</p>
                    <a href="index.html" class="btn btn-primary">Shop Now</a>
                </div>`;
            return;
        }

        const subtotal = cart.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);

        container.innerHTML = `
        <div class="checkout-layout animate-fade-in-up">
            <div>
                <h2 style="margin-bottom:24px;">Shipping Details</h2>
                <form id="checkoutForm" class="glass-card" style="padding:28px;">
                    <div class="form-group">
                        <label class="form-label">Full Name</label>
                        <input class="form-input" type="text" id="shipName" placeholder="John Doe" required value="${getUser().name}" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Street Address</label>
                        <input class="form-input" type="text" id="shipStreet" placeholder="123 Main Street" required />
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                        <div class="form-group">
                            <label class="form-label">City</label>
                            <input class="form-input" type="text" id="shipCity" placeholder="New York" required />
                        </div>
                        <div class="form-group">
                            <label class="form-label">ZIP Code</label>
                            <input class="form-input" type="text" id="shipZip" placeholder="10001" required />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Country</label>
                        <input class="form-input" type="text" id="shipCountry" placeholder="United States" required />
                    </div>

                    <h3 style="margin:28px 0 16px;">Payment Info</h3>
                    <div class="form-group">
                        <label class="form-label">Card Number</label>
                        <input class="form-input" type="text" id="cardNumber" placeholder="4242 4242 4242 4242" maxlength="19" required />
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                        <div class="form-group">
                            <label class="form-label">Expiry</label>
                            <input class="form-input" type="text" id="cardExpiry" placeholder="MM/YY" maxlength="5" required />
                        </div>
                        <div class="form-group">
                            <label class="form-label">CVV</label>
                            <input class="form-input" type="text" id="cardCvv" placeholder="123" maxlength="4" required />
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary btn-lg" style="width:100%;margin-top:12px;" id="placeOrderBtn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                        </svg>
                        Place Order — $${subtotal.toFixed(2)}
                    </button>
                </form>
            </div>

            <div class="cart-summary">
                <h3>Order Summary</h3>
                ${cart.items.map(item => {
                    const p = item.productId;
                    return `
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);">
                        <div>
                            <div style="font-size:0.9rem;font-weight:500;">${p.name}</div>
                            <div style="font-size:0.8rem;color:var(--text-muted);">Qty: ${item.quantity}</div>
                        </div>
                        <span style="font-weight:600;">$${(p.price * item.quantity).toFixed(2)}</span>
                    </div>`;
                }).join('')}
                <div class="summary-row" style="margin-top:16px;">
                    <span class="text-muted">Subtotal</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span class="text-muted">Shipping</span>
                    <span class="text-success">Free</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
            </div>
        </div>`;

        // Form submit
        document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('placeOrderBtn');
            btn.disabled = true;
            btn.innerHTML = '<div class="spinner"></div> Processing...';

            const orderItems = cart.items.map(item => ({
                productId: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                quantity: item.quantity
            }));

            const shippingAddress = {
                street: document.getElementById('shipStreet').value,
                city: document.getElementById('shipCity').value,
                zip: document.getElementById('shipZip').value,
                country: document.getElementById('shipCountry').value
            };

            try {
                const order = await OrderAPI.create({
                    orderItems,
                    shippingAddress,
                    subtotal: subtotal,
                    discount: 0,
                    total: subtotal
                });

                // Clear cart locally
                updateCartBadge(0);

                // Redirect to success
                window.location.href = `order-success.html?id=${order._id}`;
            } catch (error) {
                showToast(error.message, 'error');
                btn.disabled = false;
                btn.innerHTML = 'Place Order';
            }
        });

    } catch (error) {
        container.innerHTML = `<div class="empty-state"><h3>Error</h3><p>${error.message}</p></div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('checkoutContent')) {
        initCheckoutPage();
    }
});
