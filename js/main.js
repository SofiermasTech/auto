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
});

const btnFormClose = document.querySelector('.popup__btn-close');
const popupForm = document.querySelector('.popup-form');
const btnFormOpen = document.querySelectorAll('.btn-popup');

btnFormOpen.forEach((btn) => {
  btn.addEventListener('click', () => {
    popupForm.classList.add('open');
    document.addEventListener('keydown', closePopupEsc);
    hideScroll();
  });
});

popupForm.addEventListener('mousedown', (evt) => {
  if (evt.target === evt.currentTarget) {
    // console.log(evt.target);
    // console.log(evt.currentTarget);
    closePopup(popupForm);
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

const headingFilters = document.querySelectorAll('.select-heading-js');
// const filterElement = document.querySelectorAll('.select-list-js');

headingFilters.forEach((heading) => {
  heading.addEventListener('click', () => {
    const isOpen = heading.classList.contains('open');

    headingFilters.forEach((heading) => {
      heading.classList.remove('open');
    });

    if (!isOpen) {
      heading.classList.add('open');
    }
  });
});

const pageBody = document.querySelector('.page');
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

  sendForm.reset();
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

btnFormClose.addEventListener('click', () => closePopup(popupForm));
btnSuccessClose.addEventListener('click', () => closePopup(popupSuccess));
btnSuccessCloseBottom.addEventListener('click', () => closePopup(popupSuccess));