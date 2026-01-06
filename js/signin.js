const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const emailError = document.getElementById("userError"); // renamed to make sense
const passError = document.getElementById("passError");
const togglePassword = document.getElementById("togglePassword");

// ✅ Email validation function (same as signup)
function validateEmail(emailValue) {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(?:\.[a-zA-Z]{2,4})?$/;
  return pattern.test(emailValue);
}

// 👁 Show/hide password
togglePassword.addEventListener("click", () => {
  const type = password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  togglePassword.classList.toggle("fa-eye-slash");
});

// ✉️ Real-time validation for email
email.addEventListener("blur", () => {
  const value = email.value.trim();
  if (!value) {
    email.classList.add("error");
    emailError.style.display = "block";
    emailError.textContent = "Please enter your email address.";
  } else if (!validateEmail(value)) {
    email.classList.add("error");
    emailError.style.display = "block";
    emailError.textContent = "Please enter a valid email (e.g. example@gmail.com).";
  } else {
    email.classList.remove("error");
    emailError.style.display = "none";
    emailError.textContent = "";
  }
});

// Clear error when user starts typing again
email.addEventListener("input", () => {
  if (email.classList.contains("error") && email.value.trim() !== "") {
    // Only clear error if user is typing and field has content
    // Don't validate while typing, wait for blur
    const value = email.value.trim();
    if (validateEmail(value)) {
      email.classList.remove("error");
      emailError.style.display = "none";
      emailError.textContent = "";
    }
  }
});

// 🔒 Real-time validation for password
password.addEventListener("input", () => {
  if (password.value.trim() !== "") {
    password.classList.remove("error");
    passError.style.display = "none";
    passError.textContent = "";
  }
});

// 🚀 On form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;

  // Validate email
  const emailValue = email.value.trim();
  if (!emailValue) {
    email.classList.add("error");
    emailError.style.display = "block";
    emailError.textContent = "Please enter your email address.";
    valid = false;
  } else if (!validateEmail(emailValue)) {
    email.classList.add("error");
    emailError.style.display = "block";
    emailError.textContent = "Please enter a valid email (e.g. example@gmail.com).";
    valid = false;
  }

  // Validate password
  if (password.value.trim() === "") {
    password.classList.add("error");
    passError.style.display = "block";
    passError.textContent = "Please enter your password.";
    valid = false;
  } else {
    password.classList.remove("error");
    passError.style.display = "none";
    passError.textContent = "";
  }

  if (valid) {
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    
    // Show loading state
    loginBtn.classList.add('loading');
    btnText.textContent = 'Logging in...';
    
    // Simulate API call delay
    setTimeout(() => {
      // Check user credentials from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === emailValue && u.password === password.value);
      
      if (user) {
        // Store current user session
        localStorage.setItem('currentUser', JSON.stringify({ email: user.email, name: user.name }));
        btnText.textContent = 'Success! Redirecting...';
        
        // Redirect after short delay
        setTimeout(() => {
          window.location.href = 'home.html';
        }, 500);
      } else {
        // Remove loading state
        loginBtn.classList.remove('loading');
        btnText.textContent = 'Login';
        email.classList.add("error");
        password.classList.add("error");
        emailError.style.display = "block";
        emailError.textContent = "Invalid email or password.";
        passError.style.display = "block";
        passError.textContent = "Invalid email or password.";
      }
    }, 800);
  }
});
