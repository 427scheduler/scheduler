import React from 'react'
import ReactGA from 'react-ga';
import "./Login.css"
import firebase from "./Firebase.js";
import ErrorPage from './ErrorPage.js';
import Helper from './Helper.js';


/*function checkInput(input) {
    if (input == "Amelia Earhart") {
        document.getElementsByClassName("pswdForm")[0].hidden = false;
        document.getElementsByClassName("pswdInput")[0].hidden = false;
    }
    else {
        if (document.getElementsByClassName("pswdForm")[0].hidden == false) {
            document.getElementsByClassName("pswdForm")[0].hidden = true;
            document.getElementsByClassName("pswdInput")[0].hidden = true;
        }
    }
}*/

function initializeReactGA() {
    ReactGA.initialize('UA-168152066-1');
    ReactGA.pageview('/Login');
  }

function validateLoginInput(email, password) {
    var ok = true;
    if ((email.length < 4 || email.slice(-13) !== '@forces.gc.ca') && !(['amelia.earhart97@outlook.com','427scheduler@gmail.com'].includes(email))) {
    //if (email.length < 4){
        setAlert('email', 'Please enter your @forces.gc.ca email address');
        ok = false;
    }
    else {setAlert('email', '')}
    if (password.length < 6 ) {
        setAlert('password','Please enter a password longer than 6 characters');
        ok = false;
    }
    else {setAlert('password', '')}

    return ok;
}


function validateSignUpInput(email, password, passwordConfirm, firstName, lastName) {
    var ok = true;
    if ((email.length < 4 || email.slice(-13) !== '@forces.gc.ca') && !(['amelia.earhart97@outlook.com','427scheduler@gmail.com'].includes(email))) {
    //if (email.length < 4){
        setAlert('email', 'Please enter your @forces.gc.ca email address');
        ok = false;
    }
    else {setAlert('email', '')}

    if (password.length < 5 ) {
        setAlert('password','Please enter a password');
        ok = false;
    }
    else if (passwordConfirm != password) {
        setAlert('password','Passwords don\'t match');
        ok = false;
    }
    else {setAlert('password', '')}

    if (firstName.length < 2 ) {
        setAlert('firstName','Please enter a first name');
        ok = false;
    }
    else {setAlert('firstName', '')}

    if (lastName.length < 2 ) {
        setAlert('lastName','Please enter a last name');
        ok = false;
    }
    else {setAlert('lastName', '')}
    
    return ok;
}


function handleError(errorCode, errorMessage) {
    switch(errorCode) {
        case 'auth/weak-password':
            setAlert('password','The password is too weak');
            break;
        case 'auth/wrong-password': 
            setAlert('password', 'Wrong password')
            break;
        case 'auth/email-already-in-use': 
            setAlert('email','The email address is already in use by another account.');
            break;
        case 'auth/user-not-found': 
            setAlert('email', 'This user does not exist. Please sign up.');
            break;
        default: 
            setAlert('email', errorMessage);
    }
}
/**
 * Handles the sign up button press.
 */



function setAlert(type, alertText) {
    var errorType = type + 'Error';
    document.getElementById(errorType).innerHTML = alertText;
}
function LoginForm(props) {
    //var pilots = []
    //firebase.ref('/pilots').once('name').then(function(snapshot) {
    //    console.log(snapshot.val())
    //});
    
    return (
        <form className="form">
            <h2 className="userForm">Email</h2>
            <input className="login_input" id="login_email" onKeyUp={handleEnter} type="text"/>
            <p id="emailError"/>
            <br/>
            <h2 className="pswdForm" >Password</h2>
            <input className="login_input" id="login_password" onKeyUp={handleEnter} type="password"/>
            <p id="passwordError"/>
            <RenderLoginButtons getSignUpForm={props.getSignUpForm} logIn={props.logIn}/>
        </form> 
    )
}

function SignUpForm(props) {
    //var pilots = []
    //firebase.ref('/pilots').once('name').then(function(snapshot) {
    //    console.log(snapshot.val())
    //});
    
    return (
        <form className="form">
            <div>
            <div className="surow su_narrow">
                <h3 className="sutext">First Name</h3>
                <input className="suinput" id="su_firstName" onKeyUp={handleEnter} type="text"/>
                <p id="firstNameError"/>
            </div>
            <div className="surow su_narrow">
                <h3 className="sutext">Last Name</h3>
                <input className="suinput" id="su_lastName" onKeyUp={handleEnter} type="text"/>
                <p id="lastNameError"/>
            </div>
            </div>
            <br/>
            <div className="surow">
            <h3 className="sutext">Email</h3>
            <input className="suinput" id="su_email" onKeyUp={handleEnter} type="text"/>
            <p id="emailError"/>
            </div>
            <br/>
            
            <div className="surow">
                <h3 className="sutext">Password</h3>
                <input className="suinput" id="su_password" onKeyUp={handleEnter} type="password"/>
                <p id="passwordError"/>
            </div>
            <br/>
            <div className="surow">
                <h3 className="sutext">Confirm Password</h3>
                <input className="suinput" id="su_passwordConfirm" onKeyUp={handleEnter} type="password"/>
            </div>
            <RenderSignUpButtons getLoginForm={props.getLoginForm} signUp={props.signUp}/>
        </form> 
    )
}

function handleEnter(event) {
    if (event.keyCode === 13) {
        // Trigger the button element with a click
        document.getElementsByClassName("sign-in-btn")[0].click();
    }
}

function RenderLoginButtons(props) {
    return (
        <div className='login-form-btns '>
                <button className="sign-up-btn" type="button" onClick={props.getSignUpForm}>
                    Sign Up
                </button>
                <button className="sign-in-btn" onKeyUp={handleEnter} type="button" onClick={props.logIn}>
                    Next
                </button>
        </div>
    );
}

function RenderSignUpButtons(props) {
    return (
        <div className='login-form-btns '>
                <button className="sign-up-btn" type="button" onClick={props.getLoginForm}>
                    Cancel
                </button>
                <button className="sign-in-btn" onKeyUp={handleEnter} type="button" onClick={props.signUp}>
                    Sign Up
                </button>
        </div>
    );
}


class Login extends React.Component{
    constructor(props) {
        super(props)
        //VerifyEmail
        this.state={hasError: false, 
        action: 'login'}; //possible values: login, signUp, verify
    }
    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        console.log(error, info);
    }

    componentDidMount() {
        initializeReactGA();
    }
    getLoginForm() {
        this.setState({action: 'login'});
    }
    getSignUpForm() {
        this.setState({action: 'signUp'});
    }
    getVerify() {
        this.setState({action: 'verify'});
    }

    logIn() {
        var getVerify = this.getVerify.bind(this);
        if (firebase.auth().currentUser) {
          // [START signout]
          firebase.auth().signOut();
          // [END signout]
        } else {
            var email = document.getElementById('login_email').value;
            var password = document.getElementById('login_password').value;
            if (!validateLoginInput(email, password)) {
                return;
            }
            // Sign in with email and pass.
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                handleError(error.code, error.message);
                console.log(error);
            });
    
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                  if (!user.emailVerified) {
                      getVerify();
                      this.setState({action: 'verify'});
                  }
                  
                }
            });
        }
        //document.getElementById('quickstart-sign-in').disabled = true;
      }

    signUp() {
        var email = document.getElementById('su_email').value;
        var password = document.getElementById('su_password').value;
        var passwordConfirm = document.getElementById('su_passwordConfirm').value;
        var firstName= document.getElementById('su_firstName').value;
        var lastName= document.getElementById('su_lastName').value;
        firstName = firstName[0].toUpperCase() + firstName.substring(1).toLowerCase();
        lastName = lastName[0].toUpperCase() + lastName.substring(1).toLowerCase();
        var uid = Helper.parseName(firstName+' '+lastName);
        var getVerify = this.getVerify.bind(this);
        var firebaseid = '';

        if (!validateSignUpInput(email, password, passwordConfirm, firstName, lastName)) {
            return;
        }

        //Sign up user 
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {

            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {

                    if (!user.displayName) {
                        user.updateProfile({
                            displayName: firstName + " " + lastName,
                        }).catch(function(error) {
                            console.log("An error occurred while creating name. Please try again.");
                        });
                    }
                    if (!user.emailVerified) {
                        user.sendEmailVerification();
                        getVerify();
                    }
                    firebaseid = user.uid;

                    firebase.firestore().collection("pilots").doc(uid).set({
                        team: 0, 
                        role: 'N/A',
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        lastFlight: '2019-01-01',
                        approved: false,
                    })
                        .then(function() {
                        console.log(firstName + " " + lastName +" successfully written!");
                        })
                        .catch(function(error) {
                        console.error("Error writing " + firstName + " " + lastName + ": ", error);
                    });
        
                    firebase.firestore().collection("pilots").doc('0').update({pilots: firebase.firestore.FieldValue.arrayUnion(uid)});
        
                    firebase.firestore().collection("users").doc(firebaseid).set({
                        id: uid,
                    }).catch(function(error) {
                        console.log("Error writing to users: ", error)
                    })
                }

            });


        }).catch(function(error) {
            // Handle Errors here.
            handleError(error.code, error.message);
            console.log(error.code, error);
            if (error.code == "auth/weak-password") {setAlert('password', error.message)}
            return;
        });

        
    }

    

    render() {
        if (this.state.hasError) {
            return <ErrorPage/>
        }
        if (this.state.action == 'signUp') {
            return <SignUpForm getLoginForm={this.getLoginForm.bind(this)} signUp={this.signUp.bind(this)}/>
        }
        else if (this.state.action == 'verify') {
            return (this.props.VerifyEmail)
        }
        else {
            return (
                <LoginForm getSignUpForm={this.getSignUpForm.bind(this)} logIn={this.logIn.bind(this)}/>
            )
        }
    }
}

export default Login;