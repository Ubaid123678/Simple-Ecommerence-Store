/* Toast notification system & UI helpers */

// Toast container
function initToasts() {
    if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

function showToast(message, type = 'info', duration = 3000) {
    initToasts();
    const container = document.querySelector('.toast-container');

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
        success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    toast.innerHTML = `
        <span style="color: var(--${type === 'info' ? 'accent' : type})">${icons[type]}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.classList.add('removing'); setTimeout(() => this.parentElement.remove(), 300)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Star rating HTML
function renderStars(rating, size = 16) {
    let html = '<div class="stars">';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
        } else {
            html += `<svg class="empty" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
        }
    }
    html += '</div>';
    return html;
}

// Navbar shared component
function renderNavbar() {
    const user = getUser();
    const cartCount = localStorage.getItem('novamart_cart_count') || 0;
    const currentPath = (window.location.pathname.split('/').pop() || 'index.html');
    const isActive = (name) => currentPath === name;

    return `
    <nav class="navbar">
        <div class="container">
            <a href="index.html" class="navbar-logo">
                <div class="logo-icon">⚡</div>
                Nova<span class="highlight">Mart</span>
            </a>

            <div class="navbar-search">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" id="searchInput" placeholder="Search products..." />
            </div>

            <div class="navbar-actions">
                <a href="wishlist.html" class="nav-btn" title="Wishlist">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </a>
                <a href="cart.html" class="nav-btn" title="Cart">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    <span class="badge cart-badge" id="cartBadge" style="${cartCount > 0 ? '' : 'display:none'}">${cartCount}</span>
                </a>
                ${user ? `
                    <a href="profile.html" class="nav-user-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                        ${user.name.split(' ')[0]}
                    </a>
                ` : `
                    <a href="auth.html" class="btn btn-primary btn-sm">Sign In</a>
                `}
            </div>

            <button class="nav-btn mobile-menu-btn" id="mobileMenuBtn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
            </button>
        </div>
    </nav>
    <div class="mobile-menu-backdrop" id="mobileMenuBackdrop"></div>
    <div class="mobile-menu" id="mobileMenu">
        <div class="menu-links">
            <a href="index.html">Home</a>
            <a href="index.html#products">Products</a>
            <a href="wishlist.html">Wishlist</a>
            <a href="cart.html">Cart</a>
            <a href="contact.html">Contact</a>
        </div>
        <div class="menu-actions">
            ${user ? `
                <a href="profile.html" class="btn btn-secondary btn-sm">My Account</a>
            ` : `
                <a href="auth.html" class="btn btn-primary btn-sm">Sign In</a>
            `}
            <a href="index.html#products" class="btn btn-accent btn-sm">Shop Now</a>
        </div>
    </div>
    <div class="mobile-action-bar" aria-label="Quick actions">
        <a href="index.html" class="${isActive('index.html') ? 'active' : ''}" title="Home">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7"/><path d="M9 22V12h6v10"/></svg>
        </a>
        <a href="index.html#products" title="Products">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        </a>
        <a href="cart.html" class="${isActive('cart.html') ? 'active' : ''}" title="Cart" style="position:relative;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span class="badge" id="mobileCartBadge" style="${cartCount > 0 ? '' : 'display:none'}">${cartCount}</span>
        </a>
        <a href="wishlist.html" class="${isActive('wishlist.html') ? 'active' : ''}" title="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </a>
        <a href="${user ? 'profile.html' : 'auth.html'}" class="${isActive(user ? 'profile.html' : 'auth.html') ? 'active' : ''}" title="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </a>
    </div>`;
}

function renderFooter() {
    return `
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <h3>⚡ Nova<span class="text-accent">Mart</span></h3>
                    <p>Shop the Future. Premium products at great prices with lightning-fast delivery.</p>
                </div>
                <div class="footer-col">
                    <h4>Shop</h4>
                    <a href="index.html">All Products</a>
                    <a href="index.html?category=Electronics">Electronics</a>
                    <a href="index.html?category=Clothing">Clothing</a>
                    <a href="index.html?category=Furniture">Furniture</a>
                </div>
                <div class="footer-col">
                    <h4>Company</h4>
                    <a href="about.html">About Us</a>
                    <a href="contact.html">Contact</a>
                </div>
                <div class="footer-col">
                    <h4>Account</h4>
                    <a href="profile.html">My Profile</a>
                    <a href="profile.html#orders">Orders</a>
                    <a href="wishlist.html">Wishlist</a>
                    <a href="cart.html">Cart</a>
                </div>
                <div class="footer-col">
                    <h4>Help</h4>
                    <a href="contact.html">Contact Us</a>
                    <a href="#">FAQ</a>
                    <a href="#">Shipping</a>
                    <a href="#">Returns</a>
                </div>
            </div>
            <div class="footer-bottom">
                &copy; ${new Date().getFullYear()} NovaMart. All rights reserved. Built for Internship Project 1.
            </div>
        </div>
    </footer>`;
}

// Update cart badge
function updateCartBadge(count) {
    localStorage.setItem('novamart_cart_count', count);
    const badge = document.getElementById('cartBadge');
    const mobileBadge = document.getElementById('mobileCartBadge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
        if (count > 0) badge.classList.add('animate-bounce-in');
    }
    if (mobileBadge) {
        mobileBadge.textContent = count;
        mobileBadge.style.display = count > 0 ? 'flex' : 'none';
        if (count > 0) mobileBadge.classList.add('animate-bounce-in');
    }
}

// Loading overlay
function showLoading(container) {
    container.innerHTML = `
        <div style="display:flex;justify-content:center;align-items:center;padding:100px 0;">
            <div class="spinner spinner-lg"></div>
        </div>`;
}

// Inject navbar & footer
function initPage() {
    const navPlaceholder = document.getElementById('navbar');
    const footerPlaceholder = document.getElementById('footer');
    if (navPlaceholder) navPlaceholder.outerHTML = renderNavbar();
    if (footerPlaceholder) footerPlaceholder.outerHTML = renderFooter();

    // Hook up search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && searchInput.value.trim()) {
                window.location.href = `index.html?keyword=${encodeURIComponent(searchInput.value.trim())}`;
            }
        });
    }

    initToasts();
    initScrollAnimations();
    initNavbarScroll();
    initMobileMenu();
}

function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    if (!btn || !menu || !backdrop) return;

    const closeMenu = () => {
        menu.classList.remove('open');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    };

    const toggleMenu = () => {
        const isOpen = menu.classList.toggle('open');
        backdrop.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    btn.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', closeMenu);
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
 }

// Scroll reveal animations
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Magnetic hover effect
document.addEventListener('mousemove', (e) => {
    const magneticElements = document.querySelectorAll('.btn, .nav-btn, .category-card, .feature-card');
    
    magneticElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        if (Math.abs(x) < rect.width && Math.abs(y) < rect.height) {
            const rotateX = y / 10;
            const rotateY = -x / 10;
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        } else {
            el.style.transform = '';
        }
    });
});

// Ripple effect on click
function createRipple(event, element) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        width: 20px;
        height: 20px;
        left: ${event.clientX - rect.left - 10}px;
        top: ${event.clientY - rect.top - 10}px;
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
    `;
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple to buttons
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn:not(:disabled)');
    if (btn && !btn.classList.contains('nav-btn')) {
        createRipple(e, btn);
    }
});
