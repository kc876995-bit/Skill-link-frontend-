const SUPABASE_URL = "https://acobkbtjgurifqynotqz.supabase.co";

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
      alert("SIGN UP WORKING");
    });
  }
});
