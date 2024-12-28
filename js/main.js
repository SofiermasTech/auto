const pageBody = document.querySelector('.page');
const bodyIntro = document.querySelector('.intro__body');
const contentIntro = document.querySelector('.intro__content');
const logosIntro = document.querySelector('.intro__logos');
const header = document.querySelector('.header');

const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
// console.log(scrollBarWidth)
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

  const maxWidthValue = bodyIntro.offsetWidth - introPaddingInline * 2;
  header.style.maxWidth = maxWidthValue + 'px';

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

// Анимация для логотипов
const logosContainer = document.querySelector('.intro__logos');
const logos = document.querySelectorAll('.intro__logo');
const logoWidth = document.querySelector('.intro__logo');

let scrollPosition = 0;
const speed = 0.3;

console.log(logoWidth.offsetWidth);

const getVisibleLogosCount = () => {
  return Array.from(logos).filter((logo) => {
    return logo.style.display !== 'none' && logo.offsetParent !== null; // Проверяем, что элемент не скрыт
  }).length;
};

let visibleLogosCount = getVisibleLogosCount();
let totalWidth = visibleLogosCount * logoWidth.offsetWidth;
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
});

const btnFormClose = document.querySelector('.popup__btn-close');
const popupForm = document.querySelector('.popup-form');
const popupInfo = document.querySelector('.popup-card');
const btnFormOpen = document.querySelectorAll('.btn-popup');

function openPopup(popup) {
  popup.classList.add('open');
  document.addEventListener('keydown', closePopupEsc);
  hideScroll();

  header.style.opacity = '0';
  updateStyles();
}

btnFormOpen.forEach((btn) => {
  btn.addEventListener('click', () => {
    openPopup(popupForm);
  });
});

popupForm.addEventListener('mousedown', (evt) => {
  if (evt.target === evt.currentTarget) {
    // console.log(evt.target);
    // console.log(evt.currentTarget);
    closePopup(popupForm);
  }
});

popupInfo.addEventListener('mousedown', (evt) => {
  if (evt.target === evt.currentTarget) {
    closePopup(popupInfo);
  }
});

const burgerMenu = document.querySelector('.btn-menu');
const mobileMenu = document.querySelector('.mobile-menu');
const btnMenuClose = document.querySelector('.mobile-menu__btn-close');
const linkMenu = document.querySelectorAll('.menu-link-js');

burgerMenu.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  hideScroll();
});

btnMenuClose.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  hideScroll();
});

linkMenu.forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    btnMenuClose.classList.remove('open');
    hideScroll();
  });
});

function hideScroll() {
  pageBody.classList.toggle('stop-scroll');
}

const filtersBtnType = document.querySelectorAll('.type-car .filters__btn');
const filtersBtnElse = document.querySelectorAll('.type-else .filters__btn');

function removeActiveClass(groupBtn) {
  groupBtn.forEach((btn) => {
    btn.classList.remove('active');
  });
}

filtersBtnType.forEach((btn) => {
  btn.addEventListener('click', () => {
    removeActiveClass(filtersBtnType);
    btn.classList.add('active');
  });
});

filtersBtnElse.forEach((btn) => {
  btn.addEventListener('click', () => {
    removeActiveClass(filtersBtnElse);
    btn.classList.add('active');
  });
});

const sendForm = document.forms.formPopup;
const popupSuccess = document.querySelector('.form-success');
const btnSuccessClose = document.querySelector('.form-success__btn-close');
const btnSuccessCloseBottom = document.querySelector('.form-success__btn');

function closePopup(popup) {
  popup.classList.remove('open');
  hideScroll();
  document.removeEventListener('keydown', closePopupEsc);
  header.style.opacity = '1';
  sendForm.reset();

  document.body.style.paddingRight = '';
  updateStyles();
}

function closePopupEsc(evt) {
  if (evt.key === 'Escape') {
    const popupVisible = document.querySelector('.open');
    closePopup(popupVisible);
  }
}

popupSuccess.addEventListener('mousedown', (evt) => {
  if (evt.target === evt.currentTarget) {
    closePopup(popupSuccess);
  }
});

const btnPopupCardClose = document.querySelector(
  '.popup-card .popup__btn-close'
);

btnFormClose.addEventListener('click', () => closePopup(popupForm));
btnSuccessClose.addEventListener('click', () => closePopup(popupSuccess));
btnSuccessCloseBottom.addEventListener('click', () => closePopup(popupSuccess));
btnPopupCardClose.addEventListener('click', () => closePopup(popupInfo));

AOS.init({
  offset: 120, // offset (in px) from the original trigger point
  duration: 400, // values from 0 to 3000, with step 50ms
  easing: 'linear', // default easing for AOS animations
});