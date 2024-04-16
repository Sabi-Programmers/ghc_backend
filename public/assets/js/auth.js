// (function () {
//   "use strict";
//   // LOGIN FORM VALIDATION
//   const loginForm = document.getElementById("loginForm");
//   if (loginForm) {
//     loginForm.addEventListener("submit", (event) => {
//       let isValid = true;
//       let usernameError = document.getElementById("username-error");
//       let passwordError = document.getElementById("password-error");

//       // Validate username
//       const username = document.getElementById("username").value.trim();
//       if (username === "") {
//         usernameError.textContent = "Username is required";
//         isValid = false;
//       } else if (username.length < 4) {
//         usernameError.textContent =
//           "Username must be at least 4 characters long";
//         isValid = false;
//       } else {
//         usernameError.textContent = "";
//       }

//       // Validate password
//       const password = document.getElementById("password").value.trim();
//       if (password === "") {
//         passwordError.textContent = "Password is required";
//         isValid = false;
//       } else if (password.length < 6) {
//         passwordError.textContent =
//           "Password must be at least 6 characters long";
//         isValid = false;
//       } else if (!/[A-Z]/.test(password)) {
//         passwordError.textContent =
//           "Password must contain at least one uppercase letter";
//         isValid = false;
//       } else if (!/[a-z]/.test(password)) {
//         passwordError.textContent =
//           "Password must contain at least one lowercase letter";
//         isValid = false;
//       } else {
//         passwordError.textContent = "";
//       }

//       if (!isValid) {
//         event.preventDefault(); // Prevent form submission if validation fails
//       }
//     });
//   }

//   // ENTER SPONSOR ID FORM
//   const sponsorIdForm = document.getElementById("enter-sponsor-id");
//   if (sponsorIdForm) {
//     sponsorIdForm.addEventListener("submit", (event) => {
//       event.preventDefault();
//       let isValid = true;
//       let sponsorIdError = document.getElementById("sponsor-id-error");

//       const sponsorId = document.getElementById("sponsor-id").value.trim();

//       if (sponsorId === "") {
//         sponsorIdError.textContent = "Sponsor Username is required";
//         isValid = false;
//       } else if (sponsorId.length < 4) {
//         sponsorIdError.textContent =
//           "Sponsor Username must be at least 4 characters long.";
//         isValid = false;
//       } else {
//         sponsorIdError.textContent = "";
//       }
//       if (!isValid) {
//         event.preventDefault(); // Prevent form submission if validation fails
//       }
//     });
//   }

//   // REGISTER FORM VALIDATION
//   const registerForm = document.getElementById("loginForm");

//   if (registerForm) {
//     registerForm.addEventListener("submit", (event) => {
//       let isValid = true;
//       let usernameError = document.getElementById("username-error");
//       let passwordError = document.getElementById("password-error");

//       // Validate username
//       const username = document.getElementById("username").value.trim();
//       if (username === "") {
//         usernameError.textContent = "Username is required";
//         isValid = false;
//       } else if (username.length < 4) {
//         usernameError.textContent =
//           "Username must be at least 4 characters long";
//         isValid = false;
//       } else {
//         usernameError.textContent = "";
//       }

//       // Validate password
//       const password = document.getElementById("password").value.trim();
//       if (password === "") {
//         passwordError.textContent = "Password is required";
//         isValid = false;
//       } else if (password.length < 6) {
//         passwordError.textContent =
//           "Password must be at least 6 characters long";
//         isValid = false;
//       } else if (!/[A-Z]/.test(password)) {
//         passwordError.textContent =
//           "Password must contain at least one uppercase letter";
//         isValid = false;
//       } else if (!/[a-z]/.test(password)) {
//         passwordError.textContent =
//           "Password must contain at least one lowercase letter";
//         isValid = false;
//       } else {
//         passwordError.textContent = "";
//       }

//       if (!isValid) {
//         event.preventDefault(); // Prevent form submission if validation fails
//       }
//     });
//   }
// })();

let pristine;
window.onload = function () {
  let form = document.getElementById("auth-form");

  pristine = new Pristine(form);

  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  if (confirmPasswordInput) {
    pristine.addValidator(
      confirmPasswordInput,
      function (value, el) {
        const password = passwordInput.value;
        if (password !== value) {
          return false;
        }
        return true;
      },
      "Password does't match.",
      3,
      false
    );
  }

  pristine.addValidator(
    passwordInput,
    function (value, el) {
      const hasUppercase = /[A-Z]/.test(value);
      const hasLowercase = /[a-z]/.test(value);

      if (!hasUppercase || !hasLowercase) {
        return false;
      }
      return true;
    },
    "Password must contain at least one uppercase and one lowercase letter.",
    2,
    false
  );

  form.addEventListener("submit", function (e) {
    let valid = pristine.validate();
    if (!valid) {
      e.preventDefault();
    }
  });
};
