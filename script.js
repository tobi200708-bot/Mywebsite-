
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// Replace with your Firebase project configuration.
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXownoNcO7vSrN5rnoDiii62uWqeb90S4",
  authDomain: "my-website-a67e5.firebaseapp.com",
  projectId: "my-website-a67e5",
  storageBucket: "my-website-a67e5.firebasestorage.app",
  messagingSenderId: "551788580994",
  appId: "1:551788580994:web:d050ba934b3a479202649b",
  measurementId: "G-9MMXR1GL87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const authSection = document.getElementById("authSection");
const dashboard = document.getElementById("dashboard");
const authForm = document.getElementById("authForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const submitButton = document.getElementById("submitButton");
const showPassword = document.getElementById("showPassword");

const forgotButton = document.getElementById("forgotButton");
const forgotRow = document.getElementById("forgotRow");

const message = document.getElementById("message");
const dashboardMessage =
  document.getElementById("dashboardMessage");

let mode = "login";

function showMessage(text, success = false) {
  message.textContent = text;
  message.style.color = success ? "#4ade80" : "#ff7582";
}

function getErrorMessage(error) {
  const errors = {
    "auth/email-already-in-use":
      "This email is already registered.",
    "auth/invalid-email":
      "Please enter a valid email address.",
    "auth/weak-password":
      "Please choose a stronger password.",
    "auth/invalid-credential":
      "Incorrect email or password.",
    "auth/user-not-found":
      "No account was found for this email.",
    "auth/wrong-password":
      "Incorrect password.",
    "auth/too-many-requests":
      "Too many attempts. Try again later.",
    "auth/network-request-failed":
      "Check your internet connection.",
    "auth/operation-not-allowed":
      "Enable Email/Password in Firebase Authentication.",
    "auth/unauthorized-domain":
      "Authorize your website domain in Firebase.",
    "auth/invalid-api-key":
      "Check your Firebase API key."
  };

  return errors[error.code] ||
    "An error occurred: " + error.code;
}

// Switch between Login and Sign Up.
function setMode(newMode) {
  mode = newMode;
  const isSignup = mode === "signup";

  pageTitle.textContent =
    isSignup ? "Create Account" : "Welcome Back";

  pageSubtitle.textContent =
    isSignup
      ? "Create your new account"
      : "Sign in to your account";

  submitButton.textContent =
    isSignup ? "Create Account" : "Login";

  passwordInput.autocomplete =
    isSignup ? "new-password" : "current-password";

  loginTab.classList.toggle("active", !isSignup);
  signupTab.classList.toggle("active", isSignup);
  forgotRow.classList.toggle("hidden", isSignup);

  showMessage("");
}

loginTab.addEventListener("click", () => setMode("login"));
signupTab.addEventListener("click", () => setMode("signup"));

// Show or hide password.
showPassword.addEventListener("click", () => {
  const hidden = passwordInput.type === "password";

  passwordInput.type = hidden ? "text" : "password";
  showPassword.textContent = hidden ? "Hide" : "Show";

  showPassword.setAttribute(
    "aria-label",
    hidden ? "Hide password" : "Show password"
  );
});

// Register or log in.
authForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  submitButton.disabled = true;
  showMessage("Please wait...", true);

  try {
    if (mode === "signup") {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      showMessage("Account created successfully!", true);
    } else {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      showMessage("Login successful!", true);
    }
  } catch (error) {
    showMessage(getErrorMessage(error));
  } finally {
    submitButton.disabled = false;
  }
});

// Send password reset email.
forgotButton.addEventListener("click", async () => {
  const email = emailInput.value.trim();

  if (!email) {
    showMessage("Enter your email address first.");
    emailInput.focus();
    return;
  }

  forgotButton.disabled = true;

  try {
    await sendPasswordResetEmail(auth, email);

    showMessage(
      "If the account is eligible, a password reset email will be sent.",
      true
    );
  } catch (error) {
    showMessage(getErrorMessage(error));
  } finally {
    forgotButton.disabled = false;
  }
});

// Log out.
document.getElementById("logoutButton")
  .addEventListener("click", async function () {
    this.disabled = true;
    dashboardMessage.textContent = "";

    try {
      await signOut(auth);
    } catch (error) {
      dashboardMessage.style.color = "#ff7582";
      dashboardMessage.textContent = getErrorMessage(error);
    } finally {
      this.disabled = false;
    }
  });

// Check authentication state.
onAuthStateChanged(auth, (user) => {
  if (user) {
    authSection.style.display = "none";
    dashboard.style.display = "block";

    document.getElementById("userEmail").textContent =
      user.email || "Email unavailable";
  } else {
    dashboard.style.display = "none";
    authSection.style.display = "block";
  }
});
