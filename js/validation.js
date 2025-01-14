/* --------------------- Валидация формы --------------------- */
const formErrorElement = Array.from(document.querySelectorAll('.empty-error'));
const helpText = document.querySelector('.text-form-help');

// Функция, которая добавляет класс с ошибкой
const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add('input_type_error');
  errorElement.textContent = errorMessage;
  errorElement.classList.add('input-error_active');
};

// Функция, которая удаляет класс с ошибкой
const hideInputError = (formElement, inputElement) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove('input_type_error');
  errorElement.classList.remove('input-error_active');
  errorElement.textContent = '';
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add('btn_inactive');
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove('btn_inactive');
    // Удаляем текст ошибки
    formErrorElement.forEach((err) => {
      err.textContent = '';
    });
  }
};

// Функция, которая проверяет валидность поля
const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    formErrorSubmit();
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
    formErrorElement.forEach((err) => {
      err.textContent = '';
    });
  }
};

function checkInputValidityCustom(inputElement) {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }
}

const setEventListeners = (formElement) => {
  const inputList = Array.from(
    formElement.querySelectorAll('.input-validation')
  );
  const buttonElement = formElement.querySelector('.btn-validation');
  toggleButtonState(inputList, buttonElement);

  buttonElement.addEventListener('click', () => {
    let isValidForm = true;

    inputList.forEach((inputElement) => {
      if (!inputElement.validity.valid) {
        isValidForm = false;
      }
    });

    if (isValidForm) {
      // Получаем значения полей из текущей формы
      let $name = formElement.querySelector('.input-name').value;
      let $phone = formElement.querySelector('.input-phone').value;
      let $email = formElement.querySelector('.input-email').value;

      let sendData = JSON.stringify({
        name: $name,
        phone: $phone,
        email: $email,
      });

      fetch('../php/send.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: sendData,
      })
        .then((response) => response.text())
        .then((sendData) => {
          console.log('Успех');
          closePopup(popupForm);
          popupSuccess.classList.add('open');
          // document.body.style.overflowY = 'auto';
          hideScroll();
          resetErrorMessage(formElement);
        })
        .catch((error) => {
          formErrorSubmit();
          console.error('Error:', error);
        });
    }
  });

  formElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    toggleButtonState(inputList, buttonElement);
    formErrorElement.forEach((err) => {
      err.textContent = '';
    });
  });

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidityCustom(inputElement);
      checkInputValidity(formElement, inputElement);
      checkValidationPhone(inputElement);
      toggleButtonState(inputList, buttonElement);

      helpText.style.display = 'none';
    });
  });
};

const enableValidation = () => {
  const formList = Array.from(document.querySelectorAll('.form'));
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', function (evt) {
      evt.preventDefault();
    });

    resetErrorMessage(formElement);
    setEventListeners(formElement);
  });
};

enableValidation();

function formErrorSubmit() {
  const errorMessage = 'Заполните все поля для отправки формы.';
  formErrorElement.forEach((err) => {
    err.textContent = errorMessage;
  });
}

function resetErrorMessage(formElement) {
  const inputList = Array.from(
    formElement.querySelectorAll('.input-validation')
  );

  inputList.forEach((inputElement) => {
    inputElement.value = '';
    hideInputError(formElement, inputElement);
  });

  formErrorElement.forEach((err) => {
    err.textContent = '';
  });
}

/* --------------------- Telephone number mask --------------------- */
const inputPhone = Array.from(document.querySelectorAll('.input-phone'));
const phoneErrors = Array.from(document.querySelectorAll('.tel-err'));

// слушатель для всех input
inputPhone.forEach((item) => {
  item.addEventListener('input', () => {
    IMask(item, {
      mask: '+7(000) 000-00-00',
    });
  });
});

function checkValidationPhone(inputElement) {
  const trimmedPhone = inputElement.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
  const phonePattern = /^[0-9]{11}$/; // Проверяем на 11 цифр

  if (!phonePattern.test(trimmedPhone)) {
    phoneErrors.forEach((err) => {
      err.textContent = 'Некорректный номер телефона';
    });
  } else {
    phoneErrors.forEach((err) => {
      err.textContent = '';
    });
  }
}
