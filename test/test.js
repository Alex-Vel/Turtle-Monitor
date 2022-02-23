import { assert } from "chai"; // Using Assert style
import { expect } from "chai"; // Using Expect style
import { should } from "chai"; // Using Should style
should(); // Modifies `Object.prototype`
import "../src/firebaseconfig.js";

import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  doc,
  getDoc
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  EmailAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firestore = getFirestore()

let docData;
let user;
const auth = getAuth();
const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        // Signed in
        user = userCredential.user.uid;
        // ...
       // return userCredential.uid;
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const retrieveData = async () => {
let docRef = doc(firestore, "users", user);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
  docData = docSnap.data();
} else {
  // doc.data() will be undefined in this case
  console.log("No such document!");
}
}

const logOut = async () => { 

  signOut(auth).then((result) => {
    console.log(result);
    console.log('signed out')
    user = "";
    // Sign-out successful.
  }).catch((error) => {
    console.log(error)
    // An error happened.
  });
  

}

//login test
describe("firebase login tests", function () {


  it("Login successfull", async function() {
    let result = await logInWithEmailAndPassword(
      "test@tester.com",
      "test123"
    );
    console.log(result);
    assert.equal(user, "VrmpyBkxm7MqLiCOgFY0g3KsMIy2");
  });
});

//firestore test

describe("firebase firestore tests", function () {


  it("retrieve data successfully", async function() {
    let result = await retrieveData(
    );
    assert.isNotNull(docData);
  });
});

//logout test

describe("firebase logout tests", function () {


  it("Login successfull", async function() {
    let result = await logOut();
    assert.notEqual(user.uid, "VrmpyBkxm7MqLiCOgFY0g3KsMIy2");
  });
});
