// card.js

function createCard(
  cardData,
  deleteCallback,
  likeCallback,
  imageClickCallback,
  userId
) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCounter = cardElement.querySelector(".card__like-counter");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCounter.textContent = cardData.likes.length;

  if (cardData.owner._id !== userId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () =>
      deleteCallback(cardElement, cardData._id)
    );
  }

  likeButton.classList.toggle(
    "card__like-button_is-active",
    cardData.likes.some((like) => like._id === userId)
  );
  likeButton.addEventListener("click", () =>
    likeCallback(cardElement, cardData._id)
  );
  cardImage.addEventListener("click", () => imageClickCallback(cardData));

  return cardElement;
}

export { createCard };
