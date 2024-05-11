let pristine;

(function () {
  "use strict";
  // let authForm = document.getElementById("auth-form");

  // if (authForm) {
  //   pristine = new Pristine(authForm);

  //   const passwordInput = document.getElementById("password");
  //   const confirmPasswordInput = document.getElementById("confirmPassword");

  //   if (confirmPasswordInput) {
  //     pristine.addValidator(
  //       confirmPasswordInput,
  //       function (value, el) {
  //         const password = passwordInput.value;
  //         if (password !== value) {
  //           return false;
  //         }
  //         return true;
  //       },
  //       "Password does't match.",
  //       3,
  //       false
  //     );
  //   }

  //   pristine.addValidator(
  //     passwordInput,
  //     function (value, el) {
  //       const hasUppercase = /[A-Z]/.test(value);
  //       const hasLowercase = /[a-z]/.test(value);

  //       if (!hasUppercase || !hasLowercase) {
  //         return false;
  //       }
  //       return true;
  //     },
  //     "Password must contain at least one uppercase and one lowercase letter.",
  //     2,
  //     false
  //   );

  //   authForm.addEventListener("submit", function (e) {
  //     let valid = pristine.validate();
  //     if (!valid) {
  //       e.preventDefault();
  //     }
  //   });
  // }
  /**
   * Update Profile Form
   */
  const profileForm = document.getElementById("profile-form");

  if (profileForm) {
    pristine = new Pristine(profileForm);

    profileForm.addEventListener("submit", function (e) {
      let valid = pristine.validate();

      if (!valid) {
        e.preventDefault();
      }
    });
  }

  /**
   * Change Password Form
   */

  const changePasswordForm = document.getElementById("change-password-form");
  if (changePasswordForm) {
    pristine = new Pristine(changePasswordForm);

    const passwordInput = document.getElementById("Password");
    const confirmPasswordInput = document.getElementById("ConfirmPassword");

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

    changePasswordForm.addEventListener("submit", function (e) {
      let valid = pristine.validate();

      if (!valid) {
        e.preventDefault();
      }
    });
  }
})();
