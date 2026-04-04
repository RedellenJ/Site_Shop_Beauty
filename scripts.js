const banner = document.querySelector(".banner");
const leftArrow = document.querySelector(".left");
const rightArrow = document.querySelector(".right");
const dots = document.querySelectorAll(".dots span");

const images = [
    "Img/Background/Background_1.jpg",
    "Img/Background/Background_2.jpg",
    "Img/Background/Background_3.jpg",
    "Img/Background/Background_4.jpg",
    "Img/Background/Background_5.jpg"
];

let currentIndex = 0;

function updateBanner() {
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

rightArrow.addEventListener("click", nextSlide);
leftArrow.addEventListener("click", prevSlide);

setInterval(nextSlide, 4000);

updateBanner();