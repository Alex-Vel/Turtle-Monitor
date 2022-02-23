import '../src/firebaseconfig.js';
import {getFirestore, collection, getDocs, onSnapshot } from "firebase/firestore";
import {getAuth, onAuthStateChanged, signOut, EmailAuthProvider} from 'firebase/auth'


//login test
describe('firebase login tests', function () {
    this.timeout(500);

const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  
  it('should take less than 500ms', function (done) {
  setTimeout(done, 300);
  logInWithEmailAndPassword("test@test.com","test123")
});

})

//firestore test