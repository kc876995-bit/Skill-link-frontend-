import "./style.css";

/* =========================================
   SKILLINK MAIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     HEADER BUTTONS
  ========================================= */

  const loginButton = document.querySelector(".login-button");
  const signupButton = document.querySelector(".signup-button");
  const searchButton = document.querySelector(".search-button");

  if (loginButton) {
    loginButton.addEventListener("click", () => {
      showMessage(
        "Login system will be connected with Supabase."
      );
    });
  }

  if (signupButton) {
    signupButton.addEventListener("click", () => {
      showMessage(
        "Signup system will be connected with Supabase."
      );
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", () => {
      const searchTerm = prompt(
        "What would you like to search?"
      );

      if (searchTerm && searchTerm.trim()) {
        showMessage(
          `Searching SkillLink for "${searchTerm.trim()}"`
        );
      }
    });
  }


  /* =========================================
     COURSE BUTTONS
  ========================================= */

  const courseButtons =
    document.querySelectorAll(".course-content button");

  courseButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const courseCard =
        button.closest(".course-card");

      const courseName =
        courseCard?.querySelector("h3")?.textContent.trim();

      showMessage(
        `${courseName || "Course"} selected.`
      );

    });

  });


  /* =========================================
     PACKAGE BUTTONS
  ========================================= */

  const packageButtons =
    document.querySelectorAll(".package-card button");

  packageButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const packageCard =
        button.closest(".package-card");

      const packageName =
        packageCard?.querySelector("h3")?.textContent.trim();

      showMessage(
        `${packageName || "Package"} selected. Payment will be connected with Razorpay later.`
      );

    });

  });


  /* =========================================
     PROJECT BUTTONS
  ========================================= */

  const projectButtons =
    document.querySelectorAll(".project-card button");

  projectButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const projectCard =
        button.closest(".project-card");

      const projectName =
        projectCard?.querySelector("h3")?.textContent.trim();

      showMessage(
        `${projectName || "Project"} selected. Project system will be connected with the SkillLink backend.`
      );

    });

  });


  /* =========================================
     SMOOTH SCROLL
  ========================================= */

  document.querySelectorAll(
    'a[href^="#"]'
  ).forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId =
        link.getAttribute("href");

      if (
        !targetId ||
        targetId === "#"
      ) {
        return;
      }

      const target =
        document.querySelector(targetId);

      if (target) {

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    });

  });


  /* =========================================
     SCROLL REVEAL
  ========================================= */

  const animatedElements =
    document.querySelectorAll(
      ".feature-card, .course-card, .package-card, .project-card, .community-card, .visual-card"
    );

  const revealObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "show-card"
            );

            revealObserver.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );

  animatedElements.forEach((element) => {

    element.classList.add(
      "hidden-card"
    );

    revealObserver.observe(element);

  });


  /* =========================================
     WELCOME MESSAGE
  ========================================= */

  console.log(
    "SkillLink frontend initialized successfully."
  );

});


/* =========================================
   MESSAGE SYSTEM
========================================= */

function showMessage(message) {

  const existing =
    document.querySelector(".skilllink-message");

  if (existing) {
    existing.remove();
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
      transform: "translateX(-50%)",
      zIndex: "9999",
      padding: "14px 20px",
      borderRadius: "12px",
      background: "#0d2347",
      color: "#ffffff",
      border: "1px solid rgba(255,255,255,0.15)",
      boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
      maxWidth: "90%",
      textAlign: "center",
      fontSize: "14px"
    }
  );


  document.body.appendChild(
    notification
  );


  setTimeout(() => {

    notification.style.opacity = "0";

    notification.style.transition =
      "opacity 0.3s ease";

    setTimeout(() => {
      notification.remove();
    }, 300);

  }, 2500);

}
