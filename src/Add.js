import React from 'react';
import './Add.css';
import FlightForm from "./FlightForm.js";
import MeetingForm from "./MeetingForm.js";
import EventForm from "./EventForm.js";
import ErrorPage from './ErrorPage.js';
import ReactGA from 'react-ga';

function initializeReactGA() {
    ReactGA.initialize('UA-168152066-1');
    ReactGA.pageview('/Add');
}

function AddFlight(props) {
    return( 
        <FlightForm allPilotIDs={props.allPilotIDs}/>
    )
}

function AddEvent(props) {
    return( 
        <EventForm activeUser={props.activeUser}/>
    )
}

function AddMeeting(props) {
    return( 
        <MeetingForm activeUser={props.activeUser} allPilotIDs={props.allPilotIDs}/>
    )
}



class Add extends React.Component {
    constructor(props) {
        super(props);
        //allPilotIDs
        //activeUser
        this.state = {
            activeTab: "Flight",
            hasError: false,
        }
    }

    changeTab(tabName) {
        this.setState({activeTab: tabName});
        this.props.updateHeader(tabName);
    }

    renderTabs() {
        return (
            //TODO: fix scrolling behaviour 
           // <div className="tabs-container">
                <div className="tabs">
                    <button className={this.state.activeTab === 'Flight' ? "tab activeTab": "tab"} onClick={()=>{this.changeTab('Flight')}}>FLIGHT</button>
                    <button className={this.state.activeTab === 'Event' ? "tab activeTab": "tab"} onClick={()=>{this.changeTab('Event')}}>EVENT</button>
                    <button className={this.state.activeTab === 'Meeting' ? "tab activeTab": "tab"} onClick={()=>{this.changeTab('Meeting')}}>MEETING</button>
                </div>
           // </div>
        )
    }
    renderContent() {
        switch(this.state.activeTab) {
            case 'Event': 
                return <AddEvent activeUser={this.props.activeUser}/>
            case 'Meeting': 
                return <AddMeeting activeUser={this.props.activeUser} allPilotIDs={this.props.allPilotIDs}/>
            default: 
                return <AddFlight allPilotIDs={this.props.allPilotIDs}/>
        }
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        console.log(error, info);
    }

    componentDidMount() {
        initializeReactGA();
    }

    render() {
        if (this.state.hasError) {
            return <ErrorPage/>
        }
        return(
            <div>
                {this.renderTabs()}
                {this.renderContent()}
            </div>
            
        )
    }
}

export default Add;