import { $, createElement, debounce, saveOnKeyup, deleteCard, addDragStartAndEndEvents, getCurrentDateFormatted, STATUS_TYPES } from './utils.js';

const addbtn = $('.add-card-btn');
const todoColumn = $('.todo');

addbtn.addEventListener('click', () => {
  const newCardData = {
    content: 'No mames.',
    draggable: true,
    status: STATUS_TYPES.TODO,
    id: Date.now(),
    created: getCurrentDateFormatted(),
    started: null,
    done: null,
  }
  // create new card element
  const newCard = createElement('kb-card', newCardData.content, newCardData);

  // append card to column
  const firstCard = todoColumn.querySelector('.card');
  if (firstCard) {
    todoColumn.insertBefore(newCard, firstCard);
  } else {
    todoColumn.appendChild(newCard);
  }

  newCard.focus();
  newCard.addEventListener('text-changed', debounce(saveOnKeyup));
  newCard.addEventListener('card-deleted', deleteCard);

  // add card data to store
  window.cardsStore.add(newCardData);
  // add drag events
  addDragStartAndEndEvents(newCard);

});
