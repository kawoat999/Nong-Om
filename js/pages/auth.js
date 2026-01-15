/**
 * ============================================================
 * AUTH PAGE - Sign In / Sign Up Forms
 * ============================================================
 * 
 * Features:
 * - Tab switching between Sign In and Sign Up
 * - Form validation
 * - Authentication integration
 * - Success/Error feedback
 * 
 * Flow:
 * - Sign In: Email → Password → Confirm
 * - Sign Up: Name → Password → Email → Confirm
 * 
 * ============================================================
 */

const AuthPage = (function () {
    /**
     * Render the auth page HTML
     * @returns {string} HTML string
     */
    function render() {
        return `
            <div class="page auth-page">
                <!-- Navigation -->
                <nav class="navbar">
                    <div class="container">
                        <a href="#/" class="navbar-brand">
                            <span class="icon">💰</span>
                            <span class="text-gradient">FinGame</span>
                        </a>
                    </div>
                </nav>

                <!-- Auth Container -->
                <div class="auth-container">
                    <div class="card auth-card animate-fade-in">
                        <!-- Tabs -->
                        <div class="auth-tabs">
                            <button class="auth-tab active" data-tab="signin">เข้าสู่ระบบ</button>
                            <button class="auth-tab" data-tab="signup">สมัครสมาชิก</button>
                        </div>

                        <!-- Sign In Form -->
                        <form id="signin-form" class="auth-form active">
                            <div class="form-group">
                                <label class="form-label">อีเมล</label>
                                <input 
                                    type="email" 
                                    class="form-input" 
                                    name="email"
                                    placeholder="your@email.com"
                                    required
                                    autocomplete="email"
                                >
                            </div>

                            <div class="form-group">
                                <label class="form-label">รหัสผ่าน</label>
                                <input 
                                    type="password" 
                                    class="form-input" 
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    autocomplete="current-password"
                                >
                            </div>

                            <button type="submit" class="btn btn-primary w-full btn-lg mt-lg">
                                <span>🔐</span>
                                เข้าสู่ระบบ
                            </button>

                            <p class="text-center mt-lg" style="color: var(--color-text-muted);">
                                ยังไม่มีบัญชี? 
                                <a href="#" class="switch-to-signup">สมัครสมาชิก</a>
                            </p>
                        </form>

                        <!-- Sign Up Form -->
                        <form id="signup-form" class="auth-form" style="display: none;">
                            <div class="form-group">
                                <label class="form-label">ชื่อของคุณ</label>
                                <input 
                                    type="text" 
                                    class="form-input" 
                                    name="name"
                                    placeholder="ใส่ชื่อของคุณ"
                                    required
                                    autocomplete="name"
                                >
                            </div>

                            <div class="form-group">
                                <label class="form-label">รหัสผ่าน</label>
                                <input 
                                    type="password" 
                                    class="form-input" 
                                    name="password"
                                    placeholder="อย่างน้อย 6 ตัวอักษร"
                                    required
                                    minlength="6"
                                    autocomplete="new-password"
                                >
                            </div>

                            <div class="form-group">
                                <label class="form-label">อีเมล</label>
                                <input 
                                    type="email" 
                                    class="form-input" 
                                    name="email"
                                    placeholder="your@email.com"
                                    required
                                    autocomplete="email"
                                >
                            </div>

                            <button type="submit" class="btn btn-primary w-full btn-lg mt-lg">
                                <span>✨</span>
                                สมัครสมาชิก
                            </button>

                            <p class="text-center mt-lg" style="color: var(--color-text-muted);">
                                มีบัญชีอยู่แล้ว? 
                                <a href="#" class="switch-to-signin">เข้าสู่ระบบ</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Initialize page scripts
     */
    function init() {
        console.log('[AuthPage] Initialized');

        // Tab switching
        const tabs = document.querySelectorAll('.auth-tab');
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabType = tab.dataset.tab;

                // Update tab active state
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Show/hide forms
                if (tabType === 'signin') {
                    signinForm.style.display = 'block';
                    signupForm.style.display = 'none';
                } else {
                    signinForm.style.display = 'none';
                    signupForm.style.display = 'block';
                }
            });
        });

        // Switch links
        document.querySelector('.switch-to-signup')?.addEventListener('click', (e) => {
            e.preventDefault();
            tabs[1].click();
        });

        document.querySelector('.switch-to-signin')?.addEventListener('click', (e) => {
            e.preventDefault();
            tabs[0].click();
        });

        // Sign In Form submission
        signinForm?.addEventListener('submit', handleSignIn);

        // Sign Up Form submission
        signupForm?.addEventListener('submit', handleSignUp);
    }

    /**
     * Handle Sign In form submission
     * @param {Event} e 
     */
    function handleSignIn(e) {
        e.preventDefault();

        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div>';
        submitBtn.disabled = true;

        // Simulate network delay
        setTimeout(() => {
            const result = Auth.signIn(email, password);

            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            if (result.success) {
                Modal.success(result.message, {
                    title: 'ยินดีต้อนรับ!',
                    onConfirm: () => {
                        Router.navigate('/dashboard');
                    }
                });

                // Redirect after animation
                setTimeout(() => {
                    Modal.close();
                    Router.navigate('/dashboard');
                }, 1500);
            } else {
                Modal.error(result.message);
            }
        }, 800);
    }

    /**
     * Handle Sign Up form submission
     * @param {Event} e 
     */
    function handleSignUp(e) {
        e.preventDefault();

        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;

        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div>';
        submitBtn.disabled = true;

        // Simulate network delay
        setTimeout(() => {
            const result = Auth.signUp({ name, email, password });

            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            if (result.success) {
                Modal.success('สร้างบัญชีสำเร็จ! ยินดีต้อนรับสู่ FinGame', {
                    title: 'ยินดีต้อนรับ! 🎉'
                });

                // Redirect after animation
                setTimeout(() => {
                    Modal.close();
                    Router.navigate('/dashboard');
                }, 1500);
            } else {
                Modal.error(result.message);
            }
        }, 800);
    }

    // Listen for route changes
    window.addEventListener('routeChanged', (e) => {
        if (e.detail.path === '/auth') {
            init();
        }
    });

    // Public API
    return {
        render,
        init
    };
})();

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthPage;
}
