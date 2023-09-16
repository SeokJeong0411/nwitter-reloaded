import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBWKAUuIy4frT2VsniEosghw9WkMx7RlRE",
  authDomain: "nwitter-dd9c1.firebaseapp.com",
  projectId: "nwitter-dd9c1",
  storageBucket: "nwitter-dd9c1.appspot.com",
  messagingSenderId: "251751655407",
  appId: "1:251751655407:web:3d9b1bbb358d6ef62a381a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
