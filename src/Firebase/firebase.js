import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const devConfig = {
    apiKey: "AIzaSyD1sfi3HyT34bJ3aO_XfE42X5HkDxru4Hk",
    authDomain: "spaceybird-4f39a.firebaseapp.com",
    databaseURL: "https://spaceybird-4f39a.firebaseio.com",
    projectId: "spaceybird-4f39a",
    storageBucket: "spaceybird-4f39a.appspot.com",
    messagingSenderId: "76013746324"
}

const prodConfig = {

}

const config =
    process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

class Firebase {
    constructor() {
      app.initializeApp(config);
      this.auth = app.auth();
    }

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          authUser
            ? this.setState({ authUser })
            : this.setState({ authUser: null });
        },
      );
    }
  
    componentWillUnmount() {
      this.listener();
    }  

    // AUTH API

    doSignOut = () => this.auth.signOut();

    doCreateUserWithEmailAndPassword = (email, password) =>
      this.auth.createUserWithEmailAndPassword(email, password)

    doSignInWithEmailAndPassword = (email, password) =>
      this.auth.signInWithEmailAndPassword(email, password);


    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
      this.auth.currentUser.updatePassword(password);

    // DATABASE API


  }
  
  export default Firebase;