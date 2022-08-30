import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// ok to include firebase api key in code
// https://firebase.google.com/docs/projects/api-keys#api-keys-for-firebase-are-different
const firebaseConfig = {
    apiKey: "AIzaSyB9mp5FCiYuHZWwwtdu3qx0pjzetRQt7OA",
    authDomain: "kanban-app-auth.firebaseapp.com",
    projectId: "kanban-app-auth",
    storageBucket: "kanban-app-auth.appspot.com",
    messagingSenderId: "260056389889",
    appId: "1:260056389889:web:d3996431c178a293aa2300"
  };

  const firebaseApp = initializeApp(firebaseConfig)
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider(); //allows user to sign in with gmail account

  export {db, auth, provider};