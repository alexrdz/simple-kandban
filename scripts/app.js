import { createElement, $, saveOnKeyup, deleteCard, addDragStartAndEndEvents, getCurrentDateFormatted, STATUS_TYPES } from './utils.js';
import './stores.js';
import { initDrag } from './drag.js';
import './add.js';
import '../components/kb-card.js';

document.addEventListener('DOMContentLoaded', () => {
  const cardsData = window.cardsStore.getAll() ?? [];
  const todoColumn = $('.todo');
  const inprogressColumn = $('.inprogress');
  const doneColumn = $('.done');

  if (!cardsData || cardsData.length === 0) {
    return
  }

  cardsData.forEach(card => {
    const cardEl = createElement('kb-card', '', {
      draggable: true,
      status: card['status'],
      id: card['id'],
      content: card.content,
      created: getCurrentDateFormatted(),
      started: card.started,
      done: card.done,
    });

    // add to correct column
    if (card['status'] === STATUS_TYPES.TODO) {
      todoColumn.appendChild(cardEl);
    } else if (card['status'] === STATUS_TYPES.IN_PROGRESS) {
      inprogressColumn.appendChild(cardEl);
    } else if (card['status'] === STATUS_TYPES.DONE) {
      doneColumn.appendChild(cardEl);
    }

    // save on keyup
    cardEl.addEventListener('text-changed', saveOnKeyup);

    cardEl.addEventListener('card-deleted', deleteCard);

    // add drag start and end events
    addDragStartAndEndEvents(cardEl);
  });

  initDrag();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js")
    .then(() => console.log("Service Worker registered"))
    .catch((error) => console.log("Service Worker registration failed:", error));
}
