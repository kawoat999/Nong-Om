/**
 * ============================================================
 * LANDING PAGE - Public Homepage
 * ============================================================
 * 
 * Displays:
 * - Hero section with app value proposition
 * - Feature highlights
 * - CTA buttons for Sign In / Sign Up
 * 
 * ============================================================
 */

const LandingPage = (function () {
    /**
     * Render the landing page HTML
     * @returns {string} HTML string
     */
    function render() {
        return `
            <div class="page landing-page">
                <!-- Navigation -->
                <nav class="navbar">
                    <div class="container">
                        <a href="#/" class="navbar-brand">
                            <span class="icon">💰</span>
                            <span class="text-gradient">FinGame</span>
                        </a>
                        <ul class="navbar-nav">
                            <li><a href="#/auth">เริ่มต้นใช้งาน</a></li>
                        </ul>
                    </div>
                </nav>

                <!-- Hero Section -->
                <section class="hero">
                    <div class="hero-content animate-fade-in">
                        <h1 class="hero-title">
                            จัดการเงินเเบบ
                            <span class="text-gradient">เกมให้สนุก!</span>
                        </h1>
                        <p class="hero-subtitle">
                            บันทึกรายรับ-รายจ่ายได้ง่ายๆ ด้วยระบบ Gamification 
                            ที่ทำให้การจัดการการเงินเป็นเรื่องสนุก
                        </p>
                        <div class="hero-buttons">
                            <a href="#/auth" class="btn btn-primary btn-lg">
                                <span>🚀</span>
                                เริ่มต้นใช้งาน
                            </a>
                            <a href="#/auth" class="btn btn-secondary btn-lg">
                                <span>📖</span>
                                เรียนรู้เพิ่มเติม
                            </a>
                        </div>
                    </div>
                </section>

                <!-- Features Section -->
                <section class="features container" style="padding-bottom: var(--spacing-3xl);">
                    <div class="page-header">
                        <h2 class="text-gradient">ฟีเจอร์เด่น</h2>
                        <p class="page-subtitle">ทำไมต้อง FinGame?</p>
                    </div>
                    
                    <div class="game-actions" style="margin-top: var(--spacing-xl);">
                        <div class="card action-card">
                            <div class="icon">📊</div>
                            <h4 class="card-title">ติดตามง่าย</h4>
                            <p class="card-body">บันทึกรายรับ-รายจ่ายได้ทันที ดูสรุปแบบ Real-time</p>
                        </div>
                        
                        <div class="card action-card">
                            <div class="icon">📸</div>
                            <h4 class="card-title">สแกนสลิป</h4>
                            <p class="card-body">อัพโหลดสลิป แล้ว AI จะช่วยดึงข้อมูลให้อัตโนมัติ</p>
                        </div>
                        
                        <div class="card action-card">
                            <div class="icon">🎮</div>
                            <h4 class="card-title">เล่นเหมือนเกม</h4>
                            <p class="card-body">ระบบ Gamification ที่ทำให้การจัดการเงินสนุก</p>
                        </div>
                    </div>
                </section>

                <!-- Footer -->
                <footer style="text-align: center; padding: var(--spacing-xl); border-top: 1px solid var(--glass-border);">
                    <p style="color: var(--color-text-muted);">
                        © 2026 FinGame. Made with 💜 for better financial health.
                    </p>
                </footer>
            </div>
        `;
    }

    /**
     * Initialize page scripts
     */
    function init() {
        // Add any landing page specific scripts here
        console.log('[LandingPage] Initialized');
    }

    // Listen for route changes
    window.addEventListener('routeChanged', (e) => {
        if (e.detail.path === '/') {
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
    module.exports = LandingPage;
}
