// modal.js

// Функция для открытия модального окна
export function openModal(modal) {
  modal.classList.add("popup_is-opened");
  document.addEventListener("keydown", handleEscKey);
  modal.addEventListener("mousedown", handleOverlayClick);
}

// Функция для закрытия модального окна
export function closeModal(modal) {
  modal.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", handleEscKey);
  modal.removeEventListener("mousedown", handleOverlayClick);
}

// Обработчик нажатия клавиши Esc
function handleEscKey(event) {
  if (event.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

// Обработчик клика на оверлей
function handleOverlayClick(event) {
  if (event.target === event.currentTarget) {
    closeModal(event.target);
  }
}

// Функция для установки слушателей на все попапы
export function setEventListeners() {
  const popups = document.querySelectorAll('.popup');
  popups.forEach((popup) => {
    popup.addEventListener('mousedown', (evt) => {
      if (evt.target.classList.contains('popup_is-opened')) {
        closeModal(popup);
      }
      if (evt.target.classList.contains('popup__close')) {
        closeModal(popup);
      }
    });
  });
}