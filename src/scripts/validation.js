//validation

// Функция для показа ошибки валидации
function showInputError(formElement, inputElement, errorMessage, config) {
  const errorElement = formElement.querySelector(
    `.popup__input-error_type_${inputElement.name}`
  );
  if (errorElement) {
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
  }
}

// Функция для скрытия ошибки валидации
function hideInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(
    `.popup__input-error_type_${inputElement.name}`
  );
  if (errorElement) {
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.classList.remove(config.errorClass);
    errorElement.textContent = "";
  }
}

// Функция для склонения слов
function declOfNum(number, words) {
  return words[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? number % 10 : 5]
  ];
}

// Функция проверки валидности поля ввода
function checkInputValidity(formElement, inputElement, config) {
  if (!inputElement.validity.valid) {
    let errorMessage;

    if (inputElement.validity.valueMissing) {
      errorMessage = "Вы пропустили это поле.";
    } else if (
      inputElement.validity.typeMismatch &&
      inputElement.type === "url"
    ) {
      errorMessage = "Введите адрес сайта.";
    } else if (inputElement.validity.tooShort) {
      const wordForms = ["символ", "символа", "символов"];
      const word = declOfNum(inputElement.value.length, wordForms);
      errorMessage = `Минимальное количество символов: ${inputElement.minLength}. Длина текста сейчас: ${inputElement.value.length} ${word}.`;
    } else if (inputElement.validity.tooLong) {
      const wordForms = ["символ", "символа", "символов"];
      const word = declOfNum(inputElement.value.length, wordForms);
      errorMessage = `Максимальное количество символов: ${inputElement.maxLength}. Длина текста сейчас: ${inputElement.value.length} ${word}.`;
    } else if (inputElement.validity.patternMismatch) {
      errorMessage =
        "Разрешены только латинские и кириллические буквы, знаки дефиса и пробелы.";
    } else {
      errorMessage = inputElement.validationMessage;
    }

    showInputError(formElement, inputElement, errorMessage, config);
  } else {
    hideInputError(formElement, inputElement, config);
  }
}

// Функция установки слушателей событий на поля формы
function setEventListeners(formElement, config) {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
}

// Функция переключения состояния кнопки отправки формы
function toggleButtonState(inputList, buttonElement, config) {
  const isFormValid = inputList.every(
    (inputElement) => inputElement.validity.valid
  );
  buttonElement.classList.toggle(config.inactiveButtonClass, !isFormValid);
  buttonElement.disabled = !isFormValid;
}

// Функция включения валидации форм
export function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", function (evt) {
      evt.preventDefault();
    });

    setEventListeners(formElement, config);
  });
}

// Функция очистки ошибок валидации
export function clearValidation(formElement, config) {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config);
  });

  toggleButtonState(inputList, buttonElement, config);
}
