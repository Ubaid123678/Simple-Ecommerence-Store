// Product listing page logic

let currentPage = 1;
let currentKeyword = '';

function initProductsPage() {
    initPage();

    // Parse URL params
    const params = new URLSearchParams(window.location.search);
    currentKeyword = params.get('keyword') || '';
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput && currentKeyword) {
        searchInput.value = currentKeyword;
    }

    loadProducts();

    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => loadProducts());
    }

    // Sort filter
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', () => loadProducts());
    }
}

async function loadProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    showLoading(grid);

    try {
        const data = await ProductAPI.getAll(currentKeyword, currentPage);
        let products = data.products;

        // Client-side category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter && categoryFilter.value) {
            products = products.filter(p => p.category === categoryFilter.value);
        }

        // Client-side sorting
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            switch (sortFilter.value) {
                case 'price-low':
                    products.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    products.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    products.sort((a, b) => b.rating - a.rating);
                    break;
                case 'newest':
                    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
            }
        }

        if (products.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                    </div>
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filters</p>
                    <a href="index.html" class="btn btn-secondary">Clear Filters</a>
                </div>`;
            return;
        }

        grid.innerHTML = products.map(product => renderProductCard(product)).join('');
        grid.classList.add('stagger-children');

        // Pagination
        renderPagination(data.page, data.pages);

    } catch (error) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><h3>Error loading products</h3><p>${error.message}</p></div>`;
    }
}

function renderProductCard(product) {
    const img = product.images && product.images.length > 0
        ? `http://localhost:5000${product.images[0]}`
        : `https://placehold.co/400x300/1a1d27/8A2BE2?text=${encodeURIComponent(product.name.split(' ')[0])}`;

    return `
    <div class="product-card" onclick="window.location.href='product.html?id=${product._id}'">
        <div class="product-card-image">
            <img src="${img}" alt="${product.name}" loading="lazy" />
            ${product.stock < 5 && product.stock > 0 ? '<span class="product-card-badge" style="background:var(--warning)">Low Stock</span>' : ''}
            ${product.stock === 0 ? '<span class="product-card-badge" style="background:var(--error)">Sold Out</span>' : ''}
            <button class="product-card-wishlist" onclick="event.stopPropagation(); toggleWishlist('${product._id}', this)" title="Add to wishlist">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </button>
        </div>
        <div class="product-card-body">
            <div class="product-card-category">${product.category}</div>
            <div class="product-card-title">${product.name}</div>
            <div class="product-card-rating">
                ${renderStars(product.rating)}
                <span class="rating-count">(${product.numReviews})</span>
            </div>
            <div class="product-card-footer">
                <div class="product-price"><span class="currency">$</span>${product.price.toFixed(2)}</div>
                <button class="add-cart-btn" onclick="event.stopPropagation(); quickAddToCart('${product._id}')" title="Add to cart" ${product.stock === 0 ? 'disabled' : ''}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>`;
}

function renderPagination(current, total) {
    const container = document.getElementById('pagination');
    if (!container || total <= 1) return;

    let html = '<div style="display:flex;justify-content:center;gap:8px;margin-top:32px;">';
    for (let i = 1; i <= total; i++) {
        html += `<button class="btn ${i === current ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="goToPage(${i})">${i}</button>`;
    }
    html += '</div>';
    container.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    loadProducts();
    window.scrollTo({ top: 400, behavior: 'smooth' });
}

async function quickAddToCart(productId) {
    if (!getUser()) {
        showToast('Please sign in to add items to cart', 'warning');
        setTimeout(() => window.location.href = 'auth.html', 1000);
        return;
    }
    try {
        const cart = await CartAPI.add(productId, 1);
        updateCartBadge(cart.items.length);
        showToast('Added to cart!', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function toggleWishlist(productId, btn) {
    if (!getUser()) {
        showToast('Please sign in to use wishlist', 'warning');
        return;
    }
    try {
        if (btn.classList.contains('active')) {
            await WishlistAPI.remove(productId);
            btn.classList.remove('active');
            showToast('Removed from wishlist', 'info');
        } else {
            await WishlistAPI.add(productId);
            btn.classList.add('active');
            btn.classList.add('animate-heart');
            showToast('Added to wishlist!', 'success');
            setTimeout(() => btn.classList.remove('animate-heart'), 600);
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('productsGrid')) {
        initProductsPage();
    }
});
