import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
	apiKey: "AIzaSyBnt9veYmbGbA-1iqbGZDi1hLU2Yrdm_6c",
	authDomain: "blindtest-ee61b.firebaseapp.com",
	projectId: "blindtest-ee61b",
	storageBucket: "blindtest-ee61b.firebasestorage.app",
	messagingSenderId: "478848701524",
	appId: "1:478848701524:web:a80aba24e78d3a5db809c1",
	measurementId: "G-8BDVHKYX0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);
