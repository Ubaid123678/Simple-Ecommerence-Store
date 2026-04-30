// Auth page logic

function initAuthPage() {
    initPage();

    // If already logged in, redirect
    if (getUser()) {
        window.location.href = 'profile.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');

    // Tab switching
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    // Check URL for tab
    if (window.location.hash === '#register') {
        registerTab.click();
    }

    // Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const btn = loginForm.querySelector('button[type="submit"]');

        btn.disabled = true;
        btn.innerHTML = '<div class="spinner"></div> Signing in...';

        try {
            const data = await AuthAPI.login(email, password);
            localStorage.setItem('novamart_token', data.token);
            localStorage.setItem('novamart_user', JSON.stringify(data));
            showToast('Welcome back, ' + data.name + '!', 'success');
            setTimeout(() => window.location.href = 'index.html', 800);
        } catch (error) {
            showToast(error.message, 'error');
            btn.disabled = false;
            btn.textContent = 'Sign In';
        }
    });

    // Register
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirm').value;
        const btn = registerForm.querySelector('button[type="submit"]');

        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<div class="spinner"></div> Creating account...';

        try {
            const data = await AuthAPI.register(name, email, password);
            localStorage.setItem('novamart_token', data.token);
            localStorage.setItem('novamart_user', JSON.stringify(data));
            showToast('Account created! Welcome, ' + data.name + '!', 'success');
            setTimeout(() => window.location.href = 'index.html', 800);
        } catch (error) {
            showToast(error.message, 'error');
            btn.disabled = false;
            btn.textContent = 'Create Account';
        }
    });
}

function logout() {
    localStorage.removeItem('novamart_token');
    localStorage.removeItem('novamart_user');
    localStorage.removeItem('novamart_cart_count');
    showToast('Logged out successfully', 'info');
    setTimeout(() => window.location.href = 'index.html', 500);
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('authPage')) {
        initAuthPage();
    }
});
