import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// Accepts content and adds it to the database
export const putDb = async (content) => {
  console.log('PUT to the database');

  const contentDb = await openDB('jate', 1);

  const tx = contentDb.transaction('jate', 'readwrite');

  const store = tx.objectStore('jate');

  const request = store.put({ id: 1, text: content });

  const result = await request;
  console.log('Data saved to the database', result);
};

// Gets all the content from the database
export const getDb = async () => {
  console.log('GET from the database');

  const contentDb = await openDB('jate', 1);

  const tx = contentDb.transaction('jate', 'readonly');

  const store = tx.objectStore('jate');

  const request = store.get(1);

  const result = await request;
  console.log('result.value', result);

  const { text } = result;

  return text;
};

initdb();
