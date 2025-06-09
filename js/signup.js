/**
 * Signup form validation and password strength meter
 */
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const signupForm = document.getElementById('signup-form');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const passwordMatch = document.getElementById('password-match');
  const strengthMeter = document.getElementById('strength-meter');
  const errorMessage = document.getElementById('error-message');
  
  // Password requirement checks
  const lengthCheck = document.getElementById('length-check');
  const uppercaseCheck = document.getElementById('uppercase-check');
  const lowercaseCheck = document.getElementById('lowercase-check');
  const numberCheck = document.getElementById('number-check');
  const specialCheck = document.getElementById('special-check');
  
  // Toggle password visibility
  const togglePassword = document.getElementById('toggle-password');
  if (togglePassword) {
    togglePassword.addEventListener('click', () => {
      const icon = togglePassword.querySelector('i');
      
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  }
  
  // Password strength validation
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      const password = passwordInput.value;
      
      // Check requirements
      const hasLength = password.length >= 8;
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      // Update indicators
      updateCheckIndicator(lengthCheck, hasLength);
      updateCheckIndicator(uppercaseCheck, hasUppercase);
      updateCheckIndicator(lowercaseCheck, hasLowercase);
      updateCheckIndicator(numberCheck, hasNumber);
      updateCheckIndicator(specialCheck, hasSpecial);
      
      // Calculate strength percentage
      const checks = [hasLength, hasUppercase, hasLowercase, hasNumber, hasSpecial];
      const strengthPercentage = (checks.filter(Boolean).length / checks.length) * 100;
      
      // Update strength meter
      strengthMeter.style.width = `${strengthPercentage}%`;
      
      // Update meter color based on strength
      if (strengthPercentage < 40) {
        strengthMeter.classList.remove('bg-yellow-500', 'bg-green-500');
        strengthMeter.classList.add('bg-red-500');
      } else if (strengthPercentage < 80) {
        strengthMeter.classList.remove('bg-red-500', 'bg-green-500');
        strengthMeter.classList.add('bg-yellow-500');
      } else {
        strengthMeter.classList.remove('bg-red-500', 'bg-yellow-500');
        strengthMeter.classList.add('bg-green-500');
      }
    });
  }
  
  // Password match validation
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', () => {
      if (passwordInput.value !== confirmPasswordInput.value) {
        passwordMatch.classList.remove('hidden');
      } else {
        passwordMatch.classList.add('hidden');
      }
    });
  }
  
  // Form submission
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get form data
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      const terms = document.getElementById('terms').checked;
      
      // Validate passwords match
      if (password !== confirmPassword) {
        passwordMatch.classList.remove('hidden');
        return;
      }
      
      // Validate terms acceptance
      if (!terms) {
        errorMessage.textContent = 'You must accept the Terms of Service and Privacy Policy';
        errorMessage.classList.remove('hidden');
        return;
      }
      
      try {
        // Use actual API call for production
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.errors?.[0]?.msg || 'Registration failed');
        }
        
        // Redirect to login page on success
        window.location.href = '/login.html?registered=true';
      } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
      }
    });
  }
});

// Helper to update check indicators
function updateCheckIndicator(element, isValid) {
  if (!element) return;
  
  const icon = element.querySelector('i');
  
  if (isValid) {
    icon.classList.remove('far', 'fa-circle');
    icon.classList.add('fas', 'fa-check-circle', 'text-green-500');
    element.classList.add('text-green-500');
    element.classList.remove('text-gray-500');
  } else {
    icon.classList.remove('fas', 'fa-check-circle', 'text-green-500');
    icon.classList.add('far', 'fa-circle');
    element.classList.remove('text-green-500');
    element.classList.add('text-gray-500');
  }
}

// Mock signup function for demo purposes - remove in production
async function mockSignup(userData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Example validation - email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        reject(new Error('Invalid email format'));
        return;
      }
      
      // Simulate successful registration
      resolve({ success: true, message: 'Registration successful' });
    }, 1000); // Simulate API delay
  });
}

// For module support
export default {
  validatePassword(password) {
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      hasLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecial,
      isValid: hasLength && hasUppercase && hasLowercase && hasNumber && hasSpecial
    };
  }
};