/**
 * ============================================================
 * GAME PAGE - Main Financial Game Interface
 * ============================================================
 * 
 * Features:
 * - Bank → INFO → PORT flow
 * - Add Income functionality
 * - Add Expense functionality
 * - Portfolio summary
 * - Exit check modal
 * 
 * ============================================================
 */

const GamePage = (function () {
    // Current view state
    let currentView = 'main'; // main, bank, income, expense

    /**
     * Render the game page HTML
     * @returns {string} HTML string
     */
    function render() {
        const user = Auth.getCurrentUser();
        const summary = API.getSummary(user?.id || '');

        return `
            <div class="page game-page">
                <!-- Navigation -->
                <nav class="navbar">
                    <div class="container">
                        <a href="#/dashboard" class="navbar-brand">
                            <span class="icon">💰</span>
                            <span class="text-gradient">FinGame</span>
                        </a>
                        <ul class="navbar-nav">
                            <li><a href="#/dashboard">หน้าหลัก</a></li>
                            <li><a href="#/game" class="active">เกม</a></li>
                            <li>
                                <button class="btn btn-secondary btn-sm" id="logout-btn">
                                    🚪 ออกจากระบบ
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>

                <!-- Game Container -->
                <div class="game-container container" style="padding-top: 100px;">
                    <!-- Game Header -->
                    <div class="game-header animate-fade-in">
                        <div>
                            <h2 class="text-gradient">🎮 Game Center</h2>
                            <p style="color: var(--color-text-muted);">จัดการการเงินของคุณ</p>
                        </div>
                        <button class="btn btn-secondary" id="back-to-landing">
                            ← กลับหน้าหลัก
                        </button>
                    </div>

                    <!-- Stats Row -->
                    <div class="game-stats animate-slide-in">
                        <div class="card stat-card">
                            <div class="stat-value income">${API.formatCurrency(summary.totalIncome)}</div>
                            <div class="stat-label">💚 รายรับ</div>
                        </div>
                        <div class="card stat-card">
                            <div class="stat-value expense">${API.formatCurrency(summary.totalExpense)}</div>
                            <div class="stat-label">❤️ รายจ่าย</div>
                        </div>
                        <div class="card stat-card">
                            <div class="stat-value balance">${API.formatCurrency(summary.balance)}</div>
                            <div class="stat-label">💜 ยอดคงเหลือ</div>
                        </div>
                    </div>

                    <!-- Main Game View -->
                    <div id="game-view-main" class="game-view">
                        <h3 class="text-center mb-xl">เลือกสิ่งที่ต้องการทำ</h3>
                        <div class="game-actions">
                            <!-- Bank Card -->
                            <div class="card action-card bank" id="action-bank">
                                <div class="icon">🏦</div>
                                <h4 class="card-title">Bank</h4>
                                <p class="card-body">ดูข้อมูลบัญชีและพอร์ตโฟลิโอ</p>
                            </div>
                            
                            <!-- Add Income Card -->
                            <div class="card action-card income" id="action-income">
                                <div class="icon">💵</div>
                                <h4 class="card-title">เพิ่มรายรับ</h4>
                                <p class="card-body">บันทึกเงินที่ได้รับ</p>
                            </div>
                            
                            <!-- Add Expense Card -->
                            <div class="card action-card expense" id="action-expense">
                                <div class="icon">🛒</div>
                                <h4 class="card-title">เพิ่มรายจ่าย</h4>
                                <p class="card-body">บันทึกค่าใช้จ่าย</p>
                            </div>
                        </div>
                    </div>

                    <!-- Bank View -->
                    <div id="game-view-bank" class="game-view" style="display: none;">
                        ${renderBankView(user?.id || '')}
                    </div>

                    <!-- Income View -->
                    <div id="game-view-income" class="game-view" style="display: none;">
                        ${renderIncomeView()}
                    </div>

                    <!-- Expense View -->
                    <div id="game-view-expense" class="game-view" style="display: none;">
                        ${renderExpenseView()}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render Bank view (INFO → PORT flow)
     */
    function renderBankView(userId) {
        const { incomes, expenses } = API.getRecords(userId);
        const summary = API.getSummary(userId);

        return `
            <div class="card animate-fade-in">
                <div class="card-header flex justify-between items-center">
                    <h3 class="card-title" style="margin-bottom: 0;">🏦 Bank Information</h3>
                    <button class="btn btn-secondary btn-sm" data-action="back-to-main">← กลับ</button>
                </div>
                
                <!-- Tabs: INFO / PORT -->
                <div class="tabs">
                    <button class="tab-btn active" data-tab="info">📊 INFO</button>
                    <button class="tab-btn" data-tab="port">📈 PORT</button>
                </div>

                <!-- INFO Tab -->
                <div class="tab-content active" id="tab-info">
                    <div class="game-stats" style="margin-bottom: var(--spacing-lg);">
                        <div class="stat-card" style="background: var(--color-bg-tertiary); padding: var(--spacing-lg); border-radius: var(--radius-lg);">
                            <div class="stat-value income" style="font-size: var(--font-size-2xl);">+${API.formatCurrency(summary.totalIncome)}</div>
                            <div class="stat-label">รายรับทั้งหมด</div>
                        </div>
                        <div class="stat-card" style="background: var(--color-bg-tertiary); padding: var(--spacing-lg); border-radius: var(--radius-lg);">
                            <div class="stat-value expense" style="font-size: var(--font-size-2xl);">-${API.formatCurrency(summary.totalExpense)}</div>
                            <div class="stat-label">รายจ่ายทั้งหมด</div>
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); padding: var(--spacing-xl); border-radius: var(--radius-lg); text-align: center;">
                        <div style="font-size: var(--font-size-sm); opacity: 0.8;">ยอดคงเหลือปัจจุบัน</div>
                        <div style="font-size: var(--font-size-4xl); font-weight: 800;">${API.formatCurrency(summary.balance)}</div>
                    </div>
                </div>

                <!-- PORT Tab (Portfolio) -->
                <div class="tab-content" id="tab-port">
                    <h4 class="mb-lg">📈 รายการธุรกรรมทั้งหมด</h4>
                    
                    ${incomes.length === 0 && expenses.length === 0 ? `
                        <div class="text-center" style="padding: var(--spacing-2xl); color: var(--color-text-muted);">
                            <div style="font-size: 3rem; margin-bottom: var(--spacing-md);">📭</div>
                            <p>ยังไม่มีรายการ</p>
                        </div>
                    ` : `
                        <div style="max-height: 400px; overflow-y: auto;">
                            ${[...incomes.map(r => ({ ...r, _type: 'income' })), ...expenses.map(r => ({ ...r, _type: 'expense' }))]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map(record => `
                                    <div class="flex justify-between items-center" style="padding: var(--spacing-md); border-bottom: 1px solid var(--glass-border);">
                                        <div class="flex items-center gap-md">
                                            <span style="font-size: 1.5rem;">${record._type === 'income' ? '💵' : '🛒'}</span>
                                            <div>
                                                <div style="font-weight: 600;">${record.source}</div>
                                                <div style="font-size: var(--font-size-sm); color: var(--color-text-muted);">
                                                    ${new Date(record.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    ${record.fromOCR ? ' • 📸 จากสลิป' : ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="${record._type === 'income' ? 'stat-value income' : 'stat-value expense'}" style="font-size: var(--font-size-lg);">
                                            ${record._type === 'income' ? '+' : '-'}${API.formatCurrency(record.amount)}
                                        </div>
                                    </div>
                                `).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    /**
     * Render Income form view
     */
    function renderIncomeView() {
        return `
            <div class="card animate-fade-in">
                <div class="card-header flex justify-between items-center">
                    <h3 class="card-title" style="margin-bottom: 0;">💵 เพิ่มรายรับ</h3>
                    <button class="btn btn-secondary btn-sm" data-action="back-to-main">← กลับ</button>
                </div>

                <!-- Tabs: Form / Upload -->
                <div class="tabs">
                    <button class="tab-btn active" data-tab="income-form">📝 กรอกข้อมูล</button>
                    <button class="tab-btn" data-tab="income-upload">📸 อัพโหลดสลิป</button>
                </div>

                <!-- Form Tab -->
                <div class="tab-content active" id="tab-income-form">
                    <form id="income-form">
                        <div class="form-group">
                            <label class="form-label">จำนวนเงิน (บาท)</label>
                            <input 
                                type="number" 
                                class="form-input" 
                                name="amount"
                                placeholder="0.00"
                                min="1"
                                required
                            >
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">มาจากไหน / รายละเอียด</label>
                            <input 
                                type="text" 
                                class="form-input" 
                                name="source"
                                placeholder="เช่น เงินเดือน, โบนัส, ค่าคอมมิชชั่น"
                                required
                            >
                        </div>
                        
                        <button type="submit" class="btn btn-success w-full btn-lg">
                            <span>✅</span>
                            บันทึกรายรับ
                        </button>
                    </form>
                </div>

                <!-- Upload Tab -->
                <div class="tab-content" id="tab-income-upload">
                    <div class="upload-area" id="income-upload-area">
                        <input type="file" id="income-file-input" accept="image/*" style="display: none;">
                        <div class="upload-icon">📤</div>
                        <h4>ลากไฟล์มาวางที่นี่</h4>
                        <p style="color: var(--color-text-muted);">หรือคลิกเพื่อเลือกไฟล์</p>
                        <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: var(--spacing-md);">
                            รองรับไฟล์: JPG, PNG (สลิปโอนเงิน)
                        </p>
                    </div>
                    <div id="income-upload-preview" style="display: none; margin-top: var(--spacing-lg);">
                        <img id="income-preview-img" style="max-width: 100%; border-radius: var(--radius-lg); margin-bottom: var(--spacing-lg);">
                        <button class="btn btn-success w-full" id="income-upload-submit">
                            <span>🤖</span>
                            ประมวลผลด้วย AI
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render Expense form view
     */
    function renderExpenseView() {
        return `
            <div class="card animate-fade-in">
                <div class="card-header flex justify-between items-center">
                    <h3 class="card-title" style="margin-bottom: 0;">🛒 เพิ่มรายจ่าย</h3>
                    <button class="btn btn-secondary btn-sm" data-action="back-to-main">← กลับ</button>
                </div>

                <!-- Tabs: Form / Upload -->
                <div class="tabs">
                    <button class="tab-btn active" data-tab="expense-form">📝 กรอกข้อมูล</button>
                    <button class="tab-btn" data-tab="expense-upload">📸 อัพโหลดสลิป</button>
                </div>

                <!-- Form Tab -->
                <div class="tab-content active" id="tab-expense-form">
                    <form id="expense-form">
                        <div class="form-group">
                            <label class="form-label">จำนวนเงิน (บาท)</label>
                            <input 
                                type="number" 
                                class="form-input" 
                                name="amount"
                                placeholder="0.00"
                                min="1"
                                required
                            >
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">จ่ายค่าอะไร / รายละเอียด</label>
                            <input 
                                type="text" 
                                class="form-input" 
                                name="source"
                                placeholder="เช่น ค่าอาหาร, ค่าเดินทาง, ค่าช้อปปิ้ง"
                                required
                            >
                        </div>
                        
                        <button type="submit" class="btn btn-danger w-full btn-lg">
                            <span>✅</span>
                            บันทึกรายจ่าย
                        </button>
                    </form>
                </div>

                <!-- Upload Tab -->
                <div class="tab-content" id="tab-expense-upload">
                    <div class="upload-area" id="expense-upload-area">
                        <input type="file" id="expense-file-input" accept="image/*" style="display: none;">
                        <div class="upload-icon">📤</div>
                        <h4>ลากไฟล์มาวางที่นี่</h4>
                        <p style="color: var(--color-text-muted);">หรือคลิกเพื่อเลือกไฟล์</p>
                        <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: var(--spacing-md);">
                            รองรับไฟล์: JPG, PNG (ใบเสร็จ/สลิป)
                        </p>
                    </div>
                    <div id="expense-upload-preview" style="display: none; margin-top: var(--spacing-lg);">
                        <img id="expense-preview-img" style="max-width: 100%; border-radius: var(--radius-lg); margin-bottom: var(--spacing-lg);">
                        <button class="btn btn-danger w-full" id="expense-upload-submit">
                            <span>🤖</span>
                            ประมวลผลด้วย AI
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Switch between game views
     * @param {string} viewName - main, bank, income, expense
     */
    function switchView(viewName) {
        currentView = viewName;

        // Hide all views
        document.querySelectorAll('.game-view').forEach(v => v.style.display = 'none');

        // Show target view
        const targetView = document.getElementById(`game-view-${viewName}`);
        if (targetView) {
            targetView.style.display = 'block';
        }
    }

    /**
     * Initialize page scripts
     */
    function init() {
        console.log('[GamePage] Initialized');
        currentView = 'main';

        // Logout button
        document.getElementById('logout-btn')?.addEventListener('click', handleLogout);

        // Back to landing button
        document.getElementById('back-to-landing')?.addEventListener('click', () => {
            showExitCheck();
        });

        // Action cards
        document.getElementById('action-bank')?.addEventListener('click', () => switchView('bank'));
        document.getElementById('action-income')?.addEventListener('click', () => switchView('income'));
        document.getElementById('action-expense')?.addEventListener('click', () => switchView('expense'));

        // Back buttons
        document.querySelectorAll('[data-action="back-to-main"]').forEach(btn => {
            btn.addEventListener('click', () => switchView('main'));
        });

        // Initialize tabs
        initTabs();

        // Initialize forms
        initForms();

        // Initialize file uploads
        initFileUploads();
    }

    /**
     * Initialize tab switching
     */
    function initTabs() {
        document.querySelectorAll('.tabs').forEach(tabContainer => {
            const tabs = tabContainer.querySelectorAll('.tab-btn');

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabName = tab.dataset.tab;

                    // Update active tab
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');

                    // Show target content
                    const parent = tabContainer.closest('.card') || tabContainer.parentElement;
                    parent.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.remove('active');
                    });

                    const targetContent = document.getElementById(`tab-${tabName}`);
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                });
            });
        });
    }

    /**
     * Initialize form submissions
     */
    function initForms() {
        const user = Auth.getCurrentUser();

        // Income form
        document.getElementById('income-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const amount = parseFloat(form.amount.value);
            const source = form.source.value.trim();

            if (!amount || amount <= 0) {
                Modal.error('กรุณากรอกจำนวนเงินที่ถูกต้อง');
                return;
            }

            // Show loading
            const loadingModal = Modal.loading('กำลังบันทึกข้อมูล...');

            try {
                const result = await API.sendToGoogleSheets({
                    type: 'income',
                    amount,
                    source,
                    userId: user?.id || ''
                });

                Modal.close();

                if (result.success) {
                    Modal.success(result.message, {
                        title: 'บันทึกรายรับสำเร็จ! 💵'
                    });
                    form.reset();

                    // Refresh page after delay
                    setTimeout(() => {
                        Router.navigate('/game');
                    }, 2000);
                } else {
                    Modal.error(result.message);
                }
            } catch (error) {
                Modal.close();
                Modal.error('เกิดข้อผิดพลาด กรุณาลองใหม่');
            }
        });

        // Expense form
        document.getElementById('expense-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const amount = parseFloat(form.amount.value);
            const source = form.source.value.trim();

            if (!amount || amount <= 0) {
                Modal.error('กรุณากรอกจำนวนเงินที่ถูกต้อง');
                return;
            }

            // Show loading
            const loadingModal = Modal.loading('กำลังบันทึกข้อมูล...');

            try {
                const result = await API.sendToGoogleSheets({
                    type: 'expense',
                    amount,
                    source,
                    userId: user?.id || ''
                });

                Modal.close();

                if (result.success) {
                    Modal.success(result.message, {
                        title: 'บันทึกรายจ่ายสำเร็จ! 🛒'
                    });
                    form.reset();

                    // Refresh page after delay
                    setTimeout(() => {
                        Router.navigate('/game');
                    }, 2000);
                } else {
                    Modal.error(result.message);
                }
            } catch (error) {
                Modal.close();
                Modal.error('เกิดข้อผิดพลาด กรุณาลองใหม่');
            }
        });
    }

    /**
     * Initialize file upload areas
     */
    function initFileUploads() {
        const user = Auth.getCurrentUser();

        // Income upload
        setupUploadArea('income', user?.id || '');

        // Expense upload
        setupUploadArea('expense', user?.id || '');
    }

    /**
     * Setup upload area for a type
     * @param {string} type - income or expense
     * @param {string} userId 
     */
    function setupUploadArea(type, userId) {
        const uploadArea = document.getElementById(`${type}-upload-area`);
        const fileInput = document.getElementById(`${type}-file-input`);
        const previewDiv = document.getElementById(`${type}-upload-preview`);
        const previewImg = document.getElementById(`${type}-preview-img`);
        const submitBtn = document.getElementById(`${type}-upload-submit`);

        if (!uploadArea || !fileInput) return;

        // Click to upload
        uploadArea.addEventListener('click', () => fileInput.click());

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');

            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                handleFileSelect(file);
            }
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleFileSelect(file);
            }
        });

        // Handle file selection
        function handleFileSelect(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImg.src = e.target.result;
                uploadArea.style.display = 'none';
                previewDiv.style.display = 'block';
            };
            reader.readAsDataURL(file);

            // Store file for submission
            submitBtn._file = file;
        }

        // Submit upload
        submitBtn?.addEventListener('click', async () => {
            const file = submitBtn._file;
            if (!file) return;

            const loadingModal = Modal.loading('🤖 AI กำลังประมวลผลสลิป...');

            try {
                const result = await API.uploadSlipToN8N(file, type, userId);

                Modal.close();

                if (result.success) {
                    Modal.success(`${result.message}\n\nจำนวน: ${API.formatCurrency(result.data.amount)}\nรายละเอียด: ${result.data.source}`, {
                        title: type === 'income' ? 'บันทึกรายรับสำเร็จ! 💵' : 'บันทึกรายจ่ายสำเร็จ! 🛒'
                    });

                    // Reset upload area
                    uploadArea.style.display = 'block';
                    previewDiv.style.display = 'none';
                    fileInput.value = '';

                    // Refresh page after delay
                    setTimeout(() => {
                        Router.navigate('/game');
                    }, 2500);
                } else {
                    Modal.error(result.message);
                }
            } catch (error) {
                Modal.close();
                Modal.error('เกิดข้อผิดพลาดในการประมวลผล');
            }
        });
    }

    /**
     * Show exit check modal
     */
    function showExitCheck() {
        Modal.confirm('ต้องการออกจากหน้าเกมหรือไม่?', {
            title: 'ออกจากเกม',
            confirmText: 'ใช่, ออก',
            cancelText: 'ไม่, อยู่ต่อ',
            onConfirm: () => {
                Router.navigate('/dashboard');
            }
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
        if (e.detail.path === '/game') {
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
    module.exports = GamePage;
}
