document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const authBtn = document.getElementById('authBtn');
  const firstNameInput = document.getElementById('firstNameInput');
  const lastNameInput = document.getElementById('lastNameInput');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const confirmPasswordInput = document.getElementById('confirmPasswordInput');
  const togglePassword = document.getElementById('togglePassword');
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  const loginError = document.getElementById('loginError');
  const loginScreen = document.getElementById('loginScreen');
  const app = document.getElementById('app');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const toggleFormLink = document.getElementById('toggleFormLink');
  const logoutBtn = document.getElementById('logoutBtn');
  const mainHeader = document.getElementById('mainHeader');

  let isLoginMode = true;

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  // Toggle password visibility
  function setupPasswordToggle(input, button) {
    button.addEventListener('click', () => {
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
      button.textContent = type === 'password' ? 'Show' : 'Hide';
    });
  }
  setupPasswordToggle(passwordInput, togglePassword);
  setupPasswordToggle(confirmPasswordInput, toggleConfirmPassword);

  // Simulated user database
  let registeredUsers = [
    { firstName: 'Test', lastName: 'User', email: 'user@example.com', password: 'password123' },
    { email: 'test@disney.com', password: 'disneyplus' },
  ];

  // Login validation
  function handleLogin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!isValidEmail(email)) {
      loginError.textContent = 'Please enter a valid email.';
      loginError.style.display = 'block';
      return;
    } else if (password === '') {
      loginError.textContent = 'Please enter your password.';
      loginError.style.display = 'block';
      return;
    }

    loginError.style.display = 'none';

    const user = registeredUsers.find(u => u.email === email);

    if (!user) {
      loginError.textContent = 'This email is not registered. Please sign up.';
      loginError.style.display = 'block';
    } else if (user.password === password) {
      // Successful login
      loginScreen.classList.add('fade-out');
      setTimeout(() => {
        loginScreen.style.display = 'none';
        app.style.display = 'block';
        // Force reflow to ensure transition is applied
        void app.offsetWidth;
        app.classList.add('fade-in');
      }, 1000);
    } else {
      // Incorrect password
      loginError.textContent = 'Incorrect password. Please try again.';
      loginError.style.display = 'block';
    }
  }

  // Sign-up validation
  function handleSignUp() {
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (!firstName) loginError.textContent = 'Please enter your first name.';
    else if (!lastName) loginError.textContent = 'Please enter your last name.';
    else if (!isValidEmail(email)) loginError.textContent = 'Please enter a valid email address.';
    else if (password.length < 6) loginError.textContent = 'Password must be at least 6 characters long.';
    else if (password !== confirmPassword) loginError.textContent = 'Passwords do not match.';
    else if (registeredUsers.some(u => u.email === email)) loginError.textContent = 'An account with this email already exists.';
    else {
      registeredUsers.push({ firstName, lastName, email, password });
      console.log('Updated user database:', registeredUsers);
      alert('Account created successfully! You can now sign in.');
      toggleFormMode(true); // Switch back to login mode
      emailInput.value = email;
      passwordInput.value = '';
      return;
    }
    loginError.style.display = 'block';
  }

  // Main authentication button handler
  authBtn.addEventListener('click', () => {
    isLoginMode ? handleLogin() : handleSignUp();
  });

  // "Forgot password" link
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('To recover your password, please check your email provider, such as Gmail, Outlook, or Yahoo.');
  });

  // Function to toggle between Login and Sign-up modes
  function toggleFormMode(forceLogin = false) {
    isLoginMode = forceLogin ? true : !isLoginMode;
    const signupFields = document.querySelectorAll('.signup-field');

    document.getElementById('formTitle').textContent = isLoginMode ? 'Sign in with your email' : 'Create your account';
    document.getElementById('formSubtitle').textContent = isLoginMode ? 'Log in to Disney+ with your MyDisney account.' : 'Use your email to create a new account.';
    authBtn.textContent = isLoginMode ? 'Continue' : 'Sign Up';
    document.getElementById('toggleFormText').innerHTML = isLoginMode ? `Don't have an account? <a href="#" id="toggleFormLink">Sign up</a>.` : `Already have an account? <a href="#" id="toggleFormLink">Sign in</a>.`;
    forgotPasswordLink.style.display = isLoginMode ? 'block' : 'none';

    signupFields.forEach(field => {
      field.style.display = isLoginMode ? 'none' : 'block';
    });

    document.getElementById('toggleFormLink').addEventListener('click', handleToggleLinkClick);
    loginError.style.display = 'none';
    if (!forceLogin) document.getElementById('authForm').reset();
  }

  function handleToggleLinkClick(e) {
    e.preventDefault();
    e.target.removeEventListener('click', handleToggleLinkClick); // Prevent multiple listeners
    toggleFormMode();
  }

  toggleFormLink.addEventListener('click', handleToggleLinkClick);

  // Logout with confirmation
  logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to sign out?')) {
      app.classList.remove('fade-in');
      app.classList.add('fade-out');
      setTimeout(() => {
        app.style.display = 'none';
        loginScreen.style.display = 'flex';
        loginScreen.classList.remove('fade-out');
        void loginScreen.offsetWidth;
        loginScreen.classList.add('fade-in');
        document.getElementById('authForm').reset();
        if (!isLoginMode) toggleFormMode(true);
      }, 1000);
    }
  });

  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });
});