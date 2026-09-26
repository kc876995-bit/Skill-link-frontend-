// ========================================
// SKILLINK AUTH + WEBSITE SCRIPT
// ========================================

// SUPABASE CONFIG
const SUPABASE_URL =
  "https://acobkbtjgurifqynotqz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_BIl-VeFFgUtHzEqBZFEa9A_SUZIz7yn";

// CHECK SUPABASE
if (!window.supabase) {
  console.error("Supabase library failed to load.");
} else {

  const { createClient } = window.supabase;

  const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  // ========================================
  // PAGE LOAD
  // ========================================

  document.addEventListener("DOMContentLoaded", () => {

    setupAuthButtons();
    setupCourseButtons();
    setupPackageButtons();
    setupProjectButtons();
    setupSmoothScroll();
    setupScrollReveal();

    checkCurrentUser();

  });


  // ========================================
  // LOGIN / SIGNUP BUTTONS
  // ========================================

  function setupAuthButtons() {

    const loginButton =
      document.querySelector(".login-button");

    const signupButton =
      document.querySelector(".signup-button");


    if (loginButton) {

      loginButton.addEventListener(
        "click",
        () => {

          openAuthModal("login");

        }
      );

    }


    if (signupButton) {

      signupButton.addEventListener(
        "click",
        () => {

          openAuthModal("signup");

        }
      );

    }

  }


  // ========================================
  // AUTH MODAL
  // ========================================

  function openAuthModal(type) {

    const oldModal =
      document.getElementById(
        "skilllink-auth-modal"
      );

    if (oldModal) {
      oldModal.remove();
    }


    const isSignup =
      type === "signup";


    const modal =
      document.createElement("div");

    modal.id =
      "skilllink-auth-modal";


    modal.innerHTML = `

      <div class="skilllink-auth-overlay">

        <div class="skilllink-auth-box">

          <button
            type="button"
            class="skilllink-close"
            id="auth-close"
          >
            ×
          </button>


          <div class="skilllink-auth-logo">
            🚀 SkillLink
          </div>


          <h2>
            ${
              isSignup
                ? "Create your account"
                : "Welcome back"
            }
          </h2>


          <p class="skilllink-auth-subtitle">
            ${
              isSignup
                ? "Start your SkillLink journey."
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
                >

                <input
                  id="auth-username"
                  class="skilllink-auth-input"
                  type="text"
                  placeholder="Username"
                >

              `
              : ""
          }


          <input
            id="auth-email"
            class="skilllink-auth-input"
            type="email"
            placeholder="Email Address"
          >


          <input
            id="auth-password"
            class="skilllink-auth-input"
            type="password"
            placeholder="Password"
          >


          ${
            isSignup
              ? `

                <input
                  id="auth-password-confirm"
                  class="skilllink-auth-input"
                  type="password"
                  placeholder="Confirm Password"
                >

              `
              : ""
          }


          <button
            type="button"
            id="auth-submit"
            class="skilllink-auth-submit"
          >
            ${
              isSignup
                ? "Create Account"
                : "Login"
            }
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
                  <button
                    type="button"
                    id="switch-login"
                  >
                    Login
                  </button>
                `
                : `
                  Don't have an account?
                  <button
                    type="button"
                    id="switch-signup"
                  >
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


    // CLOSE

    document
      .getElementById("auth-close")
      .addEventListener(
        "click",
        closeAuthModal
      );


    // BACKGROUND CLOSE

    const overlay =
      modal.querySelector(
        ".skilllink-auth-overlay"
      );

    overlay.addEventListener(
      "click",
      (event) => {

        if (
          event.target === overlay
        ) {

          closeAuthModal();

        }

      }
    );


    // SUBMIT

    document
      .getElementById("auth-submit")
      .addEventListener(
        "click",
        () => {

          if (isSignup) {

            signupUser();

          } else {

            loginUser();

          }

        }
      );


    // SWITCH LOGIN / SIGNUP

    const switchButton =
      document.querySelector(
        isSignup
          ? "#switch-login"
          : "#switch-signup"
      );


    if (switchButton) {

      switchButton.addEventListener(
        "click",
        () => {

          openAuthModal(
            isSignup
              ? "login"
              : "signup"
          );

        }
      );

    }

  }


  // ========================================
  // SIGNUP
  // ========================================

  async function signupUser() {

    const fullName =
      document
        .getElementById("auth-fullname")
        ?.value
        .trim();


    const username =
      document
        .getElementById("auth-username")
        ?.value
        .trim();


    const email =
      document
        .getElementById("auth-email")
        ?.value
        .trim();


    const password =
      document
        .getElementById("auth-password")
        ?.value;


    const confirmPassword =
      document
        .getElementById(
          "auth-password-confirm"
        )
        ?.value;


    if (
      !fullName ||
      !username ||
      !email ||
      !password
    ) {

      showAuthMessage(
        "Please fill all fields.",
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


    if (
      password !== confirmPassword
    ) {

      showAuthMessage(
        "Passwords do not match.",
        "error"
      );

      return;

    }


    setAuthLoading(true);


    try {

      const {
        data,
        error
      } =
        await supabase.auth.signUp({

          email: email,

          password: password,

          options: {

            data: {

              full_name:
                fullName,

              username:
                username

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


      if (!data.user) {

        showAuthMessage(
          "Account could not be created.",
          "error"
        );

        return;

      }


      if (data.session) {

        await createProfile(
          data.user
        );

        showAuthMessage(
          "Account created successfully!",
          "success"
        );


        setTimeout(
          () => {

            closeAuthModal();

          },
          1200
        );

      } else {

        showAuthMessage(
          "Account created. Check your email for verification.",
          "success"
        );

      }

    } catch (error) {

      setAuthLoading(false);

      showAuthMessage(
        error.message ||
          "Something went wrong.",
        "error"
      );

    }

  }


  // ========================================
  // LOGIN
  // ========================================

  async function loginUser() {

    const email =
      document
        .getElementById("auth-email")
        ?.value
        .trim();


    const password =
      document
        .getElementById("auth-password")
        ?.value;


    if (!email || !password) {

      showAuthMessage(
        "Enter email and password.",
        "error"
      );

      return;

    }


    setAuthLoading(true);


    try {

      const {
        data,
        error
      } =
        await supabase.auth.signInWithPassword({

          email:
            email,

          password:
            password

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

        await createProfile(
          data.user
        );


        showAuthMessage(
          "Login successful!",
          "success"
        );


        setTimeout(
          () => {

            closeAuthModal();

          },
          1000
        );

      }

    } catch (error) {

      setAuthLoading(false);

      showAuthMessage(
        error.message ||
          "Login failed.",
        "error"
      );

    }

  }


  // ========================================
  // CREATE PROFILE
  // ========================================

  async function createProfile(user) {

    if (!user) {
      return;
    }


    const fullName =
      user.user_metadata?.full_name ||
      "";


    const username =
      user.user_metadata?.username ||
      "";


    const {
      error
    } =
      await supabase
        .from("profiles")
        .insert({

          id:
            user.id,

          full_name:
            fullName,

          username:
            username

        });


    // Duplicate profile is okay.

    if (
      error &&
      error.code !== "23505"
    ) {

      console.error(
        "Profile error:",
        error.message
      );

    }

  }


  // ========================================
  // CURRENT USER
  // ========================================

  async function checkCurrentUser() {

    try {

      const {
        data
      } =
        await supabase.auth.getUser();


      if (data.user) {

        updateAuthUI(
          data.user
        );

      } else {

        updateAuthUI(
          null
        );

      }

    } catch (error) {

      console.error(
        "User check error:",
        error
      );

    }

  }


  // ========================================
  // AUTH UI
  // ========================================

  function updateAuthUI(user) {

    const loginButton =
      document.querySelector(
        ".login-button"
      );


    const signupButton =
      document.querySelector(
        ".signup-button"
      );


    if (
      !loginButton ||
      !signupButton
    ) {

      return;

    }


    if (user) {

      loginButton.textContent =
        "Dashboard";


      signupButton.textContent =
        "Logout";


      loginButton.onclick =
        () => {

          showMessage(
            "Dashboard coming next."
          );

        };


      signupButton.onclick =
        () => {

          logoutUser();

        };

    } else {

      loginButton.textContent =
        "Login";


      signupButton.textContent =
        "Sign Up";


      loginButton.onclick =
        () => {

          openAuthModal(
            "login"
          );

        };


      signupButton.onclick =
        () => {

          openAuthModal(
            "signup"
          );

        };

    }

  }


  // ========================================
  // LOGOUT
  // ========================================

  async function logoutUser() {

    const {
      error
    } =
      await supabase.auth.signOut();


    if (error) {

      showMessage(
        "Logout failed."
      );

      return;

    }


    showMessage(
      "Logged out successfully."
    );


    updateAuthUI(null);

  }


  // ========================================
  // AUTH MESSAGE
  // ========================================

  function showAuthMessage(
    message,
    type
  ) {

    const box =
      document.getElementById(
        "auth-message"
      );


    if (!box) {
      return;
    }


    box.textContent =
      message;


    box.className =
      "skilllink-auth-message " +
      type;

  }


  // ========================================
  // LOADING
  // ========================================

  function setAuthLoading(
    loading
  ) {

    const button =
      document.getElementById(
        "auth-submit"
      );


    if (!button) {
      return;
    }


    button.disabled =
      loading;


    if (loading) {

      button.textContent =
        "Please wait...";

    } else {

      button.textContent =
        button.dataset.mode === "signup"
          ? "Create Account"
          : "Login";

    }

  }


  // ========================================
  // CLOSE MODAL
  // ========================================

  function closeAuthModal() {

    const modal =
      document.getElementById(
        "skilllink-auth-modal"
      );


    if (modal) {

      modal.remove();

    }

  }


  // ========================================
  // COURSE BUTTONS
  // ========================================

  function setupCourseButtons() {

    document
      .querySelectorAll(
        ".card-button"
      )
      .forEach(
        (button) => {

          button.addEventListener(
            "click",
            () => {

              const card =
                button.closest(
                  ".course-card"
                );


              const name =
                card
                  ? card
                      .querySelector(
                        "h3"
                      )
                      ?.textContent
                  : "Course";


              showMessage(
                `${name} selected.`
              );

            }
          );

        }
      );

  }


  // ========================================
  // PACKAGE BUTTONS
  // ========================================

  function setupPackageButtons() {

    document
      .querySelectorAll(
        ".package-button"
      )
      .forEach(
        (button) => {

          button.addEventListener(
            "click",
            () => {

              const card =
                button.closest(
                  ".package-card"
                );


              const name =
                card
                  ? card
                      .querySelector(
                        "h3"
                      )
                      ?.textContent
                  : "Package";


              showMessage(
                `${name} selected.`
              );

            }
          );

        }
      );

  }


  // ========================================
  // PROJECT BUTTONS
  // ========================================

  function setupProjectButtons() {

    document
      .querySelectorAll(
        ".project-card button"
      )
      .forEach(
        (button) => {

          button.addEventListener(
            "click",
            () => {

              const card =
                button.closest(
                  ".project-card"
                );


              const name =
                card
                  ? card
                      .querySelector(
                        "h3"
                      )
                      ?.textContent
                  : "Project";


              showMessage(
                `${name} selected.`
              );

            }
          );

        }
      );

  }


  // ========================================
  // SMOOTH SCROLL
  // ========================================

  function setupSmoothScroll() {

    document
      .querySelectorAll(
        'a[href^="#"]'
      )
      .forEach(
        (link) => {

          link.addEventListener(
            "click",
            (event) => {

              const targetId =
                link.getAttribute(
                  "href"
                );


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
                  behavior:
                    "smooth",

                  block:
                    "start"

                });

              }

            }
          );

        }
      );

  }


  // ========================================
  // SCROLL REVEAL
  // ========================================

  function setupScrollReveal() {

    const elements =
      document.querySelectorAll(
        ".feature-card, .course-card, .package-card, .project-card, .earn-card, .community-card"
      );


    if (
      typeof IntersectionObserver ===
      "undefined"
    ) {

      return;

    }


    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "show-card"
                );


                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold:
            0.12
        }
      );


    elements.forEach(
      (element) => {

        element.classList.add(
          "hidden-card"
        );


        observer.observe(
          element
        );

      }
    );

  }


  // ========================================
  // NOTIFICATION
  // ========================================

  function showMessage(
    message
  ) {

    const old =
      document.querySelector(
        ".skilllink-message"
      );


    if (old) {

      old.remove();

    }


    const notification =
      document.createElement(
        "div"
      );


    notification.className =
      "skilllink-message";


    notification.textContent =
      message;


    Object.assign(
      notification.style,
      {

        position:
          "fixed",

        bottom:
          "25px",

        left:
          "50%",

        transform:
          "translateX(-50%)",

        zIndex:
          "99999",

        padding:
          "14px 22px",

        borderRadius:
          "14px",

        background:
          "linear-gradient(135deg, #1769ff, #7c3aed)",

        color:
          "#ffffff",

        boxShadow:
          "0 20px 60px rgba(0,0,0,0.45)",

        maxWidth:
          "90%",

        textAlign:
          "center",

        fontSize:
          "14px",

        fontWeight:
          "600"

      }
    );


    document.body.appendChild(
      notification
    );


    setTimeout(
      () => {

        notification.style.opacity =
          "0";

        notification.style.transition =
          "opacity 0.3s ease";


        setTimeout(
          () => {

            notification.remove();

          },
          300
        );

      },
      2500
    );

  }


// ============================================================
// AUTH CSS
// ============================================================

const authStyle = document.createElement("style");

authStyle.textContent = `
.auth-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 20px;
}

.auth-modal {
  width: 100%;
  max-width: 420px;
  background: #111827;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px;
  padding: 28px;
  color: #fff;
  box-shadow: 0 25px 80px rgba(0,0,0,0.5);
}

.auth-modal h2 {
  margin: 0 0 8px;
  font-size: 28px;
}

.auth-modal p {
  color: #9ca3af;
  margin-bottom: 22px;
}

.auth-form-group {
  margin-bottom: 16px;
}

.auth-form-group label {
  display: block;
  margin-bottom: 7px;
  font-size: 14px;
  color: #d1d5db;
}

.auth-form-group input {
  width: 100%;
  box-sizing: border-box;
  padding: 13px 14px;
  border-radius: 10px;
  border: 1px solid #374151;
  background: #1f2937;
  color: #fff;
  outline: none;
  font-size: 15px;
}

.auth-form-group input:focus {
  border-color: #6366f1;
}

.auth-submit {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: #6366f1;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
}

.auth-submit:hover {
  background: #4f46e5;
}

.auth-close {
  float: right;
  border: none;
  background: transparent;
  color: #9ca3af;
  font-size: 28px;
  cursor: pointer;
}

.auth-switch {
  text-align: center;
  margin-top: 18px;
  color: #9ca3af;
}

.auth-switch button {
  border: none;
  background: transparent;
  color: #818cf8;
  cursor: pointer;
  font-weight: 600;
}

.auth-message {
  margin-top: 14px;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  display: none;
}
`;

document.head.appendChild(authStyle);


// ============================================================
// AUTH MODAL
// ============================================================

function openAuthModal(mode = "login") {

  const oldModal = document.querySelector(".auth-overlay");

  if (oldModal) {
    oldModal.remove();
  }

  const isSignup = mode === "signup";

  const overlay = document.createElement("div");
  overlay.className = "auth-overlay";

  overlay.innerHTML = `
    <div class="auth-modal">

      <button class="auth-close" type="button">&times;</button>

      <h2>
        ${isSignup ? "Create Account" : "Welcome Back"}
      </h2>

      <p>
        ${isSignup
          ? "Create your SkillLink account"
          : "Login to your SkillLink account"}
      </p>

      <form id="authForm">

        ${
          isSignup
            ? `
              <div class="auth-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  id="authFullName"
                  placeholder="Enter your full name"
                  required
                >
              </div>

              <div class="auth-form-group">
                <label>Username</label>
                <input
                  type="text"
                  id="authUsername"
                  placeholder="Choose username"
                  required
                >
              </div>
            `
            : ""
        }

        <div class="auth-form-group">
          <label>Email</label>
          <input
            type="email"
            id="authEmail"
            placeholder="Enter your email"
            required
          >
        </div>

        <div class="auth-form-group">
          <label>Password</label>
          <input
            type="password"
            id="authPassword"
            placeholder="Enter your password"
            minlength="6"
            required
          >
        </div>

        <button
          type="submit"
          class="auth-submit"
          id="authSubmit"
        >
          ${isSignup ? "Create Account" : "Login"}
        </button>

        <div
          id="authMessage"
          class="auth-message"
        ></div>

      </form>

      <div class="auth-switch">

        ${
          isSignup
            ? `
              Already have an account?
              <button type="button" id="switchToLogin">
                Login
              </button>
            `
            : `
              Don't have an account?
              <button type="button" id="switchToSignup">
                Sign Up
              </button>
            `
        }

      </div>

    </div>
  `;

  document.body.appendChild(overlay);


  // CLOSE BUTTON

  const closeButton =
    overlay.querySelector(".auth-close");

  closeButton.addEventListener("click", () => {
    overlay.remove();
  });


  // CLICK OUTSIDE MODAL

  overlay.addEventListener("click", (event) => {

    if (event.target === overlay) {
      overlay.remove();
    }

  });


  // SWITCH LOGIN

  const switchToLogin =
    overlay.querySelector("#switchToLogin");

  if (switchToLogin) {

    switchToLogin.addEventListener("click", () => {
      openAuthModal("login");
    });

  }


  // SWITCH SIGNUP

  const switchToSignup =
    overlay.querySelector("#switchToSignup");

  if (switchToSignup) {

    switchToSignup.addEventListener("click", () => {
      openAuthModal("signup");
    });

  }


  // FORM SUBMIT

  const authForm =
    overlay.querySelector("#authForm");

  authForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
      document.querySelector("#authEmail").value.trim();

    const password =
      document.querySelector("#authPassword").value;

    const message =
      document.querySelector("#authMessage");

    const submitButton =
      document.querySelector("#authSubmit");


    message.style.display = "block";
    message.textContent = "Please wait...";

    submitButton.disabled = true;


    try {

      if (isSignup) {

        const fullName =
          document.querySelector("#authFullName")
            .value.trim();

        const username =
          document.querySelector("#authUsername")
            .value.trim();


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


        if (error) {
          throw error;
        }


        if (data.user) {

          await createProfile(data.user);

        }


        message.textContent =
          "Account created successfully. Check your email if verification is required.";

        message.style.color = "#86efac";

      } else {

        const { data, error } =
          await supabase.auth.signInWithPassword({

            email: email,

            password: password

          });


        if (error) {
          throw error;
        }


        message.textContent =
          "Login successful!";

        message.style.color = "#86efac";


        setTimeout(() => {

          overlay.remove();

          updateAuthUI();

        }, 800);

      }

    } catch (error) {

      console.error(error);

      message.style.display = "block";

      message.style.color = "#fca5a5";

      message.textContent =
        error.message || "Something went wrong.";

    } finally {

      submitButton.disabled = false;

    }

  });

}


// ============================================================
// CREATE PROFILE
// ============================================================

async function createProfile(user) {

  if (!user) return;

  const fullName =
    user.user_metadata?.full_name || "";

  const username =
    user.user_metadata?.username || "";


  const { error } =
    await supabase
      .from("profiles")
      .insert({

        id: user.id,

        full_name: fullName,

        username: username

      });


  if (error && error.code !== "23505") {

    console.error(
      "Profile creation error:",
      error
    );

  }

}


// ============================================================
// AUTH BUTTONS
// ============================================================

function setupAuthButtons() {

  const loginButton =
    document.querySelector(".login-button");

  const signupButton =
    document.querySelector(".signup-button");


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


// ============================================================
// CHECK CURRENT USER
// ============================================================

async function checkCurrentUser() {

  try {

    const {
      data: { user }
    } = await supabase.auth.getUser();


    if (user) {

      console.log(
        "Logged in user:",
        user.email
      );

      updateAuthUI(user);

    }

  } catch (error) {

    console.error(
      "User check failed:",
      error
    );

  }

}


// ============================================================
// UPDATE AUTH UI
// ============================================================

function updateAuthUI(user = null) {

  const loginButton =
    document.querySelector(".login-button");

  const signupButton =
    document.querySelector(".signup-button");


  if (!user) {

    if (loginButton) {
      loginButton.textContent = "Login";
    }

    if (signupButton) {
      signupButton.textContent = "Sign Up";
    }

    return;
  }


  if (loginButton) {

    loginButton.textContent = "Logout";

    loginButton.onclick = async () => {

      await logoutUser();

    };

  }


  if (signupButton) {

    signupButton.style.display = "none";

  }

}


// ============================================================
// LOGOUT
// ============================================================

async function logoutUser() {

  const { error } =
    await supabase.auth.signOut();


  if (error) {

    console.error(
      "Logout error:",
      error
    );

    return;

  }


  location.reload();

}


// ============================================================
// SUPABASE AUTH STATE
// ============================================================

supabase.auth.onAuthStateChange(
  (event, session) => {

    console.log(
      "Auth event:",
      event
    );

    updateAuthUI(
      session?.user || null
    );

  }
);


// ============================================================
// INITIALIZE AUTH
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    setupAuthButtons();

    checkCurrentUser();

  }
);
