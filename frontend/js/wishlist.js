// Wishlist page logic (reused on profile page too)

async function initWishlistPage() {
    initPage();

    if (!getUser()) {
        window.location.href = 'auth.html';
        return;
    }

    loadWishlist();
}

async function loadWishlist() {
    const container = document.getElementById('wishlistContent');
    if (!container) return;
    showLoading(container);

    try {
        const wishlist = await WishlistAPI.get();

        if (!wishlist.products || wishlist.products.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </div>
                    <h3>Your wishlist is empty</h3>
                    <p>Save items you love for later</p>
                    <a href="index.html" class="btn btn-primary">Browse Products</a>
                </div>`;
            return;
        }

        container.innerHTML = `
            <div class="products-grid stagger-children">
                ${wishlist.products.map(product => {
                    const img = product.images && product.images.length > 0
                        ? `http://localhost:5000${product.images[0]}`
                        : `https://placehold.co/400x300/1a1d27/8A2BE2?text=${encodeURIComponent(product.name.split(' ')[0])}`;
                    return `
                    <div class="product-card" onclick="window.location.href='product.html?id=${product._id}'">
                        <div class="product-card-image">
                            <img src="${img}" alt="${product.name}" />
                            <button class="product-card-wishlist active" onclick="event.stopPropagation(); removeFromWishlistPage('${product._id}')" title="Remove from wishlist">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                </svg>
                            </button>
                        </div>
                        <div class="product-card-body">
                            <div class="product-card-category">${product.category}</div>
                            <div class="product-card-title">${product.name}</div>
                            <div class="product-card-footer">
                                <div class="product-price"><span class="currency">$</span>${product.price.toFixed(2)}</div>
                                <button class="add-cart-btn" onclick="event.stopPropagation(); quickAddToCart('${product._id}')" title="Add to cart">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>`;
                }).join('')}
            </div>`;

    } catch (error) {
        container.innerHTML = `<div class="empty-state"><h3>Error</h3><p>${error.message}</p></div>`;
    }
}

async function removeFromWishlistPage(productId) {
    try {
        await WishlistAPI.remove(productId);
        showToast('Removed from wishlist', 'info');
        loadWishlist();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('wishlistContent')) {
        initWishlistPage();
    }
});
