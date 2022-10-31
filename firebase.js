import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAl5uppn-RKFEXRny_8CWg4TtgMX1YM19Y",
    authDomain: "lifter-2022.firebaseapp.com",
    projectId: "lifter-2022",
    storageBucket: "lifter-2022.appspot.com",
    messagingSenderId: "1046767467624",
    appId: "1:1046767467624:web:44e627c20004886326cfdd",
    measurementId: "G-B3P7N0D4HJ"
  };

const app = initializeApp(firebaseConfig);

export const authentication = getAuth(app);

export const db = getFirestore();

export const storage = getStorage(app);