import { $, STATUS_TYPES, addDragStartAndEndEvents, getCurrentDateFormatted } from './utils.js';



function initDrag() {
  const draggables = $('kb-card');

  if (draggables.length) {
    draggables.forEach(card => {
      addDragStartAndEndEvents(card);
    });
  }
}


const dropzones = $('.column');
dropzones.forEach(zone => {
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    const cardBeneath = getCardBeneath(zone, e.clientY);
    const currentCard = document.querySelector('[is-dragging]');

    if (!cardBeneath) {
      zone.appendChild(currentCard);
    } else {
      zone.insertBefore(currentCard, cardBeneath);
    }
  });

  zone.addEventListener('dragend', e => {
    e.preventDefault();
    const currentCard = document.querySelector('[is-dragging]');

    let cardData = {
      content: currentCard.content,
      draggable: true,
      ['status']: currentCard.status,
      ['id']: currentCard.id,
      created: currentCard.created,
      started: currentCard.started,
      done: currentCard.done
    }

    cardData = {...cardData, ['status']: zone.dataset.status};
    let started = {};
    if (zone.dataset.status === STATUS_TYPES.IN_PROGRESS) {
      started = { ['started']: getCurrentDateFormatted() };
    }

    let done = {};
    if (zone.dataset.status === STATUS_TYPES.DONE) {
      done = { ['done']: getCurrentDateFormatted() };
    }

    window.cardsStore.update(
      item => item['id'] === parseInt(currentCard.id),
      item => ({ ...item, ...started, ...done, ['status']: zone.dataset.status })
    );

    currentCard.setAttribute('status', zone.dataset.status);

    if (zone.dataset.status === STATUS_TYPES.IN_PROGRESS) {
      console.log('%chey', 'background-color: #121212; color: limegreen; padding: .5rem', started.started);
      currentCard.setAttribute('started', started.started);
    }
    if (zone.dataset.status === STATUS_TYPES.DONE) {
      console.log('%cdone', 'background-color: #121212; color: limegreen; padding: .5rem', done.done);
      currentCard.setAttribute('done', done.done);
    }
  });
});


function getCardBeneath(zone, mouseY) {
  const cards = zone.querySelectorAll('kb-card:not(is-dragging)');
  let closestCard = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  cards.forEach(card => {
    const { top } = card.getBoundingClientRect();
    const offset = mouseY - top;

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestCard = card;
    }

  });
  return closestCard;
}

export { initDrag };
