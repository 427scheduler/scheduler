import React from 'react';
import ReactGA from 'react-ga';
import Dashboard from './Dashboard.js';
import Flights from './Flights.js';
import Schedule from "./Schedule.js";
import Add from "./Add.js";
import Login from "./Login.js";
import Personnel from "./Personnel.js";
import Overlay from './Overlay.js';
import './App.css';

import DASHBOARD_LOGO from './img/dashboard.png'
import DASHBOARD_ACTIVE_LOGO from './img/Dashboard_active.png'
import FLIGHTS_LOGO from './img/Flights.png';
import FLIGHTS_ACTIVE_LOGO from './img/Flights_active.png';
import SCHEDULE_LOGO from './img/calendar.png';
import SCHEDULE_ACTIVE_LOGO from './img/calendar_blue.png';
import ADD_LOGO from './img/add.png';
import ADD_ACTIVE_LOGO from './img/add_blue.png';
import LOGOUT_LOGO from './img/personnel.png';
import LOGOUT_ACTIVE_LOGO from './img/personnel_active.png';
import firebase from './Firebase.js';
import ErrorPage from './ErrorPage.js';

const navigationTabs = ["Dashboard", "Daily Flying Order", "Availability", "Add", "Personnel"];
const logos = {"Dashboard": DASHBOARD_LOGO, "Daily Flying Order": FLIGHTS_LOGO, "Availability": SCHEDULE_LOGO, "Add": ADD_LOGO, "Personnel": LOGOUT_LOGO}
const activelogos = {"Dashboard": DASHBOARD_ACTIVE_LOGO, "Daily Flying Order": FLIGHTS_ACTIVE_LOGO, "Availability": SCHEDULE_ACTIVE_LOGO, "Add": ADD_ACTIVE_LOGO, "Personnel": LOGOUT_ACTIVE_LOGO}

window.onerror = ((error)=>{this.setState({ hasError: true }); console.log("ERROR: ", error)});

function initializeReactGA() {
  ReactGA.initialize('UA-168152066-1');
  ReactGA.pageview('/Home');
}

function Header(props) {
  var title = props.activePage === 'Dashboard' ? 'Hi, '+props.user.split(" ")[0] : props.activePage
  return <h1>{title + (props.addTab === "" ? "" : " "+props.addTab)}</h1>
}

function NavBarTab(props) {
    return (
      <div className='navbar-tab-container' onClick={props.onClick}>
        <div className='navBarTab'>
          <img className='icon' src={props.icon} alt=""/>
        </div>
        <div className='navbar-tab-text'>
          <p className={props.active ? 'active-navbar-tab' : ''}>{props.tabName}</p>
        </div>
      </div>
    )
}


function VerifyEmail() {
  return (
      <div className="verify">
          <img id="verifyIcon" src={ require('./img/mail.png') } />
          <h3 id="verifyMessage">Please verify your email</h3>
      </div> 
  )
}

function PendingApproval() {
  return (
      <div className="verify">
          <img id="verifyIcon" src={ require('./img/approval.png') } />
          <h3 id="verifyMessage">Awaiting CO approval</h3>
      </div> 
  )
}


class NavBar extends React.Component {

  constructor(props) {
    super(props);
    this.state={hasError: false,}
  }

  changeTab(tabName) {
    this.props.changeTab(tabName); 
    this.props.updateHeader(tabName==="Add" ? "Flight" : "")
  }

  renderNavBarTab(tabName) {
    var isActive = this.props.activePage == tabName;
    const logo = isActive ? activelogos[tabName] : logos[tabName];
    return <NavBarTab tabName={tabName} 
            active={isActive}
            icon={logo} openNavBar={this.props.openNavBar} onClick={() => {this.changeTab(tabName)}}/>
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    console.log(error, info);
  }


  render() {
    if (this.state.hasError) {
      return <ErrorPage/>
    }
    var tabs = [];
    navigationTabs.forEach(tab => {
      tabs.push(this.renderNavBarTab(tab));
    }) 
    return (
      <div className="navBar" style={['Login', 'Verify Email', 'Pending Approval'].includes(this.props.activePage) ?{display: 'none'}: {display: 'block'}}>
        <div className='navBarTabs'>
          {tabs}
        </div>
      </div>
    );
  }
    
}

class AppBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: "Login",
      //activePage: 'Dashboard',
      user: null,
      addTab: "",
      flights: ["Thurs, May 2", "Fri, May 4"],
      showOverlay: false,
      hasError: false,
      isDisconnected: false,
      allPilotIDs: [],
    };
  }

  componentDidMount() {
    initializeReactGA();
    firebase.auth().onAuthStateChanged(
      authUser => {
        console.log(authUser);
        if (authUser && authUser.emailVerified) {
        firebase.firestore().collection("users").doc(authUser.uid).get().then((querySnapshot) => {
          if (querySnapshot.data()) {
            var id = querySnapshot.data().id;
            firebase.firestore().collection("pilots").doc(id).get().then((querySnapshot) => {
              if (querySnapshot) {
                if (querySnapshot.data().approved && authUser && authUser.emailVerified) {
                    this.setState({ user: authUser.displayName, activePage: "Dashboard"})
                }
                else {
                  this.setState({ activePage: "Pending Approval" });
                }
              }
            })

          }
        })
      }
      else if (authUser && !authUser.emailVerified) {
          this.setState({ activePage: "Verify Email" });
        }
      },
    );
    
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, ": ", errorMessage);
  });

    //Listen for if the user goes offline 
    this.handleConnectionChange();
    window.addEventListener('online', this.handleConnectionChange);
    window.addEventListener('offline', this.handleConnectionChange);

    //Gets all pilot ID's 
    //TODO: Perhaps could be moved to Add
    this.firebaseGetAllPilotIDs();

  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleConnectionChange);
    window.removeEventListener('offline', this.handleConnectionChange);
  }

  handleConnectionChange = () => {
    const condition = navigator.onLine ? 'online' : 'offline';
    if (condition === 'online') {
      const webPing = setInterval(
        () => {
          fetch('//google.com', {
            mode: 'no-cors',
            })
          .then(() => {
            this.setState({ isDisconnected: false }, () => {
              return clearInterval(webPing)
            });
          }).catch(() => this.setState({ isDisconnected: true }) )
        }, 2000);
      return;
    }

    return this.setState({ isDisconnected: true });
  }

  renderNavBar() {
    return <NavBar
      activePage={this.state.activePage} 
      navTabs={navigationTabs} 
      changeTab={(tabName)=>{this.changeTab(tabName)}}
      updateHeader={(title)=>{this.updateHeader(title)}}/>
  }

  renderHeader() {
    return <Header activePage = {this.state.activePage} addTab={this.state.addTab} user={this.state.user}/>
  }

  renderOfflineError() {
    return (
      <div className="alert" style={{display: this.state.isDisconnected ? 'block' : 'none'}}>
        <span className="closebtn" onClick={(e)=> {e.target.parentElement.style.display='none';}}>&times;</span> 
        Internet offline. Please try again later. 
      </div>
    )
  }

  firebaseGetAllPilotIDs() {
    var pilots = [];
    firebase.firestore().collection("pilots")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((pilot)=> {
                if (pilot.data().displayName != null) {
                    pilots.push(pilot.id)
                }
            })
            this.setState({allPilotIDs: pilots})
        })
        .catch(function(error) {
            console.log("Error getting all pilots: ", error);
        });

}

  updateHeader(title) {
    this.setState({addTab: title});
  }

  renderOverlay() {
    var content = "";
    if (this.state.showOverlay) {
      content = <Overlay event={this.state.overlayEvent} id={this.state.overlayId} onClose={()=>{this.toggleOverlay('', '');}}/>
    }
    
    return content;
  }

  shouldComponentUpdate(nextState) {
    return this.state.activePage !== nextState.activePage;
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    console.log(error, info);
  }

  toggleOverlay(event, id) {
    const currentState = this.state.showOverlay;
    this.setState({showOverlay: !currentState, overlayEvent: event, overlayId: id});
  }

  changeTab(tabName) {
    this.setState({activePage: tabName});
  }

  renderContent(tabName) {
    switch(tabName) {
      case 'Dashboard': 
        return <Dashboard flights={this.state.flights} toggleOverlay={(type,id)=>{this.toggleOverlay(type, id)}} name={this.state.user} changeTab={()=>{this.changeTab("Add")}} activeUser={this.state.user}/>
      case 'Daily Flying Order': 
        return <Flights  toggleOverlay={(id)=>{this.toggleOverlay('flight', id)}}/>
      case "Availability": 
        return <Schedule toggleOverlay={(event, id)=>{this.toggleOverlay(event, id)}} user={this.state.user}/>
      case "Add": 
        return <Add updateHeader={(title)=>{this.updateHeader(title)}} activeUser={this.state.user} allPilotIDs={this.state.allPilotIDs}/>
      case "Login": 
        return <Login VerifyEmail={VerifyEmail}/>
      case "Personnel": 
        return <Personnel name={this.state.user}/>
      case "Verify Email":
        return <VerifyEmail/>
      case "Pending Approval":
        return <PendingApproval/>
      default: 
        return <Dashboard flights={this.state.flights} toggleOverlay={(id)=>{this.toggleOverlay('flight', id)}}/>
    }
  }

  
  render() {

    if (this.state.hasError) {
      return <ErrorPage/>
    }
    return (
      <div className="App">
        {this.renderOfflineError()}
        {this.renderOverlay()}
        <div className="wrapper">
          <div className="header">
            
            {this.renderHeader()}
            <button id="install" hidden>Install App</button>
          </div>
            {this.renderNavBar()} 
          <div className="content"> 
            {this.renderContent(this.state.activePage)} 
          </div>
        </div>   
      </div>
    );
  };
}

function App() {
  
  return (
    <AppBody/>
  );
}

export default App;
