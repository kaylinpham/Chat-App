import firebase from "firebase";

const firebaseConfig = {
  // apiKey: "AIzaSyD27gAAerLYXkS8fnh8bssocBBeInj_ZeQ",
  // authDomain: "dbp-cijs-d05-bd74a.firebaseapp.com",
  // databaseURL: "https://dbp-cijs-d05-bd74a.firebaseio.com",
  // projectId: "dbp-cijs-d05-bd74a",
  // storageBucket: "dbp-cijs-d05-bd74a.appspot.com",
  // messagingSenderId: "832657027394",
  // appId: "1:832657027394:web:6533a28aedb4a9a5d9d8db",
  // measurementId: "G-WJCNPTMPEB",

  apiKey: "AIzaSyCCbAq4JBIRGzuSxxhr1CaTEGuAH4PASo8",
  authDomain: "ci-js-d05-nhan.firebaseapp.com",
  databaseURL: "https://ci-js-d05-nhan.firebaseio.com",
  projectId: "ci-js-d05-nhan",
  storageBucket: "ci-js-d05-nhan.appspot.com",
  messagingSenderId: "193639914551",
  appId: "1:193639914551:web:5f391b25d8db409371b3b2"
};

firebase.initializeApp(firebaseConfig);
export default firebase;
