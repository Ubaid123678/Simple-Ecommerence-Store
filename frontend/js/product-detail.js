// Product detail page logic

async function initProductDetail() {
    initPage();

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    const container = document.getElementById('productDetail');
    showLoading(container);

    try {
        const product = await ProductAPI.getById(productId);
        renderProduct(product);
        loadReviews(productId);
    } catch (error) {
        container.innerHTML = `<div class="empty-state"><h3>Product not found</h3><a href="index.html" class="btn btn-primary">Back to Shop</a></div>`;
    }
}

function renderProduct(product) {
    const container = document.getElementById('productDetail');
    const img = product.images && product.images.length > 0
        ? `http://localhost:5000${product.images[0]}`
        : `https://placehold.co/600x600/1a1d27/8A2BE2?text=${encodeURIComponent(product.name.split(' ')[0])}`;

    let stockBadge = '';
    if (product.stock === 0) {
        stockBadge = '<span class="stock-badge out-of-stock">● Out of stock</span>';
    } else if (product.stock < 5) {
        stockBadge = `<span class="stock-badge low-stock">● Only ${product.stock} left</span>`;
    } else {
        stockBadge = `<span class="stock-badge in-stock">● In stock (${product.stock})</span>`;
    }

    container.innerHTML = `
    <div class="product-detail animate-fade-in-up">
        <div class="product-gallery">
            <div class="product-main-image">
                <img src="${img}" alt="${product.name}" id="mainImage" />
            </div>
            ${product.images && product.images.length > 1 ? `
                <div class="product-thumbnails">
                    ${product.images.map((image, i) => `
                        <div class="thumb ${i === 0 ? 'active' : ''}" onclick="changeImage('http://localhost:5000${image}', this)">
                            <img src="http://localhost:5000${image}" alt="Thumbnail ${i + 1}" />
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>

        <div class="product-info">
            <span class="product-category-tag">${product.category}</span>
            <h1>${product.name}</h1>
            <div class="product-card-rating" style="margin: 12px 0;">
                ${renderStars(product.rating, 20)}
                <span class="rating-count">(${product.numReviews} reviews)</span>
            </div>
            <div class="product-price-large"><span class="currency">$</span>${product.price.toFixed(2)}</div>
            ${stockBadge}
            <p class="product-description">${product.description}</p>

            <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
                <label style="color:var(--text-secondary);font-size:0.9rem;">Quantity:</label>
                <div class="quantity-control">
                    <button onclick="changeQty(-1)">−</button>
                    <span id="detailQty">1</span>
                    <button onclick="changeQty(1)">+</button>
                </div>
            </div>

            <div class="product-actions">
                <button class="btn btn-primary btn-lg" onclick="addToCartDetail('${product._id}')" ${product.stock === 0 ? 'disabled' : ''}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Add to Cart
                </button>
                <button class="btn btn-secondary btn-lg" onclick="toggleWishlistDetail('${product._id}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    Wishlist
                </button>
            </div>
        </div>
    </div>`;
}

function changeImage(src, thumbEl) {
    document.getElementById('mainImage').src = src;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    thumbEl.classList.add('active');
}

let detailQty = 1;
function changeQty(delta) {
    detailQty = Math.max(1, detailQty + delta);
    document.getElementById('detailQty').textContent = detailQty;
}

async function addToCartDetail(productId) {
    if (!getUser()) {
        showToast('Please sign in to add items to cart', 'warning');
        setTimeout(() => window.location.href = 'auth.html', 1000);
        return;
    }
    try {
        const cart = await CartAPI.add(productId, detailQty);
        updateCartBadge(cart.items.length);
        showToast('Added to cart!', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function toggleWishlistDetail(productId) {
    if (!getUser()) {
        showToast('Please sign in to use wishlist', 'warning');
        return;
    }
    try {
        await WishlistAPI.add(productId);
        showToast('Added to wishlist!', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function loadReviews(productId) {
    const container = document.getElementById('reviewsList');
    if (!container) return;

    try {
        const reviews = await ProductAPI.getReviews(productId);
        if (reviews.length === 0) {
            container.innerHTML = '<p class="text-muted">No reviews yet. Be the first to review!</p>';
            return;
        }

        container.innerHTML = reviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <div>
                        <span class="review-user">${review.userId?.name || 'User'}</span>
                        <div style="margin-top:4px">${renderStars(review.rating, 14)}</div>
                    </div>
                    <span class="review-date">${new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p style="color:var(--text-secondary);font-size:0.9rem;">${review.comment}</p>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p class="text-muted">Could not load reviews.</p>';
    }
}

async function submitReview(e) {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!getUser()) {
        showToast('Please sign in to submit a review', 'warning');
        return;
    }

    const rating = document.getElementById('reviewRating').value;
    const comment = document.getElementById('reviewComment').value;

    try {
        await ProductAPI.addReview(productId, rating, comment);
        showToast('Review submitted!', 'success');
        document.getElementById('reviewForm').reset();
        loadReviews(productId);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('productDetail')) {
        initProductDetail();
    }
});
