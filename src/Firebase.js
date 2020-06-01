import * as firebase from "firebase/app";


// Add Firebase services 
import "firebase/auth";
import "firebase/firestore";

//import "https://www.gstatic.com/firebasejs/6.0.2/firebase-app.js";
//import "https://www.gstatic.com/firebasejs/6.0.2/firebase-firestore.js";


var firebaseConfig = {
    apiKey: "AIzaSyAohLavrlX4eXR0B2LNPzVuDEnywZSQL9Q",
    authDomain: "scheduler-f6af6.firebaseapp.com",
    databaseURL: "https://scheduler-f6af6.firebaseio.com",
    projectId: "scheduler-f6af6",
    storageBucket: "scheduler-f6af6.appspot.com",
    messagingSenderId: "512115091360",
    appId: "1:512115091360:web:b703920b22e8fcb5d0e6c5",
    measurementId: "G-VH21D4C38F"
};

firebase.initializeApp(firebaseConfig);

export default firebase;