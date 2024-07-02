import "../pages/index.css";
import initialCards from "./cards.js";
import { createCard, deleteCard, handleLikeButton } from "../components/card.js";
import { openModal, closeModal } from "../components/modal.js";

// Объявляем переменные для всех DOM-элементов
const placesList = document.querySelector(".places__list");
const editProfileForm = document.querySelector(".popup_type_edit .popup__form");
const nameInput = editProfileForm.querySelector(".popup__input_type_name");
const jobInput = editProfileForm.querySelector(".popup__input_type_description");
const newCardAddButton = document.querySelector(".profile__add-button");
const newCardPopup = document.querySelector(".popup_type_new-card");
const newCardCloseButton = newCardPopup.querySelector(".popup__close");
const newCardForm = newCardPopup.querySelector(".popup__form");
const newCardNameInput = newCardForm.querySelector(".popup__input_type_name");
const newCardLinkInput = newCardForm.querySelector(".popup__input_type_link");
const cardsContainer = document.querySelector(".places__list");
const profileEditButton = document.querySelector(".profile__edit-button");
const profileEditPopup = document.querySelector(".popup_type_edit");
const profileEditCloseButton = profileEditPopup.querySelector(".popup__close");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = profileEditPopup.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileEditPopup.querySelector(".popup__input_type_description");
const cardPopup = document.querySelector(".popup_type_image");
const cardCloseButton = cardPopup.querySelector(".popup__close");
const imagePopup = document.querySelector(".popup_type_image");
const imageElement = imagePopup.querySelector(".popup__image");
const captionElement = imagePopup.querySelector(".popup__caption");

// Обработчик клика по изображению карточки для открытия попапа с изображением
function handleImageClick(cardData) {
  imageElement.src = cardData.link;
  imageElement.alt = cardData.name;
  captionElement.textContent = cardData.name;
  openModal(imagePopup);
}

// Обработчик события submit для формы редактирования профиля
function handleFormSubmit(evt) {
  evt.preventDefault();
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;
  profileTitle.textContent = nameValue;
  profileDescription.textContent = jobValue;
  closeModal(profileEditPopup);
}

editProfileForm.addEventListener("submit", handleFormSubmit);

initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, deleteCard, handleLikeButton, handleImageClick);
  placesList.appendChild(cardElement);
});

// Устанавливаем все необходимые обработчики событий
function setupEventListeners() {
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
