/**
 * ============================================================
 * MAIN APPLICATION - Entry Point
 * ============================================================
 * 
 * Responsibilities:
 * - Initialize router with all routes
 * - Setup global event listeners
 * - Handle authentication state
 * 
 * ============================================================
 */

const App = (function () {
    /**
     * Initialize the application
     */
    function init() {
        console.log('🚀 [App] Initializing FinGame...');

        // Register routes
        Router.register('/', LandingPage.render, { guestOnly: false });
        Router.register('/auth', AuthPage.render, { guestOnly: true });
        Router.register('/dashboard', DashboardPage.render, { protected: true, redirect: '/auth' });
        Router.register('/game', GamePage.render, { protected: true, redirect: '/auth' });

        // Initialize router with auth checker
        Router.init(() => Auth.isAuthenticated());

        // Handle auth changes
        window.addEventListener('authChanged', (e) => {
            if (!e.detail.authenticated) {
                Router.navigate('/');
            }
        });

        console.log('✅ [App] FinGame initialized successfully!');
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    return {
        init
    };
})();
