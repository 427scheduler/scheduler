import React from 'react';
import "./Overlay.css";

import firebase from './Firebase.js';
import EDIT from './img/edit.png';
import DELETE from './img/delete.png';
import {firebaseDeleteFlight, firebaseDeleteAptMeeting} from "./FirebaseHelper.js";
import ErrorPage from './ErrorPage';
import ReactGA from 'react-ga';
import OK from "./img/success.png";


function initializeReactGA() {
    ReactGA.initialize('UA-168152066-1');
    ReactGA.pageview('/Overlay');
}


class Overlay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {data: {},
                    captain: "", 
                    fo: "", 
                    fe: "", 
                    crew: "",
                    hasError: false,
                }
    }

    deleteClicked(type, id, data, onClose) {
        if (window.confirm("Are you sure you want to delete this event? \nIt will be deleted for all participants")) {
            if (type === "flight") {
                firebaseDeleteFlight(id, data);
            }
            else {
                firebaseDeleteAptMeeting(type, id, data);
            }
            
            onClose();
        } 
    }

    getPilots(type, id) {
        if (id) {
            firebase.firestore().collection("pilots").doc(id)
            .get()
            .then((querySnapshot) => {
                switch(type) {
                    case 'fo': 
                        this.setState({fo: querySnapshot.data().displayName || id})
                        return;
                    case 'fe': 
                        this.setState({fe: querySnapshot.data().displayName || id })
                        return;
                    case 'crew': 
                        this.setState({crew: querySnapshot.data().displayName || id })
                        return;
                    default: 
                        this.setState({captain: querySnapshot.data().displayName || id})
                        return;
                }
                
            })
            .catch(function(error) {
                console.log(error);
            });
        }
    }

    Sidebar() {
        if (this.state.data) {
            //TODO: fix this not sure why it is offset by -1
            var d = new Date(this.state.data.date);
            d.setDate(d.getDate() + 1);

            var [startTime, endTime] = [this.state.data.startTime, this.state.data.endTime];
            var time = startTime + ' - ' + endTime;
            return (
                <div className={'sidebar '+ this.props.event+'-event'}>
                    <h4>{d.toDateString().replace(' ', ', ')}</h4>
                    <div className='sidebar-content'>
                        <h4>{time}</h4>
                        <h1>{this.props.event[0].toUpperCase() + this.props.event.slice(1)}</h1>
                    </div>
                </div>
        )}
        return
    }
    ModalContent() {
        var content = "";
        
        if (this.state.data == null) { 
            throw new Error("This event doesn't exist!");
        }
        if (Object.keys(this.state.data).length > 0) {
            var d = this.state.data;
            if (this.props.event === 'meeting' || this.props.event=== 'apt') {
                content = (
                <table>
                    <tbody>
                        <tr><td className='bold'>TITLE</td><td>{d.title}</td></tr>
                        <tr><td className='bold'>MEMBER</td><td>{d.userid[0].toUpperCase() + ". " + d.userid[1].toUpperCase() + d.userid.slice(2)}</td></tr>
                        {this.props.event === 'meeting' ? <tr><td className='bold'>CONFERENCE LINK</td><td>{d.confLink || ''}</td></tr>: ''}
                        {this.props.event === 'location' ? <tr><td className='bold'>LOCATION</td><td>{d.confLink || ''}</td></tr>: ''}
                        <tr><td className='bold'>NOTES</td><td>{d.notes}</td></tr>
                    </tbody>
                </table>
                )
            }
            if (this.props.event === 'flight') {
                content = (
                <table>
                    <tbody>
                        <tr><td className='bold'>{'CAPTAIN'}</td><td>{this.state.captain}</td></tr>
                        <tr><td className='bold'>{'FIRST OFFICER'}</td><td>{this.state.fo}</td></tr>
                        {d.fe?<tr><td className='bold'>{'FLIGHT ENG'}</td><td>{this.state.fe}</td></tr>:''}
                        {d.crew?<tr><td className='bold'>{'CREW'}</td><td>{this.state.crew}</td></tr>:''}
                        <tr><td className='bold'>AC</td><td>{d.ac}</td></tr>
                        {d.backup?<tr><td className='bold'>BACKUP</td><td>{d.backup}</td></tr>:''}
                        <tr><td className='bold'>DETAILS</td><td>{d.details||''}</td></tr>
                        <tr><td className='bold'>CONFIG</td><td>{d.config||''}</td></tr>
                        {d.remarks?<tr><td className='bold'>REMARKS</td><td>{d.remarks}</td></tr>:''}
                        <tr><td className='bold'>{'SQN PRI'}</td><td>{d.pri||''}</td></tr>
                        <tr><td className='bold'>MEAL</td><td>{this.state.endTime>= 2100?'Provided':'Not Provided'}</td></tr> 
                        <tr><td className='bold'>DCO</td><td><div className={"dot "+d.dco}></div></td></tr>
                    </tbody>
                </table>)
            };
        }
        return (
            <div className={'modal-content'}>
                <div className='buttons'>
                    <img alt="delete" className="delete" src={DELETE} title='Delete' onClick={()=>{this.deleteClicked(this.props.event, this.props.id, this.state.data, this.props.onClose)}} />
                    <img alt="edit" className="edit" src={EDIT} title='Edit'/>
                    <span alt="close" className="close" title='Close Dialog' onClick={this.props.onClose}>&times;</span>
                </div>
                {content}
            </div>
        )
    }

    componentDidMount() {
        initializeReactGA();
        var id = this.props.id;
        firebase.firestore().collection("events").doc(id)
        .get()
        .then((querySnapshot) => {
            var d = querySnapshot.data();
            this.setState({data: d});
            if (this.props.event === 'flight'){
                this.getPilots('captain', d.captain);
                this.getPilots('fo', d.fo);
                this.getPilots('fe', d.fe);
                this.getPilots('crew', d.crew);
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
    }

    render() {
        if (this.state.hasError) {
            return <ErrorPage/>
        }
        /*return (
            <div className="overlay" onClick={this.props.onClose}>
                <div className="overlay-content">
                    <span className="close" onClick={this.props.onClose}>&times;</span>
                    <div className="overlay-title"><h1>Flight Details</h1></div>
                    <FlightForm></FlightForm>
                </div>
            </div>
        )*/
        return (
            <div className="overlay" onClick={this.props.onClose}>
                <div className="overlay-content" onClick={(e)=>{e.stopPropagation()}}>
                    {this.Sidebar()}
                    {this.ModalContent()}
                </div>
            </div>
        )
    }
}

function RenderSuccessDialog() {
    return (
        <div className="success-modal" onClick={()=>{document.getElementsByClassName("success-modal")[0].style.display="none"}}>
            <div className="overlay">
                <div className="overlay-content success-content">
                    <div className="modal-header">
                        <div className="icon-box">
                            <img alt="ok" src={OK}/>
                        </div>				
                    </div>
                    <div className="success-modal-body">
                        <h3>Event successfully added</h3>
                    </div>
                </div>
            </div> 
        </div>
    );
}

export default Overlay;
export {RenderSuccessDialog};
