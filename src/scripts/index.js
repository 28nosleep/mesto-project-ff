import "../pages/index.css";
import { createCard, handleLikeButton } from "../components/card.js";
import { openModal, closeModal } from "../components/modal.js";
import { enableValidation, clearValidation } from "./validation.js";
import {
  getInitialCards,
  getUserInfo,
  updateUserProfile,
  addNewCard,
  deleteCard as deleteCardApi,
  addLike,
  removeLike,
  updateAvatar,
} from "./api.js";

// DOM-элементы
const placesList = document.querySelector(".places__list");
const editProfileForm = document.querySelector(".popup_type_edit .popup__form");
const newCardForm = document.querySelector(".popup_type_new-card .popup__form");
const profileEditButton = document.querySelector(".profile__edit-button");
const newCardAddButton = document.querySelector(".profile__add-button");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const imagePopup = document.querySelector(".popup_type_image");
const imageElement = imagePopup.querySelector(".popup__image");
const captionElement = imagePopup.querySelector(".popup__caption");
const deleteConfirmPopup = document.querySelector(".popup_type_confirm");
const avatarEditButton = document.querySelector(".profile__avatar-button");
const avatarEditForm = document.querySelector(
  ".popup_type_avatar .popup__form"
);
const profileAvatar = document.querySelector(".profile__image");

// Глобальные переменные
let currentUserId;

// Объект конфигурации для валидации форм
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// Функция для обработки клика по изображению карточки
function handleImageClick(cardData) {
  imageElement.src = cardData.link;
  imageElement.alt = cardData.name;
  captionElement.textContent = cardData.name;
  openModal(imagePopup);
}

// Функция для обработки отправки формы редактирования профиля
// Функция для обработки отправки формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const nameInput = editProfileForm.querySelector(".popup__input_type_name");
  const jobInput = editProfileForm.querySelector(
    ".popup__input_type_description"
  );
  const submitButton = editProfileForm.querySelector(".popup__button");
  const originalButtonText = submitButton.textContent;

  submitButton.textContent = "Сохранение...";
  submitButton.disabled = true;

  updateUserProfile(nameInput.value, jobInput.value)
    .then((updatedUser) => {
      profileTitle.textContent = updatedUser.name;
      profileDescription.textContent = updatedUser.about;
      closeModal(evt.target.closest(".popup"));
    })
    .catch((err) => {
      console.error(`Ошибка при обновлении профиля: ${err}`);
    })
    .finally(() => {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      clearValidation(evt.target, validationConfig);
    });
}

// Функция для обработки отправки формы добавления новой карточки
function handleNewCardFormSubmit(evt) {
  evt.preventDefault();
  const nameInput = newCardForm.querySelector(".popup__input_type_card-name");
  const linkInput = newCardForm.querySelector(".popup__input_type_url");
  const submitButton = newCardForm.querySelector(".popup__button");
  const originalButtonText = submitButton.textContent;

  submitButton.textContent = "Сохранение...";
  submitButton.disabled = true;

  addNewCard(nameInput.value, linkInput.value)
    .then((newCardData) => {
      const newCard = createCardElement(newCardData);
      placesList.prepend(newCard);
      evt.target.reset();
      closeModal(evt.target.closest(".popup"));
    })
    .catch((err) => {
      console.error(`Ошибка при добавлении новой карточки: ${err}`);
    })
    .finally(() => {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      clearValidation(evt.target, validationConfig);
    });
}

// Функция для обработки удаления карточки
function handleDeleteCard(cardElement, cardId) {
  const confirmButton = deleteConfirmPopup.querySelector(
    ".popup__button_type_confirm"
  );
  const cancelButton = deleteConfirmPopup.querySelector(
    ".popup__button_type_cancel"
  );
  const originalButtonText = confirmButton.textContent;

  function confirmDelete() {
    confirmButton.textContent = "Удаление...";
    confirmButton.disabled = true;

    deleteCardApi(cardId)
      .then(() => {
        cardElement.remove();
        closeModal(deleteConfirmPopup);
      })
      .catch((err) => {
        console.error(`Ошибка при удалении карточки: ${err}`);
      })
      .finally(() => {
        confirmButton.textContent = originalButtonText;
        confirmButton.disabled = false;
      });
  }

  function cancelDelete() {
    closeModal(deleteConfirmPopup);
  }

  openModal(deleteConfirmPopup);

  confirmButton.addEventListener("click", confirmDelete, { once: true });
  cancelButton.addEventListener("click", cancelDelete, { once: true });
}

// Функция для обработки лайка карточки
function handleLikeCard(cardElement, cardId) {
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCounter = cardElement.querySelector(".card__like-counter");
  const isLiked = likeButton.classList.contains("card__like-button_is-active");

  const likeAction = isLiked ? removeLike : addLike;

  likeAction(cardId)
    .then((updatedCard) => {
      likeButton.classList.toggle("card__like-button_is-active");
      likeCounter.textContent = updatedCard.likes.length;
    })
    .catch((err) => {
      console.error(`Ошибка при обновлении лайка: ${err}`);
    });
}

// Функция для обработки отправки формы обновления аватара
function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const linkInput = avatarEditForm.querySelector(
    ".popup__input_type_avatar-url"
  );
  const submitButton = avatarEditForm.querySelector(".popup__button");
  const originalButtonText = submitButton.textContent;

  submitButton.textContent = "Сохранение...";
  submitButton.disabled = true;

  updateAvatar(linkInput.value)
    .then((updatedUser) => {
      profileAvatar.style.backgroundImage = `url(${updatedUser.avatar})`;
      closeModal(evt.target.closest(".popup"));
    })
    .catch((err) => {
      console.error(`Ошибка при обновлении аватара: ${err}`);
    })
    .finally(() => {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      clearValidation(evt.target, validationConfig);
    });
}

// Функция для настройки обработчиков событий
function setupEventListeners() {
  newCardAddButton.addEventListener("click", () => {
    newCardForm.reset();
    clearValidation(newCardForm, validationConfig);
    openModal(newCardForm.closest(".popup"));
  });

  profileEditButton.addEventListener("click", () => {
    const nameInput = editProfileForm.querySelector(".popup__input_type_name");
    const jobInput = editProfileForm.querySelector(
      ".popup__input_type_description"
    );
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
    clearValidation(editProfileForm, validationConfig);
    openModal(editProfileForm.closest(".popup"));
  });

  avatarEditButton.addEventListener("click", () => {
    avatarEditForm.reset();
    clearValidation(avatarEditForm, validationConfig);
    openModal(avatarEditForm.closest(".popup"));
  });

  document.addEventListener("click", (event) => {
    if (
      event.target.classList.contains("popup_opened") ||
      event.target.classList.contains("popup__close")
    ) {
      closeModal(event.target.closest(".popup"));
    }
  });

  editProfileForm.addEventListener("submit", handleProfileFormSubmit);
  newCardForm.addEventListener("submit", handleNewCardFormSubmit);
  avatarEditForm.addEventListener("submit", handleAvatarFormSubmit);
}

// Функция для отрисовки карточек
function renderCards(cards) {
  cards.forEach((cardData) => {
    const cardElement = createCardElement(cardData);
    placesList.appendChild(cardElement);
  });
}

// Функция создания карточки
function createCardElement(cardData) {
  return createCard(
    cardData,
    handleDeleteCard,
    handleLikeCard,
    handleImageClick,
    currentUserId
  );
}

// Инициализация приложения
function initializeApp() {
  document.querySelectorAll(".popup").forEach((popup) => {
    popup.classList.add("popup_is-animated");
  });

  setupEventListeners();
  enableValidation(validationConfig);

  Promise.all([getUserInfo(), getInitialCards()])
    .then(([userData, cards]) => {
      currentUserId = userData._id;
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      profileAvatar.src = userData.avatar;
      renderCards(cards);
    })
    .catch((err) => {
      console.error(`Ошибка при инициализации приложения: ${err}`);
    });
}

// Запуск инициализации после загрузки DOM
document.addEventListener("DOMContentLoaded", initializeApp);
