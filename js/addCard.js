import {cars} from './catalog.js';

const cardsContainer = document.querySelector('.cards__content');
const emptyMessage = document.querySelector('.cards__content-empty');

// Изначально показываем 5 карточек
let cardsToShow = 5;

function updateCardsToShow() {
  const screenWidth = window.innerWidth;

  if (screenWidth >= 1280) {
    cardsToShow = 5;
  } else if (screenWidth >= 1024) {
    cardsToShow = 4;
  } else if (screenWidth >= 580) {
    cardsToShow = 6;
  } else {
    cardsToShow = 3; // для ширины менее 580px
  }
}

// Обработчик события для кнопки "Показать еще"
const btnLoadMore = document.querySelector('.cards__btn-else');

btnLoadMore.addEventListener('click', () => {
  cardsToShow += 6;
  renderCards(filteredCars);
});

// Функция для создания элемента пагинации
function createPaginationItem(index) {
  const paginationItem = document.createElement('li');
  paginationItem.classList.add('card__pagination-item');
  paginationItem.setAttribute('data-index', index);
  paginationItem.classList.toggle('active', index === 0);

  return paginationItem;
}

// Функция для обновления активного элемента пагинации
function updatePagination(card, index) {
  const paginationItems = card.querySelectorAll('.card__pagination-item');
  paginationItems.forEach((el) => el.classList.remove('active'));
  card
    .querySelector(`.card__pagination-item[data-index="${index}"]`)
    .classList.add('active');
}

// Функция для сброса пагинации
function resetPagination(card) {
  const paginationItems = card.querySelectorAll('.card__pagination-item');
  paginationItems.forEach((el) => el.classList.remove('active'));
  card
    .querySelector(`.card__pagination-item[data-index="0"]`)
    .classList.add('active');
}

// Добавление данных
function fillCardData(card, item) {
  const priceEl = card.querySelector('.card__price-js');
  priceEl.textContent = item.price.toLocaleString('ru-RU');

  const brandEl = card.querySelector('.card__car-brand');
  brandEl.textContent = `${item.brand}`;

  const modelEl = card.querySelector('.card__car-model');
  modelEl.textContent = `${item.model}`;

  const transmissionEl = card.querySelector('.card__transmission');
  transmissionEl.textContent = `${item.transmission}`;

  const motorEl = card.querySelector('.card__motor');
  motorEl.textContent = `${item.motor}`;

  const mileageEl = card.querySelector('.card__mileage');
  mileageEl.textContent = item.mileage.toLocaleString('ru-RU');

  const motorTypeEl = card.querySelector('.card__motor-type');
  motorTypeEl.textContent = `${item.motorType}`;

  const powerEl = card.querySelector('.card__power');
  powerEl.textContent = `${item.power}`;

  const driveEl = card.querySelector('.card__drive');
  driveEl.textContent = `${item.drive}`;
}

function createCard(item) {
  const template = document.querySelector('.card-template');
  const cardClone = template.content.cloneNode(true);
  const card = cardClone.querySelector('.card');

  if (!card) return null;
  card.setAttribute('data-year', item.year);

  const imagesContainer = cardClone.querySelector('.card__images');
  const imageTemplate = cardClone.querySelector('.card__image-item');
  const imagePagination = cardClone.querySelector('.card__pagination-list');
  imagesContainer.innerHTML = '';
  imagePagination.innerHTML = '';

  // Проверка на количество изображений
  if (item.img.length > 1) {
    imagePagination.style.display = 'flex';
  } else {
    imagePagination.style.display = 'none';
  }

  item.img.forEach((imageSrc, index) => {
    const imageItemClone = imageTemplate.cloneNode(true);
    imageItemClone.setAttribute('data-index', index);

    const imgElement = imageItemClone.querySelector('img');
    imgElement.src = imageSrc;
    imgElement.alt = `${item.brand} ${item.model}`;

    // Обработчики событий для наведения и свайпов
    imageItemClone.addEventListener('mouseenter', (evt) => {
      updatePagination(card, evt.currentTarget.dataset.index);
    });

    imageItemClone.addEventListener('mouseleave', () => {
      resetPagination(card);
    });

    const imageItemClones = imagesContainer.querySelectorAll('.card__image-item');
    imageItemClones.forEach((imageItem) => {
      imageItem.addEventListener('touchstart', handleTouchStart, false);
      imageItem.addEventListener('touchmove', handleTouchMove, false);
    });

    imagesContainer.appendChild(imageItemClone);

    const paginationItem = createPaginationItem(index);
    imagePagination.appendChild(paginationItem);
  });

  fillCardData(card, item);

  // Обработчики для кнопок попапов
  const btnPopup = cardClone.querySelector('.card__btn-popup');
  if (btnPopup) {
    btnPopup.addEventListener('click', () => {
      pageBody.classList.add('stop-scroll');
      openPopup(popupForm);
    });
  }

  const btnInfo = cardClone.querySelector('.card__btn-info');
  if (btnInfo) {
    btnInfo.addEventListener('click', () => openPopupCard(item));
  }

  return cardClone;
}

updateCardsToShow();

// Генерация карточек
if (cardsContainer) {
  cars.forEach((item) => {
    const cardClone = createCard(item);

    if (cardClone) {
      cardsContainer.appendChild(cardClone);
    }
  });
}

function renderCards(cards) {
  const cardsContainer = document.querySelector('.cards__content');
  const existingCards = cardsContainer.querySelectorAll('.card');

  // Удаляем только карточки т.к. еще есть фильтры в контейнере
  existingCards.forEach((card) => card.remove());

  const visibleCards = cards.slice(0, cardsToShow);
  visibleCards.forEach((item) => {
    const cardClone = createCard(item);
    if (cardClone) {
      cardsContainer.appendChild(cardClone);
    }
  });

  // Проверяем, нужно ли скрыть кнопку "Показать еще"
  const btnLoadMore = document.querySelector('.cards__btn-else');
  if (cardsToShow >= cards.length) {
    btnLoadMore.style.display = 'none';
  } else {
    btnLoadMore.style.display = 'block';
  }

  if (cards.length === 0) {
    emptyMessage.style.display = 'block';
  } else {
    emptyMessage.style.display = 'none';
  }
}

// Открытие попапа с данными о машине

function openPopupCard(carData) {
  const popup = document.querySelector('.popup-card');

  popup.querySelector('.popup-card__car-brand').textContent = carData.brand;
  popup.querySelector('.popup-card__car-model').textContent = carData.model;
  popup.querySelector('.popup-card__transmission').textContent =
    carData.transmission;
  popup.querySelector('.popup-card__motor').textContent = carData.motor;
  popup.querySelector('.popup-card__mileage').textContent =
    carData.mileage.toLocaleString('ru-RU');
  popup.querySelector('.popup-card__motor-type').textContent =
    carData.motorType;
  popup.querySelector('.popup-card__power').textContent = carData.power;
  popup.querySelector('.popup-card__drive').textContent = carData.drive;
  popup.querySelector('.popup-card__body-type').textContent = carData.bodyType;
  popup.querySelector('.popup-card__equipment').textContent = carData.equipment;
  popup.querySelector('.popup-card__color').textContent = carData.color;
  popup.querySelector('.popup-card__year').textContent = carData.year;
  popup.querySelector('.popup-card__condition').textContent = carData.condition;
  popup.querySelector('.popup-card__guarantee').textContent = carData.guarantee;
  popup.querySelector('.popup-card__description').textContent =
    carData.description;
  popup.querySelector('.popup-card__price-js').textContent =
    carData.price.toLocaleString('ru-RU');

  // Добавление img
  const imageTemplate = popup.querySelector('.popup-card__slide');
  const sliderWrapper = popup.querySelector('.popup-card__slider-wrapper');

  sliderWrapper.innerHTML = '';

  carData.img.forEach((imageSrc) => {
    const slide = imageTemplate.cloneNode(true);

    const imgElement = slide.querySelector('img');
    imgElement.src = imageSrc;
    imgElement.alt = `${carData.brand} ${carData.model}`;

    sliderWrapper.appendChild(slide);
  });

  //Свайпер для img-popup-card
  const swiper = new Swiper('.popup-card__slider', {
    slideClass: 'popup-card__slide',
    wrapperClass: 'popup-card__slider-wrapper',
    direction: 'horizontal',
    loop: true,
    spaceBetween: 16,
    slidesPerView: 1,

    pagination: {
      el: '.popup-card__pagination',
      type: 'bullets',
    },

    navigation: {
      nextEl: '.popup-card__btn-next',
      prevEl: '.popup-card__btn-prev',
    },
  });

  popup.classList.add('open');
  header.style.opacity = '0';
  hideScroll();
}


// Обработка свайпов для слайдера карточек
let xDown = null; // Координаты касания

function handleTouchStart(evt) {
  const firstTouch = evt.touches[0]; // Получаем первое касание
  xDown = firstTouch.clientX; // Сохраняем координату X
}

function handleTouchMove(evt) {
  if (!xDown) {
    return; // Если не было касания, выходим
  }

  let xUp = evt.touches[0].clientX; // Получаем текущую координату X
  let xDiff = xDown - xUp; // Вычисляем разницу

  if (Math.abs(xDiff) > 40) {
    const card = evt.currentTarget.closest('.card'); // Находим родительскую карточку
    if (xDiff > 0) {
      // Свайп влево
      nextImage(card);
    } else {
      // Свайп вправо
      previousImage(card);
    }
    xDown = null; // Сбрасываем координату после свайпа
  }
}

// Функция для перехода к следующему изображению
function nextImage(card) {
  const currentIndex = parseInt(
    card.querySelector('.card__pagination-item.active').dataset.index
  );
  const totalImages = card.querySelectorAll('.card__image-item').length;

  const newIndex = (currentIndex + 1) % totalImages; // Цикл обратно к первому изображению
  updatePagination(card, newIndex);
  updateImageDisplay(card, newIndex); // Обновляем отображение изображения
}

// Функция для перехода к предыдущему изображению
function previousImage(card) {
  const currentIndex = parseInt(
    card.querySelector('.card__pagination-item.active').dataset.index
  );
  const totalImages = card.querySelectorAll('.card__image-item').length;

  const newIndex = (currentIndex - 1 + totalImages) % totalImages; // Цикл обратно к последнему изображению
  updatePagination(card, newIndex);
  updateImageDisplay(card, newIndex); // Обновляем отображение изображения
}

// Функция для обновления отображения изображения
function updateImageDisplay(card, index) {
  const images = card.querySelectorAll('.card__image-item');
  images.forEach((img, idx) => {
    img.style.opacity = idx === index ? '1' : '0'; // Показываем текущее изображение и скрываем остальные
  });
}