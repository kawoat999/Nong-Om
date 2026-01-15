/**
 * ============================================================
 * AUTHENTICATION - User Auth Management
 * ============================================================
 * 
 * Features:
 * - User registration (Sign Up)
 * - User login (Sign In)
 * - Session management (localStorage)
 * - Password validation
 * 
 * Note: This is a frontend-only demo implementation.
 * For production, connect to a real backend auth service.
 * 
 * Storage Structure:
 *   users: Array of { email, password, name, createdAt }
 *   currentUser: { email, name, loginAt }
 * 
 * ============================================================
 */

const Auth = (function () {
    // Storage keys
    const USERS_KEY = 'finGame_users';
    const CURRENT_USER_KEY = 'finGame_currentUser';

    /**
     * Get all registered users
     * @returns {Array} Array of user objects
     */
    function getUsers() {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    }

    /**
     * Save users to storage
     * @param {Array} users - Array of user objects
     */
    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    /**
     * Get currently logged in user
     * @returns {Object|null} Current user object or null
     */
    function getCurrentUser() {
        const user = localStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    function isAuthenticated() {
        return getCurrentUser() !== null;
    }

    /**
     * Register a new user
     * @param {Object} userData - User data
     * @param {string} userData.name - User's name
     * @param {string} userData.email - User's email
     * @param {string} userData.password - User's password
     * @returns {Object} Result object { success, message, user? }
     */
    function signUp({ name, email, password }) {
        // Validation
        if (!name || name.trim().length < 2) {
            return { success: false, message: 'กรุณากรอกชื่อที่ถูกต้อง' };
        }

        if (!email || !isValidEmail(email)) {
            return { success: false, message: 'กรุณากรอกอีเมลที่ถูกต้อง' };
        }

        if (!password || password.length < 6) {
            return { success: false, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' };
        }

        const users = getUsers();

        // Check if email already exists
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, message: 'อีเมลนี้ถูกใช้งานแล้ว' };
        }

        // Create new user
        const newUser = {
            id: generateId(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashPassword(password), // Simple hash for demo
            createdAt: new Date().toISOString()
        };

        // Save user
        users.push(newUser);
        saveUsers(users);

        // Auto login after registration
        const session = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            loginAt: new Date().toISOString()
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session));

        return {
            success: true,
            message: 'ลงทะเบียนสำเร็จ!',
            user: session
        };
    }

    /**
     * Login user
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Object} Result object { success, message, user? }
     */
    function signIn(email, password) {
        if (!email || !password) {
            return { success: false, message: 'กรุณากรอกอีเมลและรหัสผ่าน' };
        }

        const users = getUsers();
        const user = users.find(u =>
            u.email.toLowerCase() === email.toLowerCase().trim()
        );

        if (!user) {
            return { success: false, message: 'ไม่พบบัญชีผู้ใช้นี้' };
        }

        if (user.password !== hashPassword(password)) {
            return { success: false, message: 'รหัสผ่านไม่ถูกต้อง' };
        }

        // Create session
        const session = {
            id: user.id,
            name: user.name,
            email: user.email,
            loginAt: new Date().toISOString()
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session));

        return {
            success: true,
            message: 'เข้าสู่ระบบสำเร็จ!',
            user: session
        };
    }

    /**
     * Logout current user
     */
    function signOut() {
        localStorage.removeItem(CURRENT_USER_KEY);
        window.dispatchEvent(new CustomEvent('authChanged', {
            detail: { authenticated: false }
        }));
    }

    /**
     * Validate email format
     * @param {string} email 
     * @returns {boolean}
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Simple password hash (for demo only!)
     * In production, use proper hashing on backend
     * @param {string} password 
     * @returns {string}
     */
    function hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'hash_' + Math.abs(hash).toString(16);
    }

    /**
     * Generate unique ID
     * @returns {string}
     */
    function generateId() {
        return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Public API
    return {
        signUp,
        signIn,
        signOut,
        isAuthenticated,
        getCurrentUser,
        isValidEmail
    };
})();

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}
