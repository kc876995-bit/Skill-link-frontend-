document.addEventListener("DOMContentLoaded", () => {

  // LOGIN
  const loginButton = document.querySelector(".login-button");

  if (loginButton) {
    loginButton.addEventListener("click", () => {
      showMessage("Login system will be connected with Supabase.");
    });
  }


  // SIGNUP
  const signupButton = document.querySelector(".signup-button");

  if (signupButton) {
    signupButton.addEventListener("click", () => {
      showMessage("Create your SkillLink account.");
    });
  }


  // COURSE BUTTONS
  document.querySelectorAll(".card-button").forEach((button) => {

    button.addEventListener("click", () => {

      const card = button.closest(".course-card");

      const name = card
        ? card.querySelector("h3")?.textContent
        : "Course";

      showMessage(`${name} selected.`);

    });

  });


  // PACKAGE BUTTONS
  document.querySelectorAll(".package-button").forEach((button) => {

    button.addEventListener("click", () => {

      const card = button.closest(".package-card");

      const name = card
        ? card.querySelector("h3")?.textContent
        : "Package";

      showMessage(`${name} selected.`);

    });

  });


  // PROJECT BUTTONS
  document.querySelectorAll(".project-card button").forEach((button) => {

    button.addEventListener("click", () => {

      const card = button.closest(".project-card");

      const name = card
        ? card.querySelector("h3")?.textContent
        : "Project";

      showMessage(`${name} selected.`);

    });

  });


  // SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (target) {

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    });

  });


  // SCROLL REVEAL
  const animatedElements = document.querySelectorAll(
    ".feature-card, .course-card, .package-card, .project-card, .earn-card, .community-card"
  );


  const observer = new IntersectionObserver(

    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add("show-card");

          observer.unobserve(entry.target);

        }

      });

    },

    {
      threshold: 0.12
    }

  );


  animatedElements.forEach((element) => {

    element.classList.add("hidden-card");

    observer.observe(element);

  });


  console.log("SkillLink loaded successfully.");

});


// NOTIFICATION
function showMessage(message) {

  const oldMessage = document.querySelector(".skilllink-message");

  if (oldMessage) {
    oldMessage.remove();
  }


  const notification = document.createElement("div");

  notification.className = "skilllink-message";

  notification.textContent = message;


  Object.assign(notification.style, {

    position: "fixed",
    bottom: "25px",
    left: "50%",
    transform: "translateX(-50%)",
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

  });


  document.body.appendChild(notification);


  setTimeout(() => {

    notification.style.opacity = "0";

    notification.style.transition =
      "opacity 0.3s ease";

    setTimeout(() => {

      notification.remove();

    }, 300);

  }, 2500);

     }
