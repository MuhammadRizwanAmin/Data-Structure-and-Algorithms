const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const emailError = document.getElementById("userError"); // renamed to make sense
const passError = document.getElementById("passError");
const togglePassword = document.getElementById("togglePassword");
const demoLoginBtn = document.getElementById("demoLoginBtn");

const DEMO_USER = {
  name: "Demo Student",
  email: "demo@dsa.com",
  password: "Demo1234"
};

function ensureDemoUser() {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const hasDemo = users.some((u) => String(u.email || "").toLowerCase() === DEMO_USER.email);
  if (!hasDemo) {
    users.push({
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      cnic: "00000-0000000-0",
      phone: "0300-0000000",
      dob: "2000-01-01",
      password: DEMO_USER.password
    });
    localStorage.setItem("users", JSON.stringify(users));
  }
}

// ✅ Email validation function (same as signup)
function validateEmail(emailValue) {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(?:\.[a-zA-Z]{2,4})?$/;
  return pattern.test(emailValue);
}

function markFieldError(field, errorEl, message) {
  field.classList.add("input-error");
  errorEl.style.display = "block";
  errorEl.textContent = message;
}

function clearFieldError(field, errorEl) {
  field.classList.remove("input-error");
  errorEl.style.display = "none";
  errorEl.textContent = "";
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
    markFieldError(email, emailError, "Please enter your email address.");
  } else if (!validateEmail(value)) {
    markFieldError(email, emailError, "Please enter a valid email (e.g. example@gmail.com).");
  } else {
    clearFieldError(email, emailError);
  }
});

// Clear error when user starts typing again
email.addEventListener("input", () => {
  if (email.classList.contains("input-error") && email.value.trim() !== "") {
    // Only clear error if user is typing and field has content
    // Don't validate while typing, wait for blur
    const value = email.value.trim();
    if (validateEmail(value)) {
      clearFieldError(email, emailError);
    }
  }
});

// 🔒 Real-time validation for password
password.addEventListener("input", () => {
  if (password.value.trim() !== "") {
    clearFieldError(password, passError);
  }
});

// 🚀 On form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;

  // Validate email
  const emailValue = email.value.trim();
  if (!emailValue) {
    markFieldError(email, emailError, "Please enter your email address.");
    valid = false;
  } else if (!validateEmail(emailValue)) {
    markFieldError(email, emailError, "Please enter a valid email (e.g. example@gmail.com).");
    valid = false;
  }

  // Validate password
  if (password.value.trim() === "") {
    markFieldError(password, passError, "Please enter your password.");
    valid = false;
  } else {
    clearFieldError(password, passError);
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
      const normalizedEmail = emailValue.toLowerCase();
      const user = users.find(
        u => String(u.email || "").toLowerCase() === normalizedEmail && u.password === password.value
      );
      
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
        markFieldError(email, emailError, "Invalid email or password.");
        markFieldError(password, passError, "Invalid email or password.");
      }
    }, 800);
  }
});

if (demoLoginBtn) {
  demoLoginBtn.addEventListener("click", () => {
    ensureDemoUser();
    email.value = DEMO_USER.email;
    password.value = DEMO_USER.password;
    clearFieldError(email, emailError);
    clearFieldError(password, passError);
    form.requestSubmit();
  });
}

ensureDemoUser();
