import { createLocalStore } from './local-storage.js';
const cardsStore = createLocalStore('cards');
window.cardsStore = cardsStore;
