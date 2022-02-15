import {initializeApp, getApps} from 'firebase/app';


const firebaseConfig = {
  apiKey: "AIzaSyCeWAfsx4e4-DN5sxQt0BA95HMcexo7its",
  authDomain: "turtle-monitor.firebaseapp.com",
  projectId: "turtle-monitor",
  storageBucket: "turtle-monitor.appspot.com",
  messagingSenderId: "256760307693",
  appId: "1:256760307693:web:86155b9628d312654611e4"
};

let firebaseApp
// Configure Firebase.
if(!getApps().length){
  firebaseApp= initializeApp(firebaseConfig);
}

export default firebaseApp

