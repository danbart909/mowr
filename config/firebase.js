import { initializeApp } from 'firebase/app';
// import { getFirestore } from "firebase/firestore"
// import { getAuth } from "firebase/auth"
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId
};

const firebase = initializeApp(firebaseConfig);

// const db = getFirestore(app)
// const auth = getAuth(app)

export default firebase;







// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDtMcXulIJek3tTpWLA4GzoNOkOBlwtFtw",
//   authDomain: "mowr-5a6e9.firebaseapp.com",
//   databaseURL: "https://mowr-5a6e9.firebaseio.com",
//   projectId: "mowr-5a6e9",
//   storageBucket: "mowr-5a6e9.appspot.com",
//   messagingSenderId: "919333742989",
//   appId: "1:919333742989:web:ab0715d1e407c3ec9135c4",
//   measurementId: "G-RZ1VP3MLZD"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
