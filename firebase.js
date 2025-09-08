
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCtDn5MaWgdpIB9-QxdWTS5Cn_DRNw8-TY",
  authDomain: "disneyplusstreaminginterface.firebaseapp.com",
  projectId: "disneyplusstreaminginterface",
  storageBucket: "disneyplusstreaminginterface.firebasestorage.app",
  messagingSenderId: "835935667855",
  appId: "1:835935667855:web:c56ad0fa7a5ec0cc5152fa",
  measurementId: "G-HW7RS38VTF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { auth };