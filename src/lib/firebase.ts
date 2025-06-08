import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider } from 'firebase/auth';

export const provider = new GoogleAuthProvider();

const firebaseConfig = {
    apiKey: "AIzaSyB8W28ot9NgGVH4FVL2U4Ub44Eq01Qx02A",
    authDomain: "quiz-maker-mok.firebaseapp.com",
    projectId: "quiz-maker-mok",
    storageBucket: "quiz-maker-mok.firebasestorage.app",
    messagingSenderId: "967400688524",
    appId: "1:967400688524:web:ff79b16951fc47ea7de4a9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
