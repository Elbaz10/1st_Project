import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// תצורת Firebase שלך
const firebaseConfig = {
  apiKey: "AIzaSyACyx8F9YHzdJKitsv91FzXtqEI0Tm4Ijk",
  authDomain: "newproject-e289a.firebaseapp.com",
  projectId: "newproject-e289a",
  storageBucket: "newproject-e289a.appspot.com",
  messagingSenderId: "667141904210",
  appId: "1:667141904210:web:9f0a32cd1d84ebf8bccc8b"
};

// אתחול Firebase
const app = initializeApp(firebaseConfig);

// שירותים
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;