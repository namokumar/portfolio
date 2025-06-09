// Hamburger menu functionality
window.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const body = document.body;
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            body.classList.toggle('menu-open');
        });
    }
    // Optional: Close menu when a nav link is clicked
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (body.classList.contains('menu-open')) {
                body.classList.remove('menu-open');
            }
        });
    });

    // Check authentication status and update UI accordingly
    checkAuthStatus();
    
    // Create mobile menu auth buttons
    updateMobileMenu();
});

/**
 * Check authentication status and update UI
 */
function checkAuthStatus() {
    // Try to load the auth module if it exists
    if (localStorage.getItem('auth_token')) {
        addProtectedVideosLink();
        addLogoutButton();
    } else {
        addLoginButton();
        addSignupButton();
    }
}

/**
 * Add protected videos link to navigation
 */
function addProtectedVideosLink() {
    const navUl = document.querySelector('nav ul');
    if (navUl) {
        // Check if the link already exists
        const existingLink = navUl.querySelector('a[href="protected-videos.html"]');
        if (!existingLink) {
            // Create new list item with link
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = 'protected-videos.html';
            a.className = 'hover:text-gray-600 transition-colors';
            a.textContent = 'Protected Videos';
            li.appendChild(a);
            
            // Insert before the last item (assuming last item might be login/logout)
            navUl.insertBefore(li, navUl.lastElementChild || null);
        }
    }
}

/**
 * Add login button to navigation
 */
function addLoginButton() {
    const navUl = document.querySelector('nav ul');
    if (navUl) {
        // Check if the link already exists
        const existingLink = navUl.querySelector('a[href="login.html"]');
        if (!existingLink) {
            // Create new list item with link
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = 'login.html';
            a.className = 'text-purple-600 hover:text-purple-800 transition-colors';
            a.textContent = 'Login';
            li.appendChild(a);
            
            // Add to the end of the navigation
            navUl.appendChild(li);
        }
    }
}

/**
 * Add signup button to navigation
 */
function addSignupButton() {
    const navUl = document.querySelector('nav ul');
    if (navUl) {
        // Check if the link already exists
        const existingLink = navUl.querySelector('a[href="signup.html"]');
        if (!existingLink) {
            // Create new list item with link
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = 'signup.html';
            a.className = 'bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors';
            a.textContent = 'Sign Up';
            li.appendChild(a);
            
            // Add to the end of the navigation
            navUl.appendChild(li);
        }
    }
}

/**
 * Add logout button to navigation
 */
function addLogoutButton() {
    const navUl = document.querySelector('nav ul');
    if (navUl) {
        // Check if the link already exists
        const existingLink = navUl.querySelector('#logout-btn');
        if (!existingLink) {
            // Create new list item with link
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.id = 'logout-btn';
            a.className = 'text-purple-600 hover:text-purple-800 transition-colors';
            a.textContent = 'Logout';
            
            // Add logout functionality
            a.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                localStorage.removeItem('token_expiry');
                sessionStorage.removeItem('auth_token');
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('token_expiry');
                window.location.href = '/login.html';
            });
            
            li.appendChild(a);
            
            // Replace login button if it exists, otherwise add to the end
            const loginLink = navUl.querySelector('a[href="login.html"]');
            if (loginLink) {
                navUl.replaceChild(li, loginLink.parentElement);
            } else {
                navUl.appendChild(li);
            }
        }
    }
}

// Try to load the auth module if it exists
try {
    import('./auth.js').then(module => {
        window.auth = module.default;
    }).catch(err => {
        console.warn('Auth module not loaded:', err);
    });
} catch (e) {
    console.warn('ES modules not supported or auth.js not found');
}

/**
 * Update mobile menu with authentication links
 */
function updateMobileMenu() {
    // When the menu is shown, add auth links if they don't exist
    document.addEventListener('click', function(e) {
        if (document.body.classList.contains('menu-open')) {
            const mobileMenu = document.querySelector('header nav .hidden.md\\:block');
            if (mobileMenu) {
                const mobileNavUl = mobileMenu.querySelector('ul');
                if (mobileNavUl) {
                    // Check for auth status
                    const isAuthenticated = localStorage.getItem('auth_token');
                    
                    // Remove any existing auth links in mobile menu
                    const existingAuthLinks = mobileNavUl.querySelectorAll('.auth-link');
                    existingAuthLinks.forEach(link => link.remove());
                    
                    if (isAuthenticated) {
                        // Add protected videos link
                        const protectedLi = document.createElement('li');
                        protectedLi.className = 'auth-link';
                        const protectedA = document.createElement('a');
                        protectedA.href = 'protected-videos.html';
                        protectedA.className = 'block py-2 hover:text-purple-600 transition-colors';
                        protectedA.textContent = 'Protected Videos';
                        protectedLi.appendChild(protectedA);
                        mobileNavUl.appendChild(protectedLi);
                        
                        // Add logout link
                        const logoutLi = document.createElement('li');
                        logoutLi.className = 'auth-link';
                        const logoutA = document.createElement('a');
                        logoutA.href = '#';
                        logoutA.className = 'block py-2 text-purple-600 hover:text-purple-800 transition-colors';
                        logoutA.textContent = 'Logout';
                        logoutA.addEventListener('click', (e) => {
                            e.preventDefault();
                            localStorage.removeItem('auth_token');
                            localStorage.removeItem('user');
                            localStorage.removeItem('token_expiry');
                            sessionStorage.removeItem('auth_token');
                            sessionStorage.removeItem('user');
                            sessionStorage.removeItem('token_expiry');
                            window.location.href = '/login.html';
                        });
                        logoutLi.appendChild(logoutA);
                        mobileNavUl.appendChild(logoutLi);
                    } else {
                        // Add login link
                        const loginLi = document.createElement('li');
                        loginLi.className = 'auth-link';
                        const loginA = document.createElement('a');
                        loginA.href = 'login.html';
                        loginA.className = 'block py-2 text-purple-600 hover:text-purple-800 transition-colors';
                        loginA.textContent = 'Login';
                        loginLi.appendChild(loginA);
                        mobileNavUl.appendChild(loginLi);
                        
                        // Add signup link
                        const signupLi = document.createElement('li');
                        signupLi.className = 'auth-link';
                        const signupA = document.createElement('a');
                        signupA.href = 'signup.html';
                        signupA.className = 'block py-2 bg-purple-600 text-white px-4 rounded-lg hover:bg-purple-700 transition-colors';
                        signupA.textContent = 'Sign Up';
                        signupLi.appendChild(signupA);
                        mobileNavUl.appendChild(signupLi);
                    }
                }
            }
        }
    });
}
