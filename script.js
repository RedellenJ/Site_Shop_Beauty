const banner = document.querySelector(".banner");
const leftArrow = document.querySelector(".left");
const rightArrow = document.querySelector(".right");
const dots = document.querySelectorAll(".dots span");
const menuLinks = document.querySelectorAll(".menu a");

const images = [
  "Img/Background/Background_1.jpg",
  "Img/Background/Background_2.jpg",
  "Img/Background/Background_3.jpg",
  "Img/Background/Background_4.jpg",
  "Img/Background/Background_5.jpg",
];

let currentIndex = 0;

function updateBanner() {
  if (!banner || dots.length === 0) {
    return;
  }

  banner.style.background = `url('${images[currentIndex]}') center/cover no-repeat`;

  dots.forEach((dot) => dot.classList.remove("active"));
  dots[currentIndex].classList.add("active");
}

function nextSlide() {
  currentIndex++;
  if (currentIndex >= images.length) {
    currentIndex = 0;
  }
  updateBanner();
}

function prevSlide() {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = images.length - 1;
  }
  updateBanner();
}

if (rightArrow && leftArrow && banner && dots.length > 0) {
  rightArrow.addEventListener("click", nextSlide);
  leftArrow.addEventListener("click", prevSlide);
  setInterval(nextSlide, 4000);
  updateBanner();
}

if (menuLinks.length > 0) {
  const currentFile = window.location.pathname.split("/").pop() || "index.html";

  menuLinks.forEach((link) => {
    const targetFile = link.getAttribute("href")
      ? link.getAttribute("href").split("/").pop()
      : "";
    if (targetFile === currentFile) {
      link.classList.add("active");
    }
  });
}

const contactForm = document.querySelector(".contact-form");
const phoneField = document.querySelector("#telefone");

if (phoneField) {
  phoneField.addEventListener("input", () => {
    phoneField.value = phoneField.value.replace(/\D/g, "");
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameField = document.querySelector("#nome");
    const emailField = document.querySelector("#email");
    const messageField = document.querySelector("#mensagem");

    const name = nameField ? nameField.value.trim() : "";
    const email = emailField ? emailField.value.trim() : "";
    const phone = phoneField ? phoneField.value.trim() : "";
    const message = messageField ? messageField.value.trim() : "";

    const recipientEmail = "marinavanoniap@gmail.com";
    const emailSubject = `Contato pelo site - ${name || "Sem nome"}`;
    const emailBody = [
      "Olá, vim pelo site da Shop Beauty.",
      "",
      `Nome: ${name || "Não informado"}`,
      `E-mail: ${email || "Não informado"}`,
      `Telefone: ${phone || "Não informado"}`,
      `Mensagem: ${message || "Não informada"}`,
    ].join("\n");

    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoUrl;
  });
}
