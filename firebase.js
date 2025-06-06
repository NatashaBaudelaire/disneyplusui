import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-DRQI5boYHBTu-XiOdXO92FljPu1Vp8E",
  authDomain: "disneyplus-clone-5bf51.firebaseapp.com",
  projectId: "disneyplus-clone-5bf51",
  storageBucket: "disneyplus-clone-5bf51.appspot.com",
  messagingSenderId: "989994874938",
  appId: "1:989994874938:web:SEU_APP_ID" // substitua pelo que estiver aí na sua tela
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };