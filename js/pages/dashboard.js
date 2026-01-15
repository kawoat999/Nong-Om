/**
 * ============================================================
 * DASHBOARD PAGE - Logged-In Landing Page
 * ============================================================
 * 
 * Displays:
 * - Welcome message with user name
 * - Quick stats summary
 * - Home & Get Started navigation
 * - Logout option
 * 
 * ============================================================
 */

const DashboardPage = (function () {
    /**
     * Render the dashboard page HTML
     * @returns {string} HTML string
     */
    function render() {
        const user = Auth.getCurrentUser();
        const summary = API.getSummary(user?.id || '');

        return `
            <div class="page dashboard-page">
                <!-- Navigation -->
                <nav class="navbar">
                    <div class="container">
                        <a href="#/dashboard" class="navbar-brand">
                            <span class="icon">💰</span>
                            <span class="text-gradient">FinGame</span>
                        </a>
                        <ul class="navbar-nav">
                            <li><a href="#/dashboard" class="active">หน้าหลัก</a></li>
                            <li><a href="#/game">เกม</a></li>
                            <li>
                                <button class="btn btn-secondary btn-sm" id="logout-btn">
                                    🚪 ออกจากระบบ
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>

                <!-- Dashboard Content -->
                <div class="container" style="padding-top: 120px;">
                    <!-- Welcome Section -->
                    <div class="page-header animate-fade-in">
                        <h1>
                            สวัสดี, <span class="text-gradient">${user?.name || 'ผู้ใช้'}</span>! 👋
                        </h1>
                        <p class="page-subtitle">
                            ยินดีต้อนรับสู่ FinGame - พร้อมจัดการเงินของคุณวันนี้หรือยัง?
                        </p>
                    </div>

                    <!-- Quick Stats -->
                    <div class="game-stats animate-slide-in">
                        <div class="card stat-card">
                            <div class="stat-value income">${API.formatCurrency(summary.totalIncome)}</div>
                            <div class="stat-label">รายรับทั้งหมด</div>
                        </div>
                        <div class="card stat-card">
                            <div class="stat-value expense">${API.formatCurrency(summary.totalExpense)}</div>
                            <div class="stat-label">รายจ่ายทั้งหมด</div>
                        </div>
                        <div class="card stat-card">
                            <div class="stat-value balance">${API.formatCurrency(summary.balance)}</div>
                            <div class="stat-label">ยอดคงเหลือ</div>
                        </div>
                    </div>

                    <!-- Action Cards -->
                    <div class="game-actions" style="margin-top: var(--spacing-2xl);">
                        <div class="card action-card" id="action-home" style="cursor: pointer;">
                            <div class="icon" style="font-size: 3rem; margin-bottom: var(--spacing-md);">🏠</div>
                            <h4 class="card-title">หน้าหลัก</h4>
                            <p class="card-body">ดูสรุปภาพรวมการเงินของคุณ</p>
                        </div>
                        
                        <div class="card action-card" id="action-game" style="cursor: pointer;">
                            <div class="icon" style="font-size: 3rem; margin-bottom: var(--spacing-md);">🎮</div>
                            <h4 class="card-title">เริ่มเกม</h4>
                            <p class="card-body">เข้าสู่ระบบบันทึกรายรับ-รายจ่าย</p>
                        </div>
                    </div>

                    <!-- Recent Activity (if any) -->
                    ${renderRecentActivity(user?.id || '')}
                </div>
            </div>
        `;
    }

    /**
     * Render recent activity section
     * @param {string} userId 
     * @returns {string} HTML string
     */
    function renderRecentActivity(userId) {
        const { incomes, expenses } = API.getRecords(userId);
        const allRecords = [...incomes, ...expenses]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        if (allRecords.length === 0) {
            return `
                <div class="card mt-xl text-center" style="padding: var(--spacing-2xl);">
                    <div style="font-size: 3rem; margin-bottom: var(--spacing-md);">📝</div>
                    <h4>ยังไม่มีรายการ</h4>
                    <p style="color: var(--color-text-muted);">เริ่มบันทึกรายรับ-รายจ่ายของคุณตอนนี้เลย!</p>
                    <a href="#/game" class="btn btn-primary mt-lg">เริ่มบันทึก</a>
                </div>
            `;
        }

        return `
            <div class="card mt-xl">
                <div class="card-header">
                    <h4 class="card-title" style="margin-bottom: 0;">รายการล่าสุด</h4>
                </div>
                <div class="card-body">
                    ${allRecords.map(record => `
                        <div class="flex justify-between items-center" style="padding: var(--spacing-md) 0; border-bottom: 1px solid var(--glass-border);">
                            <div>
                                <span style="font-weight: 600;">${record.source}</span>
                                <div style="font-size: var(--font-size-sm); color: var(--color-text-muted);">
                                    ${new Date(record.createdAt).toLocaleDateString('th-TH')}
                                </div>
                            </div>
                            <div class="${record.type === 'income' ? 'stat-value income' : 'stat-value expense'}" style="font-size: var(--font-size-lg);">
                                ${record.type === 'income' ? '+' : '-'}${API.formatCurrency(record.amount)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Initialize page scripts
     */
    function init() {
        console.log('[DashboardPage] Initialized');

        // Logout button
        document.getElementById('logout-btn')?.addEventListener('click', handleLogout);

        // Action cards
        document.getElementById('action-home')?.addEventListener('click', () => {
            // Refresh current page
            Router.navigate('/dashboard');
        });

        document.getElementById('action-game')?.addEventListener('click', () => {
            Router.navigate('/game');
        });
    }

    /**
     * Handle logout
     */
    function handleLogout() {
        Modal.confirm('คุณต้องการออกจากระบบหรือไม่?', {
            title: 'ออกจากระบบ',
            confirmText: 'ออกจากระบบ',
            cancelText: 'ยกเลิก',
            onConfirm: () => {
                Auth.signOut();
                Router.navigate('/');
            }
        });
    }

    // Listen for route changes
    window.addEventListener('routeChanged', (e) => {
        if (e.detail.path === '/dashboard') {
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
    module.exports = DashboardPage;
}
