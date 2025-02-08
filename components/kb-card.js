const template = document.querySelector('template');

class KbCard extends HTMLElement {
  static get observedAttributes() {
    return [ 'status', 'id', 'content', 'is-dragging', 'created', 'started', 'done' ];
  }

  constructor() {
    super();
    // attach Shadow DOM to the parent element.
    // save the shadowRoot in a property because, if you create your shadow DOM in closed mode,
    // you have no access from outside
    const shadowRoot = this.attachShadow({mode: 'closed'});
    // clone template content nodes to the shadow DOM
    shadowRoot.appendChild(template.content.cloneNode(true));

    // get the editable div
    this.editableDiv = shadowRoot.querySelector('div');
    this.editableDiv.innerHTML = this.getAttribute('content');
    this.editableDiv.addEventListener('input', this.handleInput.bind(this));

    // delete button
    this.deleteBtn = shadowRoot.querySelector('.btn-delete');
    this.deleteBtn.addEventListener('click', this.handleDelete.bind(this));

    // footer
    this.footer = shadowRoot.querySelector('footer');
  }

  setDateAttributes(name, value) {
    console.log('%cvalue', 'background-color: #121212; color: limegreen; padding: .5rem', value);
    const pEl = document.createElement('p');
    const timeEl = document.createElement('time');

    if (name === 'created') {
      pEl.textContent = `Created: `;
      timeEl.setAttribute('datetime', this.created);
      timeEl.textContent = this.created;
    }

    if (name === 'started') {
      pEl.textContent = `Started: `;
      if (this.started) {
        timeEl.setAttribute('datetime', this.started);
        timeEl.textContent = this.started;
      }
    }

    if (name === 'done') {
      pEl.textContent = `done: `;
      if (this.done) {
        timeEl.setAttribute('datetime', this.done);
        timeEl.textContent = this.done;
      }
    }

    pEl.appendChild(timeEl);
    this.footer.appendChild(pEl);
  }

  handleInput(event) {
    const text = event.target.innerHTML; // Get the text content

    // Dispatch a custom event (recommended):
    const inputEvent = new CustomEvent('text-changed', {
      detail: { text },
      bubbles: true, // Allow the event to bubble up the DOM
      composed: true // Important for Shadow DOM! Allows event to cross boundary
    });
    this.dispatchEvent(inputEvent);

    // Or, if you need to access it directly from outside (less recommended):
    this.content = text; // Store it as a property of the component
  }

  handleDelete(e) {
    this.remove();

    // Dispatch a custom event (recommended):
    const deleteEvent = new CustomEvent('card-deleted', {
      bubbles: true, // Allow the event to bubble up the DOM
      composed: true // Important for Shadow DOM! Allows event to cross boundary
    });
    this.dispatchEvent(deleteEvent);
  }

  connectedCallback() {
    this.draggable = 'true';
    this['is-dragging'] = false;

    if (!this.status) {
        // Set default value to 'todo'
        this.status = 'todo';
    }

    this.content = this.getAttribute('content');

    this.created = this.getAttribute('created');
    this.started = this.getAttribute('started');
    this.done = this.getAttribute('done');

    this.editableDiv.focus();
}


  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) {
      this[name] = newVal;
      if (name === 'created' || name === 'started' || name === 'done') {
        if (!newVal || newVal === 'null') return
        this.setDateAttributes(name, newVal);
      }
    }
  }


}

let cardStyles = null;
fetch('./components/kb-card.css').then(res => res.text()).then(css => {
  cardStyles = document.createElement('style');
  cardStyles.innerHTML = css;
  template.content.insertBefore(cardStyles, template.content.firstChild);

  // Register the CurrentDate component using the tag name <kb-card>.
  customElements.define('kb-card', KbCard);
});
