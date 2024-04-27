window.onload = function () {
  const options = {
    placeholder: "Compose an epic...",
    theme: "snow",
  };
  const quill = new Quill("#news-editor", options);

  const newsForm = document.getElementById("news-form");

  if (newsForm) {
    newsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const newsHtml = quill.getSemanticHTML();
      console.log(newsHtml);
    });
  }
};
