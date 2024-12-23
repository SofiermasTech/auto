const bodyIntro = document.querySelector('.intro__body');
const contentIntro = document.querySelector('.intro__content');
const logosIntro = document.querySelector('.intro__logos');
const header = document.querySelector('.header');

// Функция для обновления стилей
const updateStyles = () => {
  bodyIntro.style.paddingBottom = logosIntro.offsetHeight + 'px';

  let introPaddingInline;

  if (window.innerWidth <= 602) {
    introPaddingInline = 18;
  } else if (window.innerWidth <= 768) {
    introPaddingInline = 48;
  } else {
    introPaddingInline = 85;
  }

  header.style.maxWidth = bodyIntro.offsetWidth - introPaddingInline * 2 + 'px';

  let contentPaddingTop;

  if (window.innerWidth <= 768) {
    contentPaddingTop = 32 + 12;
  } else if (window.innerWidth <= 1280) {
    contentPaddingTop = 56 + 16;
  } else {
    contentPaddingTop = 85 + 32;
  }
  contentIntro.style.paddingTop =
    header.offsetHeight + contentPaddingTop + 'px';
};

updateStyles();

const logosContainer = document.querySelector('.intro__logos');
const logos = document.querySelectorAll('.intro__logo');
const logoWidth = document.querySelector('.intro__logo');

let scrollPosition = 0; // Текущая позиция прокрутки
const speed = 0.3; // Скорость прокрутки

console.log(logoWidth.offsetWidth);

const getVisibleLogosCount = () => {
  return Array.from(logos).filter((logo) => {
    return logo.style.display !== 'none' && logo.offsetParent !== null; // Проверяем, что элемент не скрыт
  }).length;
};

let visibleLogosCount = getVisibleLogosCount();
let totalWidth = visibleLogosCount * logoWidth.offsetWidth; // Ширина всех логотипов
console.log(totalWidth);

function animateScroll() {
  scrollPosition += speed;

  if (scrollPosition > totalWidth) {
    scrollPosition = 0;
  }

  logosContainer.style.transform = `translateX(-${scrollPosition}px)`;

  requestAnimationFrame(animateScroll);
}

animateScroll();

window.addEventListener('resize', () => {
  updateStyles();
  // visibleLogosCount = getVisibleLogosCount();
  // totalWidth = visibleLogosCount * logoWidth.offsetWidth; // Ширина всех логотипов
  // animateScroll();
});

const btnFormClose = document.querySelector('.popup__btn-close');
const popupForm = document.querySelector('.popup-form');
const btnFormOpen = document.querySelectorAll('.btn-popup');

btnFormOpen.forEach((btn) => {
  btn.addEventListener('click', () => {
    popupForm.classList.add('open');
  });
});

btnFormClose.addEventListener('click', () => {
  popupForm.classList.remove('open');
});