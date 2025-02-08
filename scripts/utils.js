// utils.js

function createElement(elName, content, attrs = {}) {
  const el = document.createElement(elName);
  for (const key in attrs) {
      el.setAttribute(key, attrs[key]);
  }

  if (typeof content === "string") {
      el.innerHTML = content;
  }

  if (content instanceof HTMLElement) {
      el.appendChild(content);
  }

  return el;
}

function $(selector) {
  var selectorType = 'querySelectorAll';
  if (selector.indexOf('#') === 0) {
      selectorType = 'querySelector';
  }

  if (selector.indexOf('.') === 0) {
    selectorType = 'querySelectorAll';
    const items = document[selectorType](selector)
    if (items.length === 1) {
      selectorType = 'querySelector';
    }
  }

  return document[selectorType](selector);
}

function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function saveOnKeyup(e) {
  const cardId = e.target.id;

  window.cardsStore.update(
    item => item['id'] === parseInt(cardId),
    item => ({ ...item, content: e.detail.text })
  );
}

function deleteCard(e) {
  const cardId = e.target.id;
  window.cardsStore.remove(item => item['id'] === parseInt(cardId));
}


function addDragStartAndEndEvents(card) {
  card.addEventListener('dragstart', () => {
    // card.classList.add('is-dragging');
    card.setAttribute('is-dragging', true);
  });
  card.addEventListener('dragend', () => {
    // card.classList.remove('is-dragging');
    card.setAttribute('is-dragging', false);
  })
}


function getCurrentDateFormatted() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = now.getFullYear();

  return `${day}-${month}-${year}`;
}

const STATUS_TYPES = {
  TODO: 'todo',
  IN_PROGRESS: 'inprogress',
  DONE: 'done',
}

export { createElement, $, debounce, saveOnKeyup, deleteCard, addDragStartAndEndEvents, getCurrentDateFormatted, STATUS_TYPES };
