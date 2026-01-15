/**
 * ============================================================
 * MODAL COMPONENT - Reusable Modal System
 * ============================================================
 * 
 * Features:
 * - Success/Error/Confirm modals
 * - Fade animations
 * - Click outside to close
 * - Keyboard escape to close
 * 
 * Usage:
 *   Modal.success('บันทึกสำเร็จ!');
 *   Modal.error('เกิดข้อผิดพลาด');
 *   Modal.confirm('ต้องการออก?', { onConfirm: () => {...} });
 * 
 * ============================================================
 */

const Modal = (function () {
    let currentModal = null;

    /**
     * Create base modal structure
     * @param {Object} options - Modal options
     * @returns {HTMLElement}
     */
    function createModal(options) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'modal-' + Date.now();

        const modalHTML = `
            <div class="modal ${options.type ? 'modal-' + options.type : ''}">
                ${options.showClose !== false ? `
                    <button class="modal-close" aria-label="Close">&times;</button>
                ` : ''}
                
                ${options.icon ? `
                    <div class="modal-icon ${options.iconClass || ''}">
                        ${options.icon}
                    </div>
                ` : ''}
                
                ${options.title ? `
                    <h3 class="modal-title text-center">${options.title}</h3>
                ` : ''}
                
                ${options.message ? `
                    <div class="modal-body text-center">
                        <p>${options.message}</p>
                    </div>
                ` : ''}
                
                ${options.content ? `
                    <div class="modal-body">
                        ${options.content}
                    </div>
                ` : ''}
                
                <div class="modal-footer justify-center">
                    ${options.buttons || `
                        <button class="btn btn-primary" data-action="close">ตกลง</button>
                    `}
                </div>
            </div>
        `;

        overlay.innerHTML = modalHTML;

        // Event listeners
        const closeBtn = overlay.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => close(overlay));
        }

        // Click outside to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                close(overlay);
            }
        });

        // Button actions
        overlay.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                if (action === 'close') {
                    close(overlay);
                } else if (action === 'confirm' && options.onConfirm) {
                    options.onConfirm();
                    close(overlay);
                } else if (action === 'cancel' && options.onCancel) {
                    options.onCancel();
                    close(overlay);
                }
            });
        });

        return overlay;
    }

    /**
     * Show a modal
     * @param {HTMLElement} modal 
     */
    function show(modal) {
        // Close any existing modal
        if (currentModal) {
            close(currentModal);
        }

        document.body.appendChild(modal);
        currentModal = modal;

        // Trigger animation
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });

        // Escape key listener
        document.addEventListener('keydown', handleEscape);
    }

    /**
     * Close a modal
     * @param {HTMLElement} modal 
     */
    function close(modal) {
        if (!modal) return;

        modal.classList.remove('active');

        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            if (currentModal === modal) {
                currentModal = null;
            }
        }, 300);

        document.removeEventListener('keydown', handleEscape);
    }

    /**
     * Handle escape key
     * @param {KeyboardEvent} e 
     */
    function handleEscape(e) {
        if (e.key === 'Escape' && currentModal) {
            close(currentModal);
        }
    }

    /**
     * Success Modal
     * @param {string} message 
     * @param {Object} options 
     */
    function success(message, options = {}) {
        const modal = createModal({
            type: 'success',
            icon: `
                <div class="icon-success">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
            `,
            title: options.title || 'สำเร็จ!',
            message: message,
            ...options
        });
        show(modal);
        return modal;
    }

    /**
     * Error Modal
     * @param {string} message 
     * @param {Object} options 
     */
    function error(message, options = {}) {
        const modal = createModal({
            type: 'error',
            icon: `
                <div class="icon-error" style="width:80px;height:80px;margin:0 auto var(--spacing-lg);background:linear-gradient(135deg,var(--color-danger),#E11D48);border-radius:50%;display:flex;align-items:center;justify-content:center;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
            `,
            title: options.title || 'เกิดข้อผิดพลาด',
            message: message,
            ...options
        });
        show(modal);
        return modal;
    }

    /**
     * Confirm Modal
     * @param {string} message 
     * @param {Object} options 
     * @param {Function} options.onConfirm - Callback when confirmed
     * @param {Function} options.onCancel - Callback when cancelled
     */
    function confirm(message, options = {}) {
        const modal = createModal({
            type: 'confirm',
            icon: `
                <div class="icon-confirm" style="width:80px;height:80px;margin:0 auto var(--spacing-lg);background:linear-gradient(135deg,var(--color-warning),#D97706);border-radius:50%;display:flex;align-items:center;justify-content:center;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
            `,
            title: options.title || 'ยืนยัน',
            message: message,
            buttons: `
                <button class="btn btn-secondary" data-action="cancel">${options.cancelText || 'ยกเลิก'}</button>
                <button class="btn btn-primary" data-action="confirm">${options.confirmText || 'ยืนยัน'}</button>
            `,
            showClose: false,
            onConfirm: options.onConfirm,
            onCancel: options.onCancel
        });
        show(modal);
        return modal;
    }

    /**
     * Loading Modal
     * @param {string} message 
     */
    function loading(message = 'กำลังโหลด...') {
        const modal = createModal({
            type: 'loading',
            icon: `
                <div style="display:flex;justify-content:center;margin-bottom:var(--spacing-lg);">
                    <div class="spinner"></div>
                </div>
            `,
            message: message,
            showClose: false,
            buttons: ''
        });
        show(modal);
        return modal;
    }

    /**
     * Custom Modal
     * @param {Object} options - Full modal options
     */
    function custom(options) {
        const modal = createModal(options);
        show(modal);
        return modal;
    }

    // Public API
    return {
        success,
        error,
        confirm,
        loading,
        custom,
        close: () => currentModal && close(currentModal)
    };
})();

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Modal;
}
