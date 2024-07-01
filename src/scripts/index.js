import "../pages/index.css"; // Импортируем стили для главной страницы
import initialCards from "./cards.js"; // Импортируем массив начальных карточек из отдельного модуля
import { createCard, deleteCard, handleLikeButton } from "../components/card.js";
import { openModal, closeModal } from "../components/modal.js";

// Обработчик клика по изображению карточки для открытия попапа с изображением
function handleImageClick(cardData) {
  const imagePopup = document.querySelector(".popup_type_image");
  const imageElement = imagePopup.querySelector(".popup__image");
  const captionElement = imagePopup.querySelector(".popup__caption");

  imageElement.src = cardData.link;
  imageElement.alt = cardData.name;
  captionElement.textContent = cardData.name;

  openModal(imagePopup);
}

// Обработчик события submit для формы редактирования профиля
const formElement = document.querySelector(".popup_type_edit .popup__form");
const nameInput = formElement.querySelector(".popup__input_type_name");
const jobInput = formElement.querySelector(".popup__input_type_description");

function handleFormSubmit(evt) {
  evt.preventDefault();
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;

  const profileTitle = document.querySelector(".profile__title");
  const profileDescription = document.querySelector(".profile__description");

  profileTitle.textContent = nameValue;
  profileDescription.textContent = jobValue;

  closeModal(document.querySelector(".popup_type_edit"));
}

formElement.addEventListener("submit", handleFormSubmit);

const placesList = document.querySelector(".places__list");
initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, deleteCard, handleLikeButton, handleImageClick);
  placesList.appendChild(cardElement);
});

// Устанавливаем все необходимые обработчики событий
function setupEventListeners() {
  const newCardAddButton = document.querySelector(".profile__add-button");
  const newCardPopup = document.querySelector(".popup_type_new-card");
  const newCardCloseButton = newCardPopup.querySelector(".popup__close");
  const newCardForm = newCardPopup.querySelector(".popup__form");
  const newCardNameInput = newCardForm.querySelector(".popup__input_type_card-name");
  const newCardLinkInput = newCardForm.querySelector(".popup__input_type_url");
  const cardsContainer = document.querySelector(".places__list");

  newCardAddButton.addEventListener("click", () => openModal(newCardPopup));
  newCardCloseButton.addEventListener("click", () => closeModal(newCardPopup));
  newCardPopup.addEventListener("click", (event) => {
    if (event.target === newCardPopup) {
      closeModal(newCardPopup);
    }
  });

  newCardForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = newCardNameInput.value;
    const link = newCardLinkInput.value;
    const newCard = createCard({ name, link }, deleteCard, handleLikeButton, handleImageClick);
    cardsContainer.prepend(newCard);
    closeModal(newCardPopup);
    newCardForm.reset();
  });

  const profileEditButton = document.querySelector(".profile__edit-button");
  const profileEditPopup = document.querySelector(".popup_type_edit");
  const profileEditCloseButton = profileEditPopup.querySelector(".popup__close");
  const profileTitle = document.querySelector(".profile__title");
  const profileDescription = document.querySelector(".profile__description");
  const profileTitleInput = profileEditPopup.querySelector(".popup__input_type_name");
  const profileDescriptionInput = profileEditPopup.querySelector(".popup__input_type_description");

  profileEditButton.addEventListener("click", () => {
    profileTitleInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
    openModal(profileEditPopup);
  });

  profileEditCloseButton.addEventListener("click", () => closeModal(profileEditPopup));
  profileEditPopup.addEventListener("click", (event) => {
    if (event.target === profileEditPopup) {
      closeModal(profileEditPopup);
    }
  });

  const cardPopup = document.querySelector(".popup_type_image");
  const cardCloseButton = cardPopup.querySelector(".popup__close");

  cardCloseButton.addEventListener("click", () => closeModal(cardPopup));
  cardPopup.addEventListener("click", (event) => {
    if (event.target === cardPopup) {
      closeModal(cardPopup);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const popups = document.querySelectorAll('.popup');
  popups.forEach(popup => {
    popup.classList.add('popup_is-animated');
  });
  setupEventListeners();
});
