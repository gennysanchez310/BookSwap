export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyBCevKce78f1CrhbZ6sF-gp-JVNXnO5Log",
    authDomain: "bookswap-web.firebaseapp.com",
    projectId: "bookswap-web",
    storageBucket: "bookswap-web.firebasestorage.app",
    messagingSenderId: "310107147673",
    appId: "1:310107147673:web:8f69f463dc00c0f4ce1708"
  },
  apiEndpoints: {
    googleBooks: 'https://www.googleapis.com/books/v1/volumes?q=isbn=',
    openStreetMap: 'https://nominatim.openstreetmap.org/search?format=json&q=',
    dicebearAvatar: 'https://api.dicebear.com/7.x/micah/svg?seed='
  }
};