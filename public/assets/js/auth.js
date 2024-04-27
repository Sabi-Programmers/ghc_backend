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
