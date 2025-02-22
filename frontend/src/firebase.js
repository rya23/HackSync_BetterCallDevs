import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyB3txKr4eA8Zr8sB4BUCH2L9M7VCKCCUW0',
    authDomain: 'gyroscope-3473f.firebaseapp.com',
    projectId: 'gyroscope-3473f',
    storageBucket: 'gyroscope-3473f.firebasestorage.app',
    messagingSenderId: '379315740663',
    appId: '1:379315740663:web:696aa064557f1b5f7718f2',
    measurementId: 'G-0733SH1VH6',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
