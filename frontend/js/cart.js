// Cart page logic

async function initCartPage() {
    initPage();

    if (!getUser()) {
        document.getElementById('cartContent').innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                </div>
                <h3>Sign in to view your cart</h3>
                <p>Your cart items will be saved to your account</p>
                <a href="auth.html" class="btn btn-primary">Sign In</a>
            </div>`;
        return;
    }

    loadCart();
}

let cartData = null;
let appliedCoupon = null;

async function loadCart() {
    const container = document.getElementById('cartContent');
    showLoading(container);

    try {
        cartData = await CartAPI.get();
        await cartData; // populated items
        renderCart();
    } catch (error) {
        container.innerHTML = `<div class="empty-state"><h3>Error loading cart</h3><p>${error.message}</p></div>`;
    }
}

function renderCart() {
    const container = document.getElementById('cartContent');

    if (!cartData || !cartData.items || cartData.items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                </div>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything yet</p>
                <a href="index.html" class="btn btn-primary">Start Shopping</a>
            </div>`;
        updateCartBadge(0);
        return;
    }

    updateCartBadge(cartData.items.length);

    const subtotal = cartData.items.reduce((sum, item) => {
        return sum + (item.productId.price * item.quantity);
    }, 0);

    const discount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent / 100) : 0;
    const total = subtotal - discount;

    container.innerHTML = `
    <div class="cart-layout animate-fade-in-up">
        <div class="cart-items">
            <h2 style="margin-bottom:8px;">Shopping Cart <span class="text-muted" style="font-size:1rem;font-weight:400;">(${cartData.items.length} items)</span></h2>
            ${cartData.items.map(item => {
                const product = item.productId;
                const img = product.images && product.images.length > 0
                    ? `http://localhost:5000${product.images[0]}`
                    : `https://placehold.co/200x200/1a1d27/8A2BE2?text=${encodeURIComponent(product.name.split(' ')[0])}`;
                
                return `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${img}" alt="${product.name}" />
                    </div>
                    <div class="cart-item-info">
                        <div>
                            <div class="cart-item-title">${product.name}</div>
                            <div class="cart-item-category">${product.category}</div>
                        </div>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button onclick="updateQty('${item._id}', ${item.quantity - 1})">−</button>
                                <span>${item.quantity}</span>
                                <button onclick="updateQty('${item._id}', ${item.quantity + 1})">+</button>
                            </div>
                            <div class="cart-item-price">$${(product.price * item.quantity).toFixed(2)}</div>
                            <button class="btn btn-danger btn-sm" onclick="removeItem('${item._id}')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>`;
            }).join('')}
        </div>

        <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span class="text-muted">Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span class="text-muted">Shipping</span>
                <span class="text-success">Free</span>
            </div>
            ${appliedCoupon ? `
                <div class="summary-row text-success">
                    <span>Discount (${appliedCoupon.code})</span>
                    <span>-$${discount.toFixed(2)}</span>
                </div>
            ` : ''}
            <div class="coupon-input-group">
                <input type="text" id="couponInput" placeholder="Coupon code" />
                <button class="btn btn-secondary btn-sm" onclick="applyCoupon()">Apply</button>
            </div>
            <div class="summary-row total">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <a href="checkout.html" class="btn btn-primary btn-lg" style="width:100%;margin-top:16px;">
                Proceed to Checkout
            </a>
            <a href="index.html" style="display:block;text-align:center;margin-top:12px;font-size:0.85rem;color:var(--text-muted);">
                Continue Shopping
            </a>
        </div>
    </div>`;
}

async function updateQty(itemId, newQty) {
    if (newQty < 1) {
        removeItem(itemId);
        return;
    }
    try {
        cartData = await CartAPI.update(itemId, newQty);
        renderCart();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function removeItem(itemId) {
    try {
        cartData = await CartAPI.remove(itemId);
        showToast('Item removed from cart', 'info');
        renderCart();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function applyCoupon() {
    const code = document.getElementById('couponInput').value.trim();
    if (!code) return;

    try {
        const result = await CouponAPI.validate(code);
        appliedCoupon = result;
        showToast(`Coupon applied! ${result.discountPercent}% off`, 'success');
        renderCart();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cartContent')) {
        initCartPage();
    }
});
