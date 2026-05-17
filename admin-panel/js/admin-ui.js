// Admin UI helpers — sidebar, toasts, shared rendering

function initToasts() {
    if (!document.querySelector('.toast-container')) {
        const c = document.createElement('div');
        c.className = 'toast-container';
        document.body.appendChild(c);
    }
}

function showToast(message, type = 'info', duration = 3000) {
    initToasts();
    const container = document.querySelector('.toast-container');
    const icons = {
        success: '✓', error: '✕', warning: '⚠', info: 'ℹ'
    };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${icons[type]}</span><span class="toast-message">${message}</span><button class="toast-close" onclick="this.parentElement.classList.add('removing');setTimeout(()=>this.parentElement.remove(),300)">✕</button>`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('removing'); setTimeout(() => toast.remove(), 300); }, duration);
}

function renderSidebar(activePage) {
    const admin = getAdmin();
    return `
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <div class="sidebar-logo"><div class="logo-icon">⚡</div>Nova<span class="highlight">Mart</span></div>
            <div class="sidebar-tag">Admin Panel</div>
        </div>
        <nav class="sidebar-nav">
            <div class="nav-section">
                <div class="nav-section-title">Overview</div>
                <a href="index.html" class="nav-item ${activePage==='dashboard'?'active':''}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                    Dashboard
                </a>
            </div>
            <div class="nav-section">
                <div class="nav-section-title">Management</div>
                <a href="products.html" class="nav-item ${activePage==='products'?'active':''}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                    Products
                </a>
                <a href="orders.html" class="nav-item ${activePage==='orders'?'active':''}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                    Orders <span class="badge" id="orderBadge" style="display:none">0</span>
                </a>
                <a href="users.html" class="nav-item ${activePage==='users'?'active':''}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    Users
                </a>
                <a href="coupons.html" class="nav-item ${activePage==='coupons'?'active':''}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                    Coupons
                </a>
            </div>
        </nav>
        <div class="sidebar-footer">
            <div class="sidebar-user">
                <div class="sidebar-avatar">${admin?admin.name.charAt(0):'A'}</div>
                <div class="sidebar-user-info">
                    <div class="name">${admin?admin.name:'Admin'}</div>
                    <div class="role">Administrator</div>
                </div>
                <button class="btn-icon btn-secondary" onclick="adminLogout()" title="Logout" style="margin-left:auto">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
            </div>
        </div>
    </aside>`;
}

function renderTopbar(title) {
    return `
    <header class="topbar">
        <div class="topbar-left">
            <button class="topbar-btn sidebar-toggle" id="sidebarToggle" title="Menu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
            </button>
            <h1>${title}</h1>
        </div>
        <div class="topbar-actions">
            <button class="topbar-btn" id="notifBtn" title="Notifications">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span class="dot" id="notifDot" style="display:none"></span>
            </button>
            <a href="http://localhost:5000" target="_blank" class="btn btn-secondary btn-sm">View Store</a>
        </div>
    </header>`;
}

function initAdminPage(activePage, title) {
    if (!requireAdmin()) return;
    const sidebarEl = document.getElementById('sidebar-root');
    const topbarEl = document.getElementById('topbar-root');
    if (sidebarEl) sidebarEl.outerHTML = renderSidebar(activePage);
    if (topbarEl) topbarEl.outerHTML = renderTopbar(title);
    initToasts();

    const sidebar = document.getElementById('sidebar');
    let overlay = document.getElementById('sidebarOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'sidebarOverlay';
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }

    const toggleBtn = document.getElementById('sidebarToggle');
    const closeSidebar = () => {
        if (!sidebar) return;
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    };

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            const isOpen = sidebar.classList.toggle('open');
            overlay.classList.toggle('active', isOpen);
        });
    }

    overlay.addEventListener('click', closeSidebar);
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeSidebar();
    });
}

function adminLogout() {
    localStorage.removeItem('novamart_admin_token');
    localStorage.removeItem('novamart_admin');
    window.location.href = 'login.html';
}

function showLoading(el) {
    el.innerHTML = '<div style="display:flex;justify-content:center;padding:60px"><div class="spinner spinner-lg"></div></div>';
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

function formatDate(d) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
function formatMoney(n) { return '$' + Number(n).toFixed(2); }
