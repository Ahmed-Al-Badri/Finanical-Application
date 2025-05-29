import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAq-43fZRWy0cowHsWOCveBGpilnO--u-c",
  authDomain: "financial-application-ddfa0.firebaseapp.com",
  projectId: "financial-application-ddfa0",
  storageBucket: "financial-application-ddfa0.firebasestorage.app",
  messagingSenderId: "1098019314225",
  appId: "1:1098019314225:web:bb528598b5ae2d6bb71310",
  measurementId: "G-WTMZLXTS0X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
export { analytics };
