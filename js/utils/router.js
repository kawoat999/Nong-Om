/**
 * ============================================================
 * ROUTER - Hash-based Navigation System
 * ============================================================
 * 
 * Features:
 * - Hash-based routing (#/page)
 * - Protected routes (requires authentication)
 * - Navigation guards
 * - Page caching
 * 
 * Usage:
 *   Router.navigate('/dashboard')
 *   Router.register('/game', GamePage.render, { protected: true })
 * 
 * ============================================================
 */

const Router = (function() {
    // Private state
    const routes = {};
    let currentRoute = null;
    let onAuthCheck = () => false; // Default: not authenticated

    /**
     * Initialize the router
     * @param {Function} authChecker - Function that returns true if user is authenticated
     */
    function init(authChecker) {
        if (authChecker) {
            onAuthCheck = authChecker;
        }
        
        // Listen for hash changes
        window.addEventListener('hashchange', handleRouteChange);
        
        // Handle initial route
        handleRouteChange();
    }

    /**
     * Register a new route
     * @param {string} path - Route path (e.g., '/dashboard')
     * @param {Function} handler - Function that renders the page (returns HTML string)
     * @param {Object} options - Route options
     * @param {boolean} options.protected - Whether route requires authentication
     * @param {string} options.redirect - Redirect path if condition not met
     */
    function register(path, handler, options = {}) {
        routes[path] = {
            handler,
            protected: options.protected || false,
            redirect: options.redirect || '/auth',
            guestOnly: options.guestOnly || false
        };
    }

    /**
     * Navigate to a specific route
     * @param {string} path - Route path to navigate to
     */
    function navigate(path) {
        window.location.hash = path;
    }

    /**
     * Handle route changes
     */
    function handleRouteChange() {
        // Get current hash, default to home
        let path = window.location.hash.slice(1) || '/';
        
        // Find matching route
        const route = routes[path];
        
        if (!route) {
            // Route not found, redirect to home
            navigate('/');
            return;
        }

        const isAuthenticated = onAuthCheck();

        // Handle protected routes
        if (route.protected && !isAuthenticated) {
            navigate(route.redirect || '/auth');
            return;
        }

        // Handle guest-only routes (like auth page when already logged in)
        if (route.guestOnly && isAuthenticated) {
            navigate('/dashboard');
            return;
        }

        // Render the route
        currentRoute = path;
        const appContainer = document.getElementById('app');
        
        if (appContainer && route.handler) {
            // Add fade-out effect
            appContainer.classList.add('fade-out');
            
            setTimeout(() => {
                appContainer.innerHTML = route.handler();
                appContainer.classList.remove('fade-out');
                appContainer.classList.add('fade-in');
                
                // Remove animation class after animation completes
                setTimeout(() => {
                    appContainer.classList.remove('fade-in');
                }, 300);
                
                // Dispatch custom event for page scripts
                window.dispatchEvent(new CustomEvent('routeChanged', { 
                    detail: { path } 
                }));
            }, 150);
        }
    }

    /**
     * Get current route path
     * @returns {string} Current route path
     */
    function getCurrentRoute() {
        return currentRoute;
    }

    /**
     * Check if current route matches a path
     * @param {string} path - Path to check
     * @returns {boolean}
     */
    function isCurrentRoute(path) {
        return currentRoute === path;
    }

    // Public API
    return {
        init,
        register,
        navigate,
        getCurrentRoute,
        isCurrentRoute
    };
})();

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Router;
}
