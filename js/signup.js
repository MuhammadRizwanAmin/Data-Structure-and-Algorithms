const form = document.getElementById("signupForm");
const fields = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  cnic: document.getElementById("cnic"),
  phone: document.getElementById("phone"),
  dob: document.getElementById("dob"),
  password: document.getElementById("password"),
  confirmPassword: document.getElementById("confirmPassword")
};

// Show/Hide Password
const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

togglePassword.addEventListener("click", () => {
  const type = fields.password.type === "password" ? "text" : "password";
  fields.password.type = type;
  togglePassword.classList.toggle("fa-eye-slash");
});

toggleConfirmPassword.addEventListener("click", () => {
  const type = fields.confirmPassword.type === "password" ? "text" : "password";
  fields.confirmPassword.type = type;
  toggleConfirmPassword.classList.toggle("fa-eye-slash");
});

// ========================
// Email Validation
// ========================
function validateEmail(email) {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(?:\.[a-zA-Z]{2,4})?$/;
  return pattern.test(email);
}

// ========================
// Auto-format CNIC
// ========================
fields.cnic.addEventListener("input", function () {
  let value = fields.cnic.value.replace(/[^0-9]/g, "");

  if (value.length > 13) value = value.slice(0, 13);

  let formatted = value;
  if (value.length > 5) {
    formatted = value.substring(0, 5) + "-" + value.substring(5);
  }
  if (value.length > 12) {
    formatted = value.substring(0, 5) + "-" +
                value.substring(5, 12) + "-" +
                value.substring(12);
  }

  fields.cnic.value = formatted;
});

// CNIC Validation (XXXXX-XXXXXXX-X)
function validateCNIC(cnic) {
  const pattern = /^\d{5}-\d{7}-\d{1}$/;
  return pattern.test(cnic);
}

// ========================
// Auto-format Phone
// ========================
fields.phone.addEventListener("input", function () {
  let value = fields.phone.value.replace(/[^0-9]/g, "");

  if (value.length > 11) value = value.slice(0, 11);

  let formatted = value;
  if (value.length > 4) {
    formatted = value.substring(0, 4) + "-" + value.substring(4);
  }

  fields.phone.value = formatted;
});

// Phone Validation (03XX-XXXXXXX)
function validatePhone(phone) {
  const pattern = /^03\d{2}-\d{7}$/;
  return pattern.test(phone);
}

// ========================
// Password Validation
// ========================
function validatePassword(password) {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return pattern.test(password);
}

// ========================
// Error Handlers
// ========================
function showError(field, message) {
  const error = field.parentElement.querySelector(".error");
  if (error) {
    error.textContent = message;
    error.style.display = "block";
    field.classList.add("input-error");
  }
}

function clearError(field) {
  const error = field.parentElement.querySelector(".error");
  if (error) {
    error.textContent = "";
    error.style.display = "none";
    field.classList.remove("input-error");
  }
}

// ========================
// Real-time validation
// ========================
Object.keys(fields).forEach(key => {
  const field = fields[key];
  if (field) {
    field.addEventListener("blur", () => {
      validateField(key);
    });
    
    field.addEventListener("input", () => {
      if (field.classList.contains("input-error")) {
        validateField(key);
      }
    });
  }
});

function validateField(fieldName) {
  const field = fields[fieldName];
  if (!field) return;
  
  switch(fieldName) {
    case 'name':
      if (!field.value.trim()) {
        showError(field, "Please enter your name");
      } else {
        clearError(field);
      }
      break;
      
    case 'email':
      if (!field.value.trim()) {
        showError(field, "Please enter your email address");
      } else if (!validateEmail(field.value.trim())) {
        showError(field, "Invalid email address");
      } else {
        clearError(field);
      }
      break;
      
    case 'cnic':
      if (!field.value.trim()) {
        showError(field, "Please enter your CNIC");
      } else if (!validateCNIC(field.value.trim())) {
        showError(field, "CNIC must be XXXXX-XXXXXXX-X");
      } else {
        clearError(field);
      }
      break;
      
    case 'phone':
      if (!field.value.trim()) {
        showError(field, "Please enter your phone number");
      } else if (!validatePhone(field.value.trim())) {
        showError(field, "Phone must be 03XX-XXXXXXX");
      } else {
        clearError(field);
      }
      break;
      
    case 'dob':
      if (!field.value) {
        showError(field, "Please enter your date of birth");
      } else {
        const dobValue = new Date(field.value);
        const today = new Date();
        let age = today.getFullYear() - dobValue.getFullYear();
        const m = today.getMonth() - dobValue.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dobValue.getDate())) {
          age--;
        }
        if (age < 18) {
          showError(field, "You must be at least 18 years old");
        } else {
          clearError(field);
        }
      }
      break;
      
    case 'password':
      if (!field.value.trim()) {
        showError(field, "Please enter a password");
      } else if (!validatePassword(field.value.trim())) {
        showError(field, "Password must be at least 8 characters with uppercase, lowercase, and number");
      } else {
        clearError(field);
      }
      break;
      
    case 'confirmPassword':
      if (!field.value.trim()) {
        showError(field, "Please confirm your password");
      } else if (field.value !== fields.password.value) {
        showError(field, "Passwords do not match");
      } else {
        clearError(field);
      }
      break;
  }
}

// ========================
// Validate All Fields
// ========================
function validateAll() {
  let valid = true;

  if (!fields.name.value.trim()) {
    showError(fields.name, "Please enter your name");
    valid = false;
  } else clearError(fields.name);

  if (!fields.email.value.trim()) {
    showError(fields.email, "Please enter your email address");
    valid = false;
  } else if (!validateEmail(fields.email.value.trim())) {
    showError(fields.email, "Invalid email address");
    valid = false;
  } else clearError(fields.email);

  if (!fields.cnic.value.trim()) {
    showError(fields.cnic, "Please enter your CNIC");
    valid = false;
  } else if (!validateCNIC(fields.cnic.value.trim())) {
    showError(fields.cnic, "CNIC must be XXXXX-XXXXXXX-X");
    valid = false;
  } else clearError(fields.cnic);

  if (!fields.phone.value.trim()) {
    showError(fields.phone, "Please enter your phone number");
    valid = false;
  } else if (!validatePhone(fields.phone.value.trim())) {
    showError(fields.phone, "Phone must be 03XX-XXXXXXX");
    valid = false;
  } else clearError(fields.phone);

  const dobValue = new Date(fields.dob.value);
  const today = new Date();
  let age = today.getFullYear() - dobValue.getFullYear();
  const m = today.getMonth() - dobValue.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dobValue.getDate())) {
    age--;
  }

  if (!fields.dob.value) {
    showError(fields.dob, "Please enter your date of birth");
    valid = false;
  } else if (age < 18) {
    showError(fields.dob, "You must be at least 18 years old");
    valid = false;
  } else clearError(fields.dob);

  if (!fields.password.value.trim()) {
    showError(fields.password, "Please enter a password");
    valid = false;
  } else if (!validatePassword(fields.password.value.trim())) {
    showError(fields.password, "Password must be at least 8 characters with uppercase, lowercase, and number");
    valid = false;
  } else clearError(fields.password);

  if (!fields.confirmPassword.value.trim()) {
    showError(fields.confirmPassword, "Please confirm your password");
    valid = false;
  } else if (fields.password.value !== fields.confirmPassword.value) {
    showError(fields.confirmPassword, "Passwords do not match");
    valid = false;
  } else clearError(fields.confirmPassword);

  return valid;
}

// ========================
// Submit Event
// ========================
form.addEventListener("submit", function(e) {
  e.preventDefault();

  if (validateAll()) {
    const registerBtn = document.getElementById('registerBtn');
    const btnText = registerBtn.querySelector('.btn-text');
    
    // Show loading state
    registerBtn.classList.add('loading');
    btnText.textContent = 'Registering...';
    
    // Simulate API call delay
    setTimeout(() => {
      // Store user data in localStorage
      const userData = {
        name: fields.name.value.trim(),
        email: fields.email.value.trim().toLowerCase(),
        cnic: fields.cnic.value.trim(),
        phone: fields.phone.value.trim(),
        dob: fields.dob.value,
        password: fields.password.value // In production, this should be hashed
      };

      // Check if email already exists
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      if (existingUsers.find(u => String(u.email || '').toLowerCase() === userData.email)) {
        // Remove loading state
        registerBtn.classList.remove('loading');
        btnText.textContent = 'Register';
        showError(fields.email, "Email already registered");
        return;
      }

      // Add new user
      existingUsers.push(userData);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      btnText.textContent = 'Success! Redirecting...';
      
      // Redirect after short delay
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    }, 800);
  }
});
