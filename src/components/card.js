// Функция для создания карточки
export function createCard(cardData, deleteCallback, likeCallback, imageClickCallback) {
  const cardTemplate = document.getElementById("card-template").content;
  const cardElement = cardTemplate.cloneNode(true).querySelector(".card");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", () => {
    deleteCallback(cardElement);
  });

  likeButton.addEventListener("click", () => {
    likeCallback(likeButton);
  });

  cardImage.addEventListener("click", () => {
    imageClickCallback(cardData);
  });

  return cardElement;
}

// Функция для удаления карточки
export function deleteCard(cardElement) {
  cardElement.remove();
}

// Функция для переключения состояния лайка
export function handleLikeButton(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}
