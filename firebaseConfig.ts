
// This is a simplified example of using the Firebase SDK from the global window object.
// In a real-world application, you would typically use a bundler like Vite or Create React App
// which would allow you to import Firebase modules directly.
declare global {
    interface Window {
        firebase: any;
    }
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHnB8pURswbmhOxu_WNo4PouOZvTZXH30",
  authDomain: "fullcontrol-2ecbb.firebaseapp.com",
  projectId: "fullcontrol-2ecbb",
  storageBucket: "fullcontrol-2ecbb.appspot.com",
  messagingSenderId: "588785206273",
  appId: "1:588785206273:web:8a93772c762b6ac75a2c00",
  measurementId: "G-Q03PSF5KRB"
};

// Initialize Firebase
const app = window.firebase.initializeApp(firebaseConfig);
const auth = window.firebase.getAuth(app);
const db = window.firebase.getFirestore(app);

export { auth, db };