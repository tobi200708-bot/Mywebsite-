// =====================================
// FIREBASE CONFIGURATION
// =====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "my-website-a67e5.firebaseapp.com",
  projectId: "my-website-a67e5",
  storageBucket: "my-website-a67e5.firebasestorage.app",
  messagingSenderId: "551788580994",
  appId: "1:551788580994:web:d8ecda1cf7500e7002649b",
  measurementId: "G-L9ZVD02NCE"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// =====================================
// HTML ELEMENTS
// =====================================

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");
const logoutButton = document.getElementById("logoutButton");

const forgotPassword = document.getElementById("forgotPassword");
const showPassword = document.getElementById("showPassword");
const statusMessage = document.getElementById("statusMessage");

// =====================================
// MESSAGE FUNCTION
// =====================================

function showMessage(message, success = false) {
  if (statusMessage) {
    statusMessage.textContent = message;
    statusMessage.style.color =
      success ? "#22c55e" : "#ff7185";
  } else {
    alert(message);
  }
}

// =====================================
// ERROR HANDLING
// =====================================

function handleError(error) {
  console.error("Firebase error:", error.code);

  const errors = {
    "auth/invalid-email":
      "Please enter a valid email address.",

    "auth/invalid-credential":
      "Incorrect email or password.",

    "auth/email-already-in-use":
      "Email is already registered.",

    "auth/weak-password":
      "Password must contain at least 6 characters.",

    "auth/too-many-requests":
      "Too many attempts. Please try later.",

    "auth/network-request-failed":
      "Check your internet connection.",

    "auth/invalid-api-key":
      "Invalid API key. Check Firebase configuration.",

    "auth/operation-not-allowed":
      "Enable Email/Password in Firebase Authentication."
  };

  showMessage(
    errors[error.code] || "Error: " + error.message
  );
}

// =====================================
// LOGIN
// =====================================

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput?.value.trim();
    const password = passwordInput?.value;

    if (!email || !password) {
      showMessage("Enter email and password.");
      return;
    }

    try {
      if (loginButton) loginButton.disabled = true;

      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      showMessage("Login successful!", true);
      console.log("Logged in:", result.user.email);

      // Optional dashboard redirect:
      // window.location.href = "dashboard.html";

    } catch (error) {
      handleError(error);
    } finally {
      if (loginButton) loginButton.disabled = false;
    }
  });
}

// =====================================
// SIGN UP
// =====================================

if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput?.value.trim();
    const password = passwordInput?.value;

    if (!email || !password) {
      showMessage("Enter email and password.");
      return;
    }

    if (password.length < 6) {
      showMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      if (signupButton) signupButton.disabled = true;

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      showMessage("Account created successfully!", true);
      console.log("Registered:", result.user.email);

    } catch (error) {
      handleError(error);
    } finally {
      if (signupButton) signupButton.disabled = false;
    }
  });
}

// =====================================
// SHOW / HIDE PASSWORD
// =====================================

if (showPassword && passwordInput) {
  showPassword.addEventListener("click", () => {
    const hidden = passwordInput.type === "password";

    passwordInput.type = hidden ? "text" : "password";
    showPassword.textContent = hidden ? "Hide" : "Show";
  });
}

// =====================================
// FORGOT PASSWORD
// =====================================

if (forgotPassword) {
  forgotPassword.addEventListener("click", async (event) => {
    event.preventDefault();

    const email = emailInput?.value.trim();

    if (!email) {
      showMessage("Enter your email address first.");
      emailInput?.focus();
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showMessage("Password reset email sent!", true);
    } catch (error) {
      handleError(error);
    }
  });
}

// =====================================
// LOGOUT
// =====================================

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    try {
      await signOut(auth);
      showMessage("Logged out successfully.", true);
    } catch (error) {
      handleError(error);
    }
  });
}

// =====================================
// AUTHENTICATION STATUS
// =====================================

onAuthStateChanged(auth, (user) => {
  const userEmail = document.getElementById("userEmail");

  if (user) {
    console.log("Authenticated:", user.email);

    if (userEmail) {
      userEmail.textContent = user.email;
    }
  } else {
    console.log("No user logged in.");

    if (userEmail) {
      userEmail.textContent = "Not logged in";
    }
  }
});
