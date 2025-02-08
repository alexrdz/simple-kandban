// jsDoc
/**
 *
 * @param {string} key
 * @returns {function(): T[], function(T[]): void}  storage functions
 *
 */
export function createLocalStore(key) {
  const get = () => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  };
  const save = (data) => localStorage.setItem(key, JSON.stringify(data));

  return {
    add(item) {
      const items = get();
      items.push(item);
      save(items);
    },
    remove(predicate) {
      const items = get().filter(item => !predicate(item));
      save(items);
    },
    update(predicate, updater) {
      const items = get().map(item => predicate(item) ? updater(item) : item);
      save(items);
    },
    getAll() {
      return get();
    }
  };
}

/* Usage Example:
const itemsStore = createLocalStore('items');

itemsStore.add({ id: 1, name: 'Item One' });

itemsStore.update(
  item => item.id === 1,
  item => ({ ...item, name: 'Updated Item One' })
);

itemsStore.remove(item => item.id === 1);

console.log(itemsStore.getAll());
*/
