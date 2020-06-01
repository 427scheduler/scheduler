import React from"react";
import"./Form.css";
import firebase from "./Firebase.js";
import Helper from "./Helper.js";
import {RenderSuccessDialog} from "./Overlay.js";

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});


class EventForm extends React.Component {
    constructor(props) { 
        super(props);
        this.state = {
            title: "", 
            type: "apt", 
            date: new Date().toDateInputValue(),
            //endDate: "",
            startTime: "",
            endTime: "",
            notes: "",
            userid: "",
            event: "apt",
        }
    }
    onSubmit() {
        var ok = true;
        var required = ['title', 'startTime', 'endTime'];
        var remove = document.getElementsByClassName('alert-validate');
        for (let item of remove) {
            item.classList.remove('alert-validate');
        }
        required.forEach(field => {
            if (this.state[field] == "") {
                Helper.flag(field, "Required");
                ok = false;
            }
        })
        if (isNaN(this.state.startTime) || !Helper.timeValid(this.state.startTime)) {
            Helper.flag('startTime', 'Enter between 0000 and 2359')
            ok = false;
        }
        if (isNaN(this.state.endTime) || !Helper.timeValid(this.state.endTime)) {
            Helper.flag('endTime', 'Enter between 0000 and 2359')
            ok = false;
        }
        if (parseInt(this.state.startTime) >= parseInt(this.state.endTime)) {
            Helper.flag('startTime', 'End must be after start')
            ok = false;
        }
        if (ok) {
            var newEvent = firebase.firestore().collection("events").doc()
            newEvent.set(this.state)
            .then(function() {
                console.log("Event successfully added to events!");})
            .catch(function(error) {
                console.error("Error adding event: ", error);
            });

            var field = 'events.'+(this.props.activeUser[0] + this.props.activeUser.split(' ')[1]).toLowerCase();
            firebase.firestore().collection("dates").doc(this.state.date).update({
                [field]: firebase.firestore.FieldValue.arrayUnion({'type':'apt', 'startTime': this.state.startTime, 'endTime': this.state.endTime, 'id':newEvent.id})
                })
            .then(function() {
                console.log("Event successfully added to dates!");})
            .catch(function(error) {
                console.error("Error writing document: ", error);
            })
            document.getElementsByClassName("success-modal")[0].style.display = "block";
        }
    }

    onBlur(name, e, type) {
        if (type == 'date') {
            var d = new Date(e.target.value);
            d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
            this.setState({date: d.toDateInputValue()});
        }
        else if (type == 'number')  {
            this.setState({[name]: e.target.value});
        }
        else {
            this.setState({[name]: e.target.value.trim()});
        }
        e.target.parentElement.classList.remove("alert-validate");
    }

    eventSelected(event) {
        this.setState({event: event});
    }

    componentDidMount() {
        this.setState({userid: (this.props.activeUser[0] + this.props.activeUser.split(' ')[1]).toLowerCase()});
    }

    render() {

        return (
            <div>
                <RenderSuccessDialog/>
                <div className="event-select"> 
                    <button className={"event-type" + (this.state.event == 'apt' ? ' active' : '')} onClick={()=>{this.eventSelected('apt')}}>Appointment</button>
                    <button className={"event-type" + (this.state.event == 'leave' ? ' active' : '')} onClick={()=>{this.eventSelected('leave')}}>Leave/CTO</button>
                    <button className={"event-type" + (this.state.event == 'pers' ? ' active' : '')} onClick={()=>{this.eventSelected('pers')}}>PERS COURSE</button>
                    <button className={"event-type" + (this.state.event == 'yl' ? ' active' : '')} onClick={()=>{this.eventSelected('yl')}}>YL</button>
                </div>
                <form className="event-form">
                    <div className="large-wrapper validate-input" id="title" >
                        <input className={"input"+ (this.state.title !== ""? " has-val": "")} type="text" name="title" required={true} onBlur={(e)=>{this.onBlur('title',e)}}/>
                        <span className="focus-input" data-placeholder="EVENT TITLE"></span>
                    </div>
                    <div className="row-wrapper"> 
                        <div className="medium-wrapper">
                            <input className={"input has-val"}  required={true}type="date" name="date" defaultValue={new Date().toDateInputValue()} onBlur={(e)=>{this.onBlur('date',e, 'date')}}/>
                            <span className="focus-input" data-placeholder="DATE"></span>
                        </div>
                        <div className="medium-wrapper validate-input" id="startTime" >
                            <input className={"input"+ (this.state.startTime !== ""? " has-val": "")} type="text" name="startTime" onBlur={(e)=>{this.onBlur('startTime',e, 'number')}}/>
                            <span className="focus-input" data-placeholder="START TIME"></span>
                        </div>
                        <div className="medium-wrapper validate-input" id="endTime" >
                            <input className={"input"+ (this.state.endTime !== ""? " has-val": "")}  type="text" name="esp" onBlur={(e)=>{this.onBlur('endTime',e, 'number')}}/>
                            <span className="focus-input" data-placeholder="END TIME"></span>
                        </div>
                    </div>
                    
                    <div className="wrap-input">
                        <input className={"input"+ (this.state.notes != ""? " has-val": "")}  type="text" name="notes" onBlur={(e)=>{this.onBlur('notes',e)}}/>
                        <span className="focus-input" data-placeholder="EVENT NOTES"></span>
                    </div>

                    
                    <div className="container-form-btn">
                        <div className="wrap-form-btn">
                            <div className="form-bgbtn"></div>
                                <button className="form-btn" onClick={(e)=>{e.preventDefault();this.onSubmit()}}>
                                    Add Event
                                </button>
                        </div>
                    </div>
                </form>

            </div>

        );
    }
}

export default EventForm;