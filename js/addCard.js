import {cars} from './catalog.js';

// console.log(cars);
const cardsContainer = document.querySelector('.cards__content');
const template = document.querySelector('.card-template');
const emptyMessage = document.querySelector('.cards__content-empty');

let cardsToShow = 5; // Изначально показываем 5 карточек
let filteredCars = []; // Для хранения отфильтрованных карточек
let selectedBrands = [];
let yearFrom = null; // Переменная для года "от"
let yearTo = null; // Переменная для года "до"

// Функция для обновления количества карточек в зависимости от ширины экрана
function updateCardsToShow() {
  const screenWidth = window.innerWidth;

  if (screenWidth >= 1024) {
      cardsToShow = 5; // Показываем 4 карточки для ширины 1024px и более
  } else if (screenWidth >= 768) {
      cardsToShow = 4; // Показываем 6 карточек для ширины 768px и более
  } else if (screenWidth >= 580) {
      cardsToShow = 6; // Показываем 3 карточки для ширины 580px и более
  } else {
      cardsToShow = 3; // для ширины менее 580px
  }
}


// Обработчик событий для марок
const brandItems = document.querySelectorAll('.filters__brand-item');
const titleAll = document.querySelector('.filters__current-title-all');
const titleChoice = document.querySelector('.filters__current-title-choice');

// Получаем ссылки на инпуты года
const yearFromInput = document.getElementById('year-from');
const yearToInput = document.getElementById('year-to');

// Обработчик события для инпутов года
yearFromInput.addEventListener('input', () => {
  yearFrom = parseInt(yearFromInput.value, 10) || null;
  filterCars();
});

yearToInput.addEventListener('change', () => {
  yearTo = parseInt(yearToInput.value, 10) || null;
  filterCars();
});

brandItems.forEach((item) => {
  item.addEventListener('click', () => {
    const brand = item.getAttribute('data-brand');

    // Проверяем, выбрана ли уже марка
    if (selectedBrands.includes(brand)) {
      // Если марка уже выбрана, убираем её
      selectedBrands = selectedBrands.filter((b) => b !== brand);
      item.classList.remove('selected');
    } else {
      // Если марка не выбрана, добавляем её
      selectedBrands.push(brand);
      item.classList.add('selected');
    }

    // Обновляем отображение заголовка
    if (selectedBrands.length > 0) {
      titleAll.style.display = 'none';
      titleChoice.style.display = 'block';
    } else {
      titleAll.style.display = 'block';
      titleChoice.style.display = 'none';
    }

    checkFiltersChanged();
    filterCars();
  });
});


const priceRange = document.getElementById('price-range');
const minPriceOutput = document.getElementById('min-price');
const maxPriceOutput = document.getElementById('max-price');

// Устанавливаем начальные значения с форматированием
minPriceOutput.textContent = parseInt(priceRange.min, 10).toLocaleString('ru-RU');
maxPriceOutput.textContent = parseInt(priceRange.value, 10).toLocaleString('ru-RU');

let minPrice = parseInt(priceRange.min, 10); // Минимальная цена
let maxPrice = parseInt(priceRange.value, 10); // Максимальная цена

// Обработчик события для обновления значений при перемещении ползунка
priceRange.addEventListener('input', () => {
  maxPrice = parseInt(priceRange.value, 10); // Обновляем максимальную цену
  maxPriceOutput.textContent = maxPrice.toLocaleString('ru-RU'); // Обновляем отображение максимальной цены
  filterCars();
  checkFiltersChanged(); // Применяем фильтрацию
});

// Функция для создания элемента пагинации
export function createPaginationItem(index) {
  const paginationItem = document.createElement('li');
  paginationItem.classList.add('card__pagination-item');
  paginationItem.setAttribute('data-index', index);
  paginationItem.classList.toggle('active', index === 0);

  return paginationItem;
}

// Функция для обновления активного элемента пагинации
export function updatePagination(card, index) {
  const paginationItems = card.querySelectorAll('.card__pagination-item');
  paginationItems.forEach((el) => el.classList.remove('active'));
  card
    .querySelector(`.card__pagination-item[data-index="${index}"]`)
    .classList.add('active');
}

// Функция для сброса пагинации
export function resetPagination(card) {
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
  const cardClone = template.content.cloneNode(true);
  const card = cardClone.querySelector('.card');
  if (!card) return null;
  // card.setAttribute('data-product-id', item.id);
  card.setAttribute('data-year', item.year);

  const imagesContainer = cardClone.querySelector('.card__images');
  const imageTemplate = cardClone.querySelector('.card__image-item');
  const imagePagination = cardClone.querySelector('.card__pagination-list');
  imagesContainer.innerHTML = '';
  imagePagination.innerHTML = '';

// Проверка на количество изображений
if (item.img.length > 1) {
  imagePagination.style.display = 'flex'; // Отобразить пагинацию
} else {
  imagePagination.style.display = 'none'; // Скрыть пагинацию
}

  item.img.forEach((imageSrc, index) => {
    const imageItemClone = imageTemplate.cloneNode(true);
    imageItemClone.setAttribute('data-index', index);

    const imgElement = imageItemClone.querySelector('img');
    imgElement.src = imageSrc;
    imgElement.alt = `${item.brand} ${item.model}`;

    // Обработчик событий для наведения на изображение
    imageItemClone.addEventListener('mouseenter', (evt) => {
      updatePagination(card, evt.currentTarget.dataset.index);
    });

    // Обработчик событий для ухода мыши с изображения
    imageItemClone.addEventListener('mouseleave', () => {
      resetPagination(card);
    });

    imagesContainer.appendChild(imageItemClone);

    const paginationItem = createPaginationItem(index);
    imagePagination.appendChild(paginationItem);
  });

  fillCardData(card, item);

  // Добавляем обработчики для кнопок попапов
  const btnPopup = cardClone.querySelector('.card__btn-popup');
  if (btnPopup) {
    btnPopup.addEventListener('click', () => openPopup(popupForm));
  }

  const btnInfo = cardClone.querySelector('.card__btn-info'); // Кнопка "Подробнее"
  if (btnInfo) {
    btnInfo.addEventListener('click', () => openPopupCard(item));
  }

  return cardClone;
}

updateCardsToShow(); // Устанавливаем количество карточек при загрузке

// Генерация карточек
if (cardsContainer) {
  cars.forEach((item) => {
    const cardClone = createCard(item);

    if (cardClone) {
      cardsContainer.appendChild(cardClone);
    }
  });
}

const filterTypeBtns = document.querySelectorAll('.type-else .filters__btn');
const mileageBtns = document.querySelectorAll('.type-car .filters__btn');

let selectedType = 'auto';
let selectedMileage = 'all';

// Генерация карточек
function renderCards(cards) {
  const existingCards = cardsContainer.querySelectorAll('.card');
  existingCards.forEach((card) => card.remove()); // Удаляем все карточки

  const visibleCards = cards.slice(0, cardsToShow); // Получаем карточки для отображения
  visibleCards.forEach((item) => {
    const cardClone = createCard(item);
    if (cardClone) {
      cardsContainer.appendChild(cardClone); // Добавляем карточку в контейнер
    }
  });

  // Проверяем, нужно ли скрыть кнопку "Показать еще"
  const btnLoadMore = document.querySelector('.cards__btn-else');
  if (cardsToShow >= cards.length) {
    btnLoadMore.style.display = 'none'; // Скрываем кнопку, если все карточки показаны
  } else {
    btnLoadMore.style.display = 'block'; // Показываем кнопку, если есть еще карточки
  }

  if (cards.length === 0) {
    emptyMessage.style.display = 'block'; // Показываем сообщение
  } else {
    emptyMessage.style.display = 'none'; // Скрываем сообщение
  }
}

// Функция для фильтрации и отображения карточек
function filterCars() {
  filteredCars = cars.filter((item) => {
    const mileageValue = item.mileage; // Получаем пробег в числовом формате

    const isTypeMatch = item.type === selectedType; // Сравниваем только с выбранным типом
    const isMileageMatch =
      (selectedMileage === 'new' && mileageValue === 0) ||
      (selectedMileage === 'run' && mileageValue > 0) ||
      selectedMileage === 'all';

    const isBrandMatch =
      selectedBrands.length === 0 || selectedBrands.includes(item.brand); // Проверяем марки

    // console.log('Year From:', yearFrom);
    // console.log('Year To:', yearTo);
    // console.log('Filtered Cars:', filteredCars);
    const itemYear = parseInt(item.year.replace(/\sг\.$/, ''), 10);

    const isYearMatch =
      (yearFrom === null || itemYear >= yearFrom) &&
      (yearTo === null || itemYear <= yearTo); // Проверяем год

    const isPriceMatch = item.price >= minPrice && item.price <= maxPrice;

    return (
      isTypeMatch &&
      isMileageMatch &&
      isBrandMatch &&
      isYearMatch &&
      isPriceMatch
    ); // Проверяем все условия
  });

  renderCards(filteredCars); // Отображаем отфильтрованные карточки
}

// Обработчик событий для фильтров
filterTypeBtns.forEach((btn) => {
  btn.addEventListener('click', (evt) => {
    selectedType = evt.currentTarget.getAttribute('data-type');
    updateCardsToShow(); // Сбрасываем количество карточек для отображения
    filterCars(); // Обновляем карточки в зависимости от выбранного типа

    resetButton.classList.add('active');
    resetButton.disabled = false; // Активируем кнопку
  });
});

// Обработчик событий для фильтров по пробегу
mileageBtns.forEach((btn) => {
  btn.addEventListener('click', (evt) => {
    selectedMileage = evt.currentTarget.getAttribute('data-drive'); // Получаем пробег из атрибута
    updateCardsToShow();; // Сбрасываем количество карточек для отображения
    filterCars(); // Обновляем карточки в зависимости от выбранного типа

    resetButton.classList.add('active');
    resetButton.disabled = false; // Активируем кнопку
  });
});

// Обработчик события для изменения размера окна
window.addEventListener('resize', () => {
  updateCardsToShow(); // Обновляем количество карточек
  renderCards(filteredCars); // Перерисовываем карточки с учетом нового количества
});

// Инициализация отображения карточек по умолчанию
filterCars(); // Отображаем все карточки по умолчанию

// Кнопка "Показать еще"
const btnLoadMore = document.querySelector('.cards__btn-else');

// Обработчик события для кнопки "Показать еще"
btnLoadMore.addEventListener('click', () => {
  cardsToShow += 6; // Увеличиваем количество карточек на 6 при каждом клике
  renderCards(filteredCars);
});

const resetButton = document.querySelector('.filters__btn-reset');
const filterInputs = document.querySelectorAll('.filter-input'); // Предполагается, что у вас есть класс для всех инпутов фильтров

// Функция для проверки, изменены ли фильтры
function checkFiltersChanged() {
  let filtersChanged = false;

  // Здесь логика для проверки, изменены ли фильтры
  filterInputs.forEach((input) => {
    if (
      input.value !== input.defaultValue ||
      parseInt(priceRange.value, 10) < parseInt(priceRange.max, 10)
    ) {
      filtersChanged = true;
    }
  });

    // Проверяем, есть ли выбранные бренды
    if (selectedBrands.length > 0) {
      filtersChanged = true;
    }

  // Включаем или отключаем кнопку сброса
  if (filtersChanged) {
    resetButton.classList.add('active');
    resetButton.disabled = false; // Активируем кнопку
  } else {
    resetButton.classList.remove('active');
    resetButton.disabled = true; // Деактивируем кнопку
  }
}

// Обработчик события для изменения фильтров
filterInputs.forEach((input) => {
  input.addEventListener('change', checkFiltersChanged);
  input.addEventListener('input', checkFiltersChanged); // Для текстовых полей
});

// Функция для сброса фильтров
function resetFilters() {
  // Сброс значений инпутов к значению по умолчанию
  filterInputs.forEach((input) => {
    input.value = input.defaultValue;
  });

  priceRange.value = priceRange.max; // Возвращаем максимальную цену
  maxPriceOutput.textContent = priceRange.max.toLocaleString('ru-RU'); // Обновляем отображение максимальной цены
  maxPrice = parseInt(priceRange.value, 10); // Обновляем переменную максимальной цены

  // Обновляем цвет трека ползунка
  const value = (priceRange.value - priceRange.min) / (priceRange.max - priceRange.min) * 100;
  priceRange.style.background = 'linear-gradient(to right, var(--red) ' + value + '%, #8A8A8A ' + value + '%)';

  // Сбрасываем выбранные марки
  selectedBrands = [];
  brandItems.forEach((item) => {
    item.classList.remove('selected'); // Убираем выделение у всех марок
  });
  
  titleAll.style.display = 'block';
  titleChoice.style.display = 'none';

  // Сбрасываем значения года
  yearFrom = null;
  yearTo = null;
  yearFromInput.value = ''; // Сбрасываем инпут года "от"
  yearToInput.value = ''; // Сбрасываем инпут года "до"

  // Сбрасываем тип и пробег
  selectedType = 'auto'; // Или значение по умолчанию для типа
  selectedMileage = 'all'; // Или значение по умолчанию для пробега

  // Сбрасываем активные классы у кнопок
  removeActiveClass(filtersBtnType);
  removeActiveClass(filtersBtnElse);

  filterTypeBtns.forEach((btn) => {
    if (btn.dataset.type === 'auto') {
      btn.classList.add('active');
    }
  });

  filterTypeBtns.forEach((btn) => {
    if (btn.dataset.type === 'auto') {
      btn.classList.add('active');
    }
  });

  mileageBtns.forEach((btn) => {
    if (btn.dataset.drive === 'all') {
      btn.classList.add('active');
    }
  });

  // Проверяем, нужно ли отключить кнопку сброса
  checkFiltersChanged();

  // Сбрасываем количество карточек для отображения
  updateCardsToShow();

  // Обновляем отображение карточек
  filterCars(); // Отображаем все карточки по умолчанию
}

// Обработчик события для кнопки сброса
resetButton.addEventListener('click', resetFilters);

// const minPriceRange = document.getElementById('min-price-range');
// const maxPriceRange = document.getElementById('max-price-range');
// const minPriceOutput = document.getElementById('min-price');
// const maxPriceOutput = document.getElementById('max-price');

// // Устанавливаем начальные значения
// minPriceOutput.textContent = minPriceRange.value;
// maxPriceOutput.textContent = maxPriceRange.value;

// // Обработчик события для обновления значений при перемещении ползунка минимальной цены
// minPriceRange.addEventListener('input', () => {
//   minPriceOutput.textContent = minPriceRange.value;

//   // Ограничиваем максимальный ползунок
//   if (parseInt(minPriceRange.value) > parseInt(maxPriceRange.value)) {
//     maxPriceRange.value = minPriceRange.value;
//     maxPriceOutput.textContent = maxPriceRange.value;
//   }
// });

// // Обработчик события для обновления значений при перемещении ползунка максимальной цены
// maxPriceRange.addEventListener('input', () => {
//   maxPriceOutput.textContent = maxPriceRange.value;

//   // Ограничиваем минимальный ползунок
//   if (parseInt(maxPriceRange.value) < parseInt(minPriceRange.value)) {
//     minPriceRange.value = maxPriceRange.value;
//     minPriceOutput.textContent = minPriceRange.value;
//   }
// });

function openPopupCard(carData) {
  const popup = document.querySelector('.popup-card');

  // Заполнение попапа данными о машине
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

 // Селектор для элемента с изображением
 const imageTemplate = popup.querySelector('.popup-card__slide');

 // Очистка предыдущих изображений
 const sliderWrapper = popup.querySelector('.popup-card__slider-wrapper');
 sliderWrapper.innerHTML = ''; // Очищаем предыдущие изображения

 // Добавление новых изображений
 carData.img.forEach((imageSrc) => {
     const slide = imageTemplate.cloneNode(true); // Клонируем существующий элемент

     const imgElement = slide.querySelector('img'); // Получаем img внутри клона
     imgElement.src = imageSrc; // Устанавливаем путь к изображению
     imgElement.alt = `${carData.brand} ${carData.model}`; // Устанавливаем атрибут alt

     sliderWrapper.appendChild(slide); // Добавляем клон в контейнер
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

  // Показать попап
  popup.classList.add('open');
  hideScroll();
}


const range = document.getElementById('price-range');
range.addEventListener('input', () => {
  const value = (range.value-range.min)/(range.max-range.min)*100;
  range.style.background = 'linear-gradient(to right, var(--red) ' + value + '%, #8A8A8A ' + value + '%)';
});