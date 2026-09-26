alert("SKILLLINK SCRIPT LOADED");
// ===============================
// SKILLINK - SUPABASE AUTH SYSTEM
// ===============================

// 
const SUPABASE_URL = "https://acobkbtjgurifqynotqz.supabase.co";
// 
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_BIl-VeFFgUtHzEqBZFEa9A_SUZIz7yn";

const { createClient } = window.supabase;

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
document.addEventListener("DOMContentLoaded", () => {
  const signupButton = document.querySelector(".signup-button");

  if (signupButton) {
    signupButton.addEventListener("click", () => {
      alert("SIGN UP BUTTON WORKING");
    });
  } else {
    alert("SIGN UP BUTTON NOT FOUND");
  }
});

// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded", async () => {

  setupAuthButtons();
  setupCourseButtons();
  setupPackageButtons();
  setupProjectButtons();
  setupSmoothScroll();
  setupScrollReveal();

  await checkCurrentUser();

  supabase.auth.onAuthStateChange(async (event, session) => {

    if (session?.user) {
      await ensureProfile(session.user);
      updateAuthUI(session.user);
    } else {
      updateAuthUI(null);
    }

  });

  console.log("SkillLink loaded successfully.");
});


// ===============================
// AUTH BUTTONS
// ===============================

function setupAuthButtons() {

  const loginButton = document.querySelector(".login-button");
  const signupButton = document.querySelector(".signup-button");

  if (loginButton) {
    loginButton.addEventListener("click", () => {
      openAuthModal("login");
    });
  }

  if (signupButton) {
    signupButton.addEventListener("click", () => {
      openAuthModal("signup");
    });
  }
}


// ===============================
// AUTH MODAL
// ===============================

function openAuthModal(type = "login") {

  const oldModal = document.getElementById("skilllink-auth-modal");

  if (oldModal) {
    oldModal.remove();
  }

  const isSignup = type === "signup";

  const modal = document.createElement("div");

  modal.id = "skilllink-auth-modal";

  modal.innerHTML = `
    <div class="skilllink-auth-overlay">

      <div class="skilllink-auth-box">

        <button class="skilllink-close" id="auth-close">
          ×
        </button>

        <div class="skilllink-auth-logo">
          🚀 SkillLink
        </div>

        <h2>
          ${isSignup ? "Create your account" : "Welcome back"}
        </h2>

        <p class="skilllink-auth-subtitle">
          ${
            isSignup
              ? "Start your SkillLink journey today."
              : "Login to continue to SkillLink."
          }
        </p>

        ${
          isSignup
            ? `
              <input
                id="auth-fullname"
                class="skilllink-auth-input"
                type="text"
                placeholder="Full Name"
              />

              <input
                id="auth-username"
                class="skilllink-auth-input"
                type="text"
                placeholder="Username"
              />
            `
            : ""
        }

        <input
          id="auth-email"
          class="skilllink-auth-input"
          type="email"
          placeholder="Email Address"
        />

        <input
          id="auth-password"
          class="skilllink-auth-input"
          type="password"
          placeholder="Password"
        />

        ${
          isSignup
            ? `
              <input
                id="auth-password-confirm"
                class="skilllink-auth-input"
                type="password"
                placeholder="Confirm Password"
              />
            `
            : ""
        }

        <button
          id="auth-submit"
          class="skilllink-auth-submit"
        >
          ${isSignup ? "Create Account" : "Login"}
        </button>

        <div
          id="auth-message"
          class="skilllink-auth-message"
        ></div>

        <div class="skilllink-auth-switch">

          ${
            isSignup
              ? `
                Already have an account?
                <button id="switch-login">
                  Login
                </button>
              `
              : `
                Don't have an account?
                <button id="switch-signup">
                  Create Account
                </button>
              `
          }

        </div>

      </div>

    </div>
  `;

  document.body.appendChild(modal);

  addAuthStyles();

  document
    .getElementById("auth-close")
    .addEventListener("click", closeAuthModal);

  document
    .querySelector(".skilllink-auth-overlay")
    .addEventListener("click", (event) => {

      if (event.target.classList.contains("skilllink-auth-overlay")) {
        closeAuthModal();
      }

    });

  document
    .getElementById("auth-submit")
    .addEventListener("click", () => {

      if (isSignup) {
        signupUser();
      } else {
        loginUser();
      }

    });

  const switchButton = document.querySelector(
    isSignup ? "#switch-login" : "#switch-signup"
  );

  if (switchButton) {

    switchButton.addEventListener("click", () => {

      openAuthModal(
        isSignup ? "login" : "signup"
      );

    });

  }
}


// ===============================
// SIGNUP
// ===============================

async function signupUser() {

  const fullName =
    document.getElementById("auth-fullname")?.value.trim();

  const username =
    document.getElementById("auth-username")?.value.trim();

  const email =
    document.getElementById("auth-email")?.value.trim();

  const password =
    document.getElementById("auth-password")?.value;

  const confirmPassword =
    document.getElementById("auth-password-confirm")?.value;

  if (!fullName || !username || !email || !password) {

    showAuthMessage(
      "Please fill all required fields.",
      "error"
    );

    return;
  }

  if (password.length < 6) {

    showAuthMessage(
      "Password must be at least 6 characters.",
      "error"
    );

    return;
  }

  if (password !== confirmPassword) {

    showAuthMessage(
      "Passwords do not match.",
      "error"
    );

    return;
  }

  setAuthLoading(true);

  const { data, error } =
    await supabase.auth.signUp({

      email: email,

      password: password,

      options: {
        data: {
          full_name: fullName,
          username: username
        }
      }

    });

  setAuthLoading(false);

  if (error) {

    showAuthMessage(
      error.message,
      "error"
    );

    return;
  }

  if (data.user) {

    // If email confirmation is disabled,
    // session will already exist.
    if (data.session) {

      await ensureProfile(data.user);

      showAuthMessage(
        "Account created successfully!",
        "success"
      );

      setTimeout(() => {
        closeAuthModal();
      }, 1200);

    } else {

      showAuthMessage(
        "Account created. Check your email for verification, then login.",
        "success"
      );

    }

  }

}


// ===============================
// LOGIN
// ===============================

async function loginUser() {

  const email =
    document.getElementById("auth-email")?.value.trim();

  const password =
    document.getElementById("auth-password")?.value;

  if (!email || !password) {

    showAuthMessage(
      "Enter email and password.",
      "error"
    );

    return;
  }

  setAuthLoading(true);

  const { data, error } =
    await supabase.auth.signInWithPassword({

      email: email,
      password: password

    });

  setAuthLoading(false);

  if (error) {

    showAuthMessage(
      error.message,
      "error"
    );

    return;
  }

  if (data.user) {

    await ensureProfile(data.user);

    showAuthMessage(
      "Login successful!",
      "success"
    );

    setTimeout(() => {
      closeAuthModal();
    }, 1000);

  }

}


// ===============================
// LOGOUT
// ===============================

async function logoutUser() {

  const { error } =
    await supabase.auth.signOut();

  if (error) {

    showMessage(
      "Logout failed: " + error.message
    );

    return;
  }

  showMessage(
    "Logged out successfully."
  );

}


// ===============================
// CHECK CURRENT USER
// ===============================

async function checkCurrentUser() {

  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();

  if (user) {

    await ensureProfile(user);

    updateAuthUI(user);

  } else {

    updateAuthUI(null);

  }

}


// ===============================
// CREATE PARTNER PROFILE
// ===============================

async function ensureProfile(user) {

  if (!user) {
    return;
  }

  const fullName =
    user.user_metadata?.full_name || "";

  const username =
    user.user_metadata?.username || "";

  // Try to create profile.
  // If profile already exists, duplicate error is ignored.
  const { error } =
    await supabase
      .from("profiles")
      .insert({

        id: user.id,

        full_name: fullName,

        username: username

      });

  if (error) {

    // 23505 = duplicate record.
    // This is normal when profile already exists.
    if (error.code !== "23505") {

      console.log(
        "Profile setup:",
        error.message
      );

    }

  }

}


// ===============================
// UPDATE NAVBAR AFTER LOGIN
// ===============================

function updateAuthUI(user) {

  const loginButton =
    document.querySelector(".login-button");

  const signupButton =
    document.querySelector(".signup-button");

  if (!loginButton || !signupButton) {
    return;
  }

  if (user) {

    loginButton.textContent = "Dashboard";

    signupButton.textContent = "Logout";

    loginButton.onclick = () => {

      showMessage(
        "Dashboard will be connected next."
      );

    };

    signupButton.onclick = () => {

      logoutUser();

    };

  } else {

    loginButton.textContent = "Login";

    signupButton.textContent = "Sign Up";

    loginButton.onclick = () => {

      openAuthModal("login");

    };

    signupButton.onclick = () => {

      openAuthModal("signup");

    };

  }

}


// ===============================
// AUTH MESSAGE
// ===============================

function showAuthMessage(message, type = "error") {

  const box =
    document.getElementById("auth-message");

  if (!box) {
    return;
  }

  box.textContent = message;

  box.className =
    "skilllink-auth-message " + type;

}


// ===============================
// AUTH LOADING
// ===============================

function setAuthLoading(loading) {

  const button =
    document.getElementById("auth-submit");

  if (!button) {
    return;
  }

  button.disabled = loading;

  button.textContent =
    loading
      ? "Please wait..."
      : button.textContent.includes("Account")
        ? "Create Account"
        : "Login";

}


// ===============================
// CLOSE MODAL
// ===============================

function closeAuthModal() {

  const modal =
    document.getElementById(
      "skilllink-auth-modal"
    );

  if (modal) {
    modal.remove();
  }

}


// ===============================
// COURSE BUTTONS
// ===============================

function setupCourseButtons() {

  document
    .querySelectorAll(".card-button")
    .forEach((button) => {

      button.addEventListener("click", () => {

        const card =
          button.closest(".course-card");

        const name =
          card
            ? card.querySelector("h3")?.textContent
            : "Course";

        showMessage(
          `${name} selected.`
        );

      });

    });

}


// ===============================
// PACKAGE BUTTONS
// ===============================

function setupPackageButtons() {

  document
    .querySelectorAll(".package-button")
    .forEach((button) => {

      button.addEventListener("click", () => {

        const card =
          button.closest(".package-card");

        const name =
          card
            ? card.querySelector("h3")?.textContent
            : "Package";

        showMessage(
          `${name} selected.`
        );

      });

    });

}


// ===============================
// PROJECT BUTTONS
// ===============================

function setupProjectButtons() {

  document
    .querySelectorAll(".project-card button")
    .forEach((button) => {

      button.addEventListener("click", () => {

        const card =
          button.closest(".project-card");

        const name =
          card
            ? card.querySelector("h3")?.textContent
            : "Project";

        showMessage(
          `${name} selected.`
        );

      });

    });

}


// ===============================
// SMOOTH SCROLL
// ===============================

function setupSmoothScroll() {

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {

          const targetId =
            link.getAttribute("href");

          if (
            !targetId ||
            targetId === "#"
          ) {
            return;
          }

          const target =
            document.querySelector(
              targetId
            );

          if (target) {

            event.preventDefault();

            target.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }

        }
      );

    });

}


// ===============================
// SCROLL REVEAL
// ===============================

function setupScrollReveal() {

  const animatedElements =
    document.querySelectorAll(
      ".feature-card, .course-card, .package-card, .project-card, .earn-card, .community-card"
    );

  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "show-card"
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );

  animatedElements.forEach(
    (element) => {

      element.classList.add(
        "hidden-card"
      );

      observer.observe(element);

    }
  );

}


// ===============================
// NOTIFICATION
// ===============================

function showMessage(message) {

  const oldMessage =
    document.querySelector(
      ".skilllink-message"
    );

  if (oldMessage) {
    oldMessage.remove();
  }

  const notification =
    document.createElement("div");

  notification.className =
    "skilllink-message";

  notification.textContent =
    message;

  Object.assign(
    notification.style,
    {

      position: "fixed",

      bottom: "25px",

      left: "50%",

      transform:
        "translateX(-50%)",

      zIndex: "99999",

      padding: "14px 22px",

      borderRadius: "14px",

      background:
        "linear-gradient(135deg, #1769ff, #7c3aed)",

      color: "#ffffff",

      border:
        "1px solid rgba(255,255,255,0.2)",

      boxShadow:
        "0 20px 60px rgba(0,0,0,0.45)",

      maxWidth: "90%",

      textAlign: "center",

      fontSize: "14px",

      fontWeight: "600"

    }
  );

  document.body.appendChild(
    notification
  );

  setTimeout(() => {

    notification.style.opacity =
      "0";

    notification.style.transition =
      "opacity 0.3s ease";

    setTimeout(() => {

      notification.remove();

    }, 300);

  }, 2500);

}


// ===============================
// AUTH MODAL CSS
// ===============================

function addAuthStyles() {

  if (
    document.getElementById(
      "skilllink-auth-styles"
    )
  ) {
    return;
  }

  const style =
    document.createElement("style");

  style.id =
    "skilllink-auth-styles";

  style.textContent = `

    .skilllink-auth-overlay {
      position: fixed;
      inset: 0;
      z-index: 99998;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(0,0,0,0.72);
      backdrop-filter: blur(10px);
    }

    .skilllink-auth-box {
      width: 100%;
      max-width: 430px;
      position: relative;
      padding: 30px;
      border-radius: 24px;
      background: #111827;
      border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 30px 100px rgba(0,0,0,0.55);
      color: white;
    }

    .skilllink-close {
      position: absolute;
      right: 18px;
      top: 15px;
      border: none;
      background: transparent;
      color: white;
      font-size: 30px;
      cursor: pointer;
    }

    .skilllink-auth-logo {
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 18px;
    }

    .skilllink-auth-box h2 {
      margin: 0 0 8px;
      font-size: 26px;
    }

    .skilllink-auth-subtitle {
      color: #9ca3af;
      margin-bottom: 22px;
    }

    .skilllink-auth-input {
      width: 100%;
      box-sizing: border-box;
      margin-bottom: 13px;
      padding: 14px 15px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.12);
      outline: none;
      background: #1f2937;
      color: white;
      font-size: 15px;
    }

    .skilllink-auth-input::placeholder {
      color: #9ca3af;
    }

    .skilllink-auth-input:focus {
      border-color: #1769ff;
    }

    .skilllink-auth-submit {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      background: linear-gradient(
        135deg,
        #1769ff,
        #7c3aed
      );
      color: white;
      font-size: 16px;
      font-weight: 700;
      margin-top: 5px;
    }

    .skilllink-auth-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .skilllink-auth-message {
      margin-top: 15px;
      font-size: 14px;
      line-height: 1.5;
    }

    .skilllink-auth-message.error {
      color: #f87171;
    }

    .skilllink-auth-message.success {
      color: #4ade80;
    }

    .skilllink-auth-switch {
      text-align: center;
      margin-top: 20px;
      color: #9ca3af;
      font-size: 14px;
    }

    .skilllink-auth-switch button {
      border: none;
      background: none;
      color: #60a5fa;
      cursor: pointer;
      font-weight: 700;
    }

    @media (max-width: 480px) {

      .skilllink-auth-box {
        padding: 24px;
      }

    }

  `;

  document.head.appendChild(style);

                            }
