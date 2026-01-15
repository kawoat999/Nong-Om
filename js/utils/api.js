/**
 * ============================================================
 * API - External Services Integration
 * ============================================================
 * 
 * Integrations:
 * - Google Sheets API (for data storage)
 * - N8N Webhook (for OCR processing)
 * 
 * Configuration:
 * Update the CONFIG object with your actual endpoints
 * 
 * ============================================================
 */

const API = (function () {
    // ========================================
    // CONFIGURATION
    // ========================================
    // TODO: Replace with your actual endpoints
    const CONFIG = {
        // Google Sheets Web App URL (deployed as web app from Apps Script)
        GOOGLE_SHEETS_URL: 'YOUR_GOOGLE_SHEETS_WEB_APP_URL',

        // N8N Webhook URLs
        N8N_INCOME_WEBHOOK: 'YOUR_N8N_INCOME_WEBHOOK_URL',
        N8N_EXPENSE_WEBHOOK: 'YOUR_N8N_EXPENSE_WEBHOOK_URL',

        // Request timeout (ms)
        TIMEOUT: 30000
    };

    /**
     * Check if API is configured
     * @returns {boolean}
     */
    function isConfigured() {
        return !CONFIG.GOOGLE_SHEETS_URL.includes('YOUR_');
    }

    /**
     * Send data to Google Sheets
     * @param {Object} data - Data to send
     * @param {string} data.type - 'income' or 'expense'
     * @param {number} data.amount - Amount in THB
     * @param {string} data.source - Source/Description
     * @param {string} data.userId - User ID
     * @returns {Promise<Object>}
     */
    async function sendToGoogleSheets(data) {
        // Mock implementation for demo
        if (!isConfigured()) {
            console.log('[API Mock] Sending to Google Sheets:', data);

            // Simulate API delay
            await delay(1500);

            // Store in localStorage for demo
            const key = data.type === 'income' ? 'finGame_incomes' : 'finGame_expenses';
            const records = JSON.parse(localStorage.getItem(key) || '[]');

            const newRecord = {
                id: generateId(),
                ...data,
                createdAt: new Date().toISOString()
            };

            records.push(newRecord);
            localStorage.setItem(key, JSON.stringify(records));

            return {
                success: true,
                message: 'บันทึกข้อมูลสำเร็จ!',
                data: newRecord
            };
        }

        // Real API call
        try {
            const response = await fetchWithTimeout(CONFIG.GOOGLE_SHEETS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            return await response.json();
        } catch (error) {
            console.error('[API] Google Sheets error:', error);
            return {
                success: false,
                message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
            };
        }
    }

    /**
     * Upload slip image to N8N for OCR processing
     * @param {File} file - Image file
     * @param {string} type - 'income' or 'expense'
     * @param {string} userId - User ID
     * @returns {Promise<Object>}
     */
    async function uploadSlipToN8N(file, type, userId) {
        const webhookUrl = type === 'income'
            ? CONFIG.N8N_INCOME_WEBHOOK
            : CONFIG.N8N_EXPENSE_WEBHOOK;

        // Mock implementation for demo
        if (!isConfigured()) {
            console.log('[API Mock] Uploading slip to N8N:', {
                file: file.name,
                type,
                userId
            });

            // Simulate OCR processing delay
            await delay(3000);

            // Mock OCR result
            const mockAmount = Math.floor(Math.random() * 5000) + 100;
            const mockSources = type === 'income'
                ? ['เงินเดือน', 'โบนัส', 'ค่าคอมมิชชั่น', 'รายได้เสริม']
                : ['ค่าอาหาร', 'ค่าเดินทาง', 'ค่าช้อปปิ้ง', 'ค่าบิล'];

            const mockSource = mockSources[Math.floor(Math.random() * mockSources.length)];

            // Store mock data
            const key = type === 'income' ? 'finGame_incomes' : 'finGame_expenses';
            const records = JSON.parse(localStorage.getItem(key) || '[]');

            const newRecord = {
                id: generateId(),
                type,
                amount: mockAmount,
                source: mockSource,
                userId,
                fromOCR: true,
                fileName: file.name,
                createdAt: new Date().toISOString()
            };

            records.push(newRecord);
            localStorage.setItem(key, JSON.stringify(records));

            return {
                success: true,
                message: 'ประมวลผลสลิปสำเร็จ!',
                data: newRecord
            };
        }

        // Real API call
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);
            formData.append('userId', userId);

            const response = await fetchWithTimeout(webhookUrl, {
                method: 'POST',
                body: formData
            });

            return await response.json();
        } catch (error) {
            console.error('[API] N8N Webhook error:', error);
            return {
                success: false,
                message: 'เกิดข้อผิดพลาดในการประมวลผลสลิป'
            };
        }
    }

    /**
     * Get financial records for a user
     * @param {string} userId - User ID
     * @returns {Object} { incomes: [], expenses: [] }
     */
    function getRecords(userId) {
        const incomes = JSON.parse(localStorage.getItem('finGame_incomes') || '[]')
            .filter(r => r.userId === userId);

        const expenses = JSON.parse(localStorage.getItem('finGame_expenses') || '[]')
            .filter(r => r.userId === userId);

        return { incomes, expenses };
    }

    /**
     * Calculate financial summary
     * @param {string} userId - User ID
     * @returns {Object} { totalIncome, totalExpense, balance }
     */
    function getSummary(userId) {
        const { incomes, expenses } = getRecords(userId);

        const totalIncome = incomes.reduce((sum, r) => sum + r.amount, 0);
        const totalExpense = expenses.reduce((sum, r) => sum + r.amount, 0);
        const balance = totalIncome - totalExpense;

        return { totalIncome, totalExpense, balance };
    }

    /**
     * Fetch with timeout wrapper
     * @param {string} url 
     * @param {Object} options 
     * @returns {Promise<Response>}
     */
    async function fetchWithTimeout(url, options) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    /**
     * Delay helper
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise}
     */
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Generate unique ID
     * @returns {string}
     */
    function generateId() {
        return 'rec_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Format currency (Thai Baht)
     * @param {number} amount 
     * @returns {string}
     */
    function formatCurrency(amount) {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Public API
    return {
        isConfigured,
        sendToGoogleSheets,
        uploadSlipToN8N,
        getRecords,
        getSummary,
        formatCurrency
    };
})();

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}
