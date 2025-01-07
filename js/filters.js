let filteredCars = [];
let selectedBrands = [];

/*--------------------------- Фильтр по году -------------------------*/
let yearFrom = null; // Переменная для года "от"
let yearTo = null; // Переменная для года "до"
const yearFromInput = document.getElementById('year-from');
const yearToInput = document.getElementById('year-to');

/*-------------------- Фильтр с ценой --------------------------*/
const priceRange = document.getElementById('price-range');
const minPriceOutput = document.getElementById('min-price');
const maxPriceOutput = document.getElementById('max-price');
// Преобразуем значения в числа
let minPrice = parseInt(minPriceOutput.textContent.replace(/\s/g, ''), 10);
let maxPrice = parseInt(maxPriceOutput.textContent.replace(/\s/g, ''), 10);

/*-------------------------------- Сброс фильтров -----------------------------*/
const resetButton = document.querySelector('.filters__btn-reset');
const filterInputs = document.querySelectorAll('.filter-input');

/*------------------- Фильтр с кнопками пробег и тип --------------------------*/
const filterTypeBtns = document.querySelectorAll('.type-else .filters__btn');
const mileageBtns = document.querySelectorAll('.type-car .filters__btn');

let selectedType = 'auto';
let selectedMileage = 'all';

// Обработчик событий для фильтров по типу авто/мото
filterTypeBtns.forEach((btn) => {
  btn.addEventListener('click', (evt) => {
    selectedType = evt.currentTarget.getAttribute('data-type');
    updateCardsToShow();
    filterCars();

    resetButton.classList.add('active');
    resetButton.disabled = false;
  });
});

// Обработчик событий для фильтров по пробегу
mileageBtns.forEach((btn) => {
  btn.addEventListener('click', (evt) => {
    selectedMileage = evt.currentTarget.getAttribute('data-drive');
    updateCardsToShow();
    filterCars();

    resetButton.classList.add('active');
    resetButton.disabled = false;
  });
});

/*-------------------- Фильтр с ценой --------------------------*/
// const priceRange = document.getElementById('price-range');
// const minPriceOutput = document.getElementById('min-price');
// const maxPriceOutput = document.getElementById('max-price');
// // Преобразуем значения в числа
// let minPrice = parseInt(minPriceOutput.textContent.replace(/\s/g, ''), 10);
// let maxPrice = parseInt(maxPriceOutput.textContent.replace(/\s/g, ''), 10);


noUiSlider.create(priceRange, {
  start: [0, 15000000],
  connect: true,
  range: {
    'min': 0,
    'max': 15000000
  },
  step: 10000,
  format: {
    to: function (value) {
      return parseInt(value).toLocaleString('ru-RU'); // Форматируем значение
    },
    from: function (value) {
      return value.replace(/\s/g, ''); // Убираем пробелы для преобразования обратно
    }
  }
});


// Обработчик изменения значений ползунка
priceRange.noUiSlider.on('update', function (values, handle) {
  minPrice = parseInt(values[0].replace(/\s/g, ''), 10); // Обновляем глобальную переменную
  maxPrice = parseInt(values[1].replace(/\s/g, ''), 10); // Обновляем глобальную переменную

  minPriceOutput.textContent = minPrice.toLocaleString('ru-RU'); // Обновляем минимальную цену
  maxPriceOutput.textContent = maxPrice.toLocaleString('ru-RU'); // Обновляем максимальную цену

  // Вызовите ваши функции фильтрации, если это необходимо
  filterCars();
  checkFiltersChanged();
});



/*----------------------------- Фильтр со списком брендов -----------------------------*/
const headingFilters = document.querySelectorAll('.select-heading-js');
const brandItems = document.querySelectorAll('.filters__brand-item');
const titleAll = document.querySelector('.filters__current-title-all');
const titleChoice = document.querySelector('.filters__current-title-choice');

let isBrandListExpanded = false;

headingFilters.forEach((heading) => {
  heading.addEventListener('click', () => {
    const isOpen = heading.classList.contains('open');

    headingFilters.forEach((heading) => {
      heading.classList.remove('open');
      isBrandListExpanded = false;
    });

    if (!isOpen) {
      heading.classList.add('open');
      isBrandListExpanded = true;
    }

    if (isBrandListExpanded) {
      selectedBrandList.classList.remove('visible');
    } else {
      selectedBrandList.classList.add('visible');
    }
  });
});

brandItems.forEach((item) => {
  item.addEventListener('click', () => {
    const brand = item.getAttribute('data-brand');

    // Проверяем, выбрана ли уже марка
    if (selectedBrands.includes(brand)) {
      // Если марка уже выбрана, убираем её
      selectedBrands = selectedBrands.filter((b) => b !== brand);
      item.classList.remove('selected');
      removeBrandFromList(brand);
    } else {
      // Если марка не выбрана, добавляем её
      selectedBrands.push(brand);
      item.classList.add('selected');
      addBrandToList(brand);
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

// ---------  Дополнительный список карточек
const selectedBrandList = document.querySelector(
  '.filters__brand-list-selected'
);
// Функция для доб. бренда в список маленьких красных карточек
function addBrandToList(brand) {
  const brandItem = document.createElement('li');
  brandItem.classList.add('selected-brand');

  const brandName = document.createElement('p');
  brandName.classList.add('selected-brand__name');
  brandName.textContent = brand;

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.classList.add('selected-brand__del');

  deleteButton.innerHTML = `
    <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M3.55815 3.18594L0.966278 0.594692C0.937224 0.565637 0.914176 0.531143 0.898452 0.493181C0.882727 0.455219 0.874634 0.414532 0.874634 0.373442C0.874634 0.332352 0.882727 0.291664 0.898452 0.253702C0.914176 0.21574 0.937224 0.181247 0.966278 0.152192C0.995333 0.123137 1.02983 0.100089 1.06779 0.0843646C1.10575 0.0686402 1.14644 0.0605469 1.18753 0.0605469C1.22862 0.0605469 1.26931 0.0686402 1.30727 0.0843646C1.34523 0.100089 1.37972 0.123137 1.40878 0.152192L4.00003 2.74407L6.59128 0.152192C6.64996 0.0935124 6.72954 0.0605469 6.81253 0.0605469C6.89551 0.0605469 6.9751 0.0935124 7.03378 0.152192C7.09246 0.210871 7.12542 0.290457 7.12542 0.373442C7.12542 0.456427 7.09246 0.536013 7.03378 0.594692L4.4419 3.18594L7.03378 5.77719C7.09246 5.83587 7.12542 5.91546 7.12542 5.99844C7.12542 6.08143 7.09246 6.16101 7.03378 6.21969C6.9751 6.27837 6.89551 6.31134 6.81253 6.31134C6.72954 6.31134 6.64996 6.27837 6.59128 6.21969L4.00003 3.62782L1.40878 6.21969C1.3501 6.27837 1.27051 6.31134 1.18753 6.31134C1.10454 6.31134 1.02496 6.27837 0.966278 6.21969C0.907599 6.16101 0.874634 6.08143 0.874634 5.99844C0.874634 5.91546 0.907599 5.83587 0.966278 5.77719L3.55815 3.18594Z"
                              fill="white" />
                          </svg>
  `;

  // Обработчик для удаления бренда
  deleteButton.addEventListener('click', (event) => {
    event.stopPropagation();

    selectedBrands = selectedBrands.filter((b) => b !== brand);
    brandItem.remove(); // Удаляем элемент списка
    removeBrandFromList(brand); // Удаляем бренд из списка и интерфейса
    checkFiltersChanged();
    filterCars();
  });

  brandItem.appendChild(brandName);
  brandItem.appendChild(deleteButton);
  selectedBrandList.appendChild(brandItem);
}

// Функция для удаления бренда из списка красных карточек
function removeBrandFromList(brand) {
  const brandItems = selectedBrandList.querySelectorAll('.selected-brand');

  brandItems.forEach((item) => {
    const name = item.querySelector('.selected-brand__name').textContent;
    if (name === brand) {
      item.remove();
    }
  });

  // Удаляем класс selected у соответствующего элемента в раскрывающемся списке ???
  const brandListItems = document.querySelectorAll(
    '.filters__brand-list .brand-item'
  );
  brandListItems.forEach((listItem) => {
    if (listItem.getAttribute('data-brand') === brand) {
      listItem.classList.remove('selected');
    }
  });
}


/*--------------------------- Фильтр по году -------------------------*/
// let yearFrom = null; // Переменная для года "от"
// let yearTo = null; // Переменная для года "до"
// const yearFromInput = document.getElementById('year-from');
// const yearToInput = document.getElementById('year-to');

// Обработчик события для инпутов года
yearFromInput.addEventListener('input', () => {
  yearFrom = parseInt(yearFromInput.value, 10) || null;
  filterCars();
});

yearToInput.addEventListener('change', () => {
  yearTo = parseInt(yearToInput.value, 10) || null;
  filterCars();
});


/*--------------------------- Общая логика для фильтров -------------------------*/

// Функция для фильтрации и отображения карточек
function filterCars() {
  filteredCars = cars.filter((item) => {
    const mileageValue = item.mileage;

    // Сравниваем
    const isTypeMatch = item.type === selectedType;
    const isMileageMatch =
      (selectedMileage === 'new' && mileageValue === 0) ||
      (selectedMileage === 'run' && mileageValue > 0) ||
      selectedMileage === 'all';

    const isBrandMatch =
      selectedBrands.length === 0 || selectedBrands.includes(item.brand);

    const itemYear = parseInt(item.year.replace(/\sг\.$/, ''), 10);

    const isYearMatch =
      (yearFrom === null || itemYear >= yearFrom) &&
      (yearTo === null || itemYear <= yearTo);

      const itemPrice = item.price; // Предполагается, что item.price — это число
      const isPriceMatch = itemPrice >= minPrice && itemPrice <= maxPrice;

    // Проверяем все условия
    return (
      isTypeMatch &&
      isMileageMatch &&
      isBrandMatch &&
      isYearMatch && isPriceMatch);
  });

  renderCards(filteredCars);
}

filterCars();

// Отображение карточек в зависимости от окна
window.addEventListener('resize', () => {
  updateCardsToShow();
  renderCards(filteredCars);
});

/*-------------------------------- Сброс фильтров -----------------------------*/
// const resetButton = document.querySelector('.filters__btn-reset');
// const filterInputs = document.querySelectorAll('.filter-input');

// Функция для проверки, изменены ли фильтры
function checkFiltersChanged() {
  let filtersChanged = false;

  filterInputs.forEach((input) => {
    if (
      input.value !== input.defaultValue ||
      parseInt(minPriceOutput.textContent.replace(/\s/g, ''), 10) < parseInt(maxPriceOutput.textContent.replace(/\s/g, ''), 10)
    ) {
      filtersChanged = true;
    }
  });

  if (selectedBrands.length > 0) {
    filtersChanged = true;
  }

  // Включаем или отключаем кнопку сброса
  if (filtersChanged) {
    resetButton.classList.add('active');
    resetButton.disabled = false;
  } else {
    resetButton.classList.remove('active');
    resetButton.disabled = true;
  }
}

// Обработчик события для изменения фильтров
filterInputs.forEach((input) => {
  input.addEventListener('change', checkFiltersChanged);
  input.addEventListener('input', checkFiltersChanged);
});

// Функция для сброса фильтров
function resetFilters() {
  filterInputs.forEach((input) => {
    input.value = input.defaultValue;
  });
 // Возвращаем максимальную цену
 priceRange.noUiSlider.set([0, 15000000]); // Сбрасываем слайдер на начальные значения
 minPriceOutput.textContent = '0'; // Обновляем отображение минимальной цены
 maxPriceOutput.textContent = '15 000 000'; // Обновляем отображение максимальной цены

  selectedBrands = [];
  brandItems.forEach((item) => {
    item.classList.remove('selected');
  });

   // Очищаем список выбранных мини-брендов
   selectedBrandList.innerHTML = ''; 

  titleAll.style.display = 'block';
  titleChoice.style.display = 'none';

  // Сбрасываем значения года
  yearFrom = null;
  yearTo = null;
  yearFromInput.value = '';
  yearToInput.value = '';

  // Сбрасываем тип и пробег
  selectedType = 'auto';
  selectedMileage = 'all';

  // Сбрасываем активные классы у кнопок
  removeActiveClass(filtersBtnType);
  removeActiveClass(filtersBtnElse);

  // Добавляем кнопкам активные классы
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

  checkFiltersChanged();
  updateCardsToShow();
  filterCars();
}

// Обработчик события для кнопки сброса
resetButton.addEventListener('click', resetFilters);