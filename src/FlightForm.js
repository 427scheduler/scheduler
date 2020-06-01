import React from "react";
import "./Form.css";
import firebase from "./Firebase.js";
import {firebaseCreateDate} from "./FirebaseHelper.js";
import {RenderSuccessDialog} from "./Overlay.js";
import Const from "./Const.js";
import Helper from "./Helper.js";

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});




class FlightForm extends React.Component {
    constructor(props) { 
        super(props);
        //allPilotIDs
        this.state = {
            date: new Date().toDateInputValue(),
            startTime: "",
            endTime: "",
            captain: "",
            fo: "",
            fe: "",
            crew: "",
            ac: "",
            backup: "",
            mission: "",
            details: "",
            config: "",
            remarks: "",
            pri: "",
            meal: "",
            dco: "",
            type: "flight",
        }
    }

    firebaseSetBool(pilot) {
        if (pilot == "") {
            console.error("invalid pilot");
            return;
        }
        var flightDate = 'flights.' + this.state.date;
        firebase.firestore().collection("pilots").doc(pilot).update({[flightDate]: true})
        .then(function() {
            console.log("Boolean successfully set for pilot");})
        .catch(function(error) {
            console.error("Error setting flight boolean", error);
        })
    }

    verifySubmit() {
        var required = ['captain', 'fo', 'ac', 'mission', 'startTime', 'endTime'];
        required.forEach(field => {
            console.log(field);
            if (this.state[field] == "") {
                Helper.flag(field, "Required");
                this.setState({ok: false});
            }
        })
    }

    onSubmit() { 

        
        this.verifySubmit();
        
        //If there are no errors
        if (document.getElementsByClassName('alert-validate').length == 0) {
            var newEvent = firebase.firestore().collection("events").doc();
            newEvent.set(this.state)
            .then(function() {
                console.log("Event successfully added to events!");})
            .catch(function(error) {
                console.error("Error adding event: ", error);
            });

            this.firebaseSetBool(this.state.captain);
            this.firebaseSetBool(this.state.fo);
            var updates = {};
            updates['events.'+this.state.captain] = firebase.firestore.FieldValue.arrayUnion({'type':'flight', 'startTime': this.state.startTime, 'endTime': this.state.endTime, 'id':newEvent.id});
            updates['events.'+this.state.fo] = firebase.firestore.FieldValue.arrayUnion({'type':'flight', 'startTime': this.state.startTime, 'endTime': this.state.endTime, 'id':newEvent.id});
            var newUpcomingEvents = [   firebase.firestore().collection('pilots').doc(this.state.captain).collection('upcoming-events').doc(),
                                        firebase.firestore().collection('pilots').doc(this.state.fo).collection('upcoming-events').doc()];

            if (this.state.fe) {
                updates['events.'+this.state.fe] = firebase.firestore.FieldValue.arrayUnion({'type':'flight', 'startTime': this.state.startTime, 'endTime': this.state.endTime, 'id':newEvent.id});
                newUpcomingEvents.push(firebase.firestore().collection('pilots').doc(this.state.fe).collection('upcoming-events').doc());
                this.firebaseSetBool(this.state.fe);
            }
            if (this.state.crew) {
                updates['events.'+this.state.crew] = firebase.firestore.FieldValue.arrayUnion({'type':'flight', 'startTime': this.state.startTime, 'endTime': this.state.endTime, 'id':newEvent.id});
                newUpcomingEvents.push(firebase.firestore().collection('pilots').doc(this.state.crew).collection('upcoming-events').doc());
                this.firebaseSetBool(this.state.crew);
            }
            let date = this.state.date;
            firebase.firestore().collection("dates").doc(date).update(updates)
            .then(function() {
                console.log("Event successfully added to dates!");})
            .catch(function(error) {
                firebaseCreateDate(date);
            })


            newUpcomingEvents.forEach((x)=>{x.set({
                ac: this.state.ac,
                captain: this.state.captain,
                flightid: newEvent.id,
                config: this.state.config,
                date: this.state.date,
                fo: this.state.fo,
                fe: this.state.fe,
                crew: this.state.crew,
                details: this.state.details,
                endTime: this.state.endTime,
                startTime: this.state.startTime,})
            .then(function() {
                console.log("Event successfully added to pilots!");})
            .catch(function(error) {
                console.error("Error writing document: ", error);
            })})

            //window.location.reload();
            document.getElementsByClassName("success-modal")[0].style.display = "block";

        }
    }

    renderField(field) {
        const name = field.name;
        const displayName = field.hasOwnProperty("displayName") ? field.displayName.toUpperCase() : field.name.toUpperCase();
        const wrapperClassName = field.size + "-wrapper";
        const fieldClassName = "input"+ (this.state[name] != "" ? " has-val": "");
        var acceptedValues = [];
        if (["captain", "fo", "fe", "crew"].includes(field.name)) {
            acceptedValues = this.props.allPilotIDs;

        }

        //const datalist = field.hasOwnProperty('select') ? field.select : '';
        return (
            <div id={name} className={wrapperClassName + " validate-input"} onFocus={(e)=>{e.target.parentElement.classList.remove("alert-validate"); e.target.parentElement.classList.remove("warn-validate")}}>

            {Helper.getOptionsList('pilots', this.props.allPilotIDs)}
            {Helper.getOptionsList('dcolist', Const.dcolist)}
            {Helper.getOptionsList('aclist', Const.aclist)}
            {Helper.getOptionsList('configlist', Const.configlist)}
            <input className={fieldClassName} type="text" name={name} list={field.selectList} 
                    onBlur={(e)=>{
                        this.setState({[name]: e.target.value.trim()}); 
                        Helper.checkFieldError(name, e.target.value.trim(), acceptedValues)}}/>
            <span className="focus-input" data-placeholder={displayName}></span>
            </div>
            
        )
    }

    renderCustomField(field) {
        switch(field.name) {
            case "flighttime": 
                
                var [start, end] = [this.state.startTime, this.state.endTime];
                var time = "0 HRS 0 MIN";
                var hours = parseInt(end.substring(0, 2))- parseInt(start.substring(0, 2));
                var minutes = parseInt(end.substring(2, 4))- parseInt(start.substring(2, 4));
                
                if (hours < 0) {
                    hours += 24
                }
                if (minutes < 0) {
                    minutes += 60;
                    hours -= 1;
                }
                if (minutes >= 60) {
                    minutes -= 60;
                    hours += 1;
                }
                if (hours >= 0 || minutes >= 0){ 
                    time = hours + " HRS " + minutes + " MIN";
                }
                else {
                    time = "0 HRS 0 MIN";
                }
                return (<div>
                    <input className='input has-val lengthField' type="text" disabled={true} value={time}/>
                </div>);
            
            case "date": 
                return (<div className="medium-wrapper">
                <input className="input has-val validate-input" type="date" name="date" defaultValue={new Date().toDateInputValue()} onBlur={(e)=>{var d = new Date(e.target.value);
                    d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
                    this.setState({date: d.toDateInputValue()});}}/>
                <span className="focus-input" data-placeholder="DATE"></span>
            </div>)
            default: 
                const name = field.name;
                const displayName = field.hasOwnProperty("displayName") ? field.displayName.toUpperCase() : field.name.toUpperCase();
                const fieldClassName = "input validate-input"+ (this.state[name] != ""? " has-val": "")
                return (<div id={name} className={field.size + "-wrapper"}>
                    <input className={fieldClassName} autoComplete="new-password" required={field.required} type="number" name={name} onBlur={(e)=>{this.setState({[name]: e.target.value.trim()});}}/>
                    <span className="focus-input" data-placeholder={displayName}></span>
                </div>);
        }
    }

    renderRow(row) {
        var fields = [];
        Object.values(row).forEach(field => {
            if (field.hasOwnProperty('custom')) {
                fields.push(this.renderCustomField(field));
            }
            else {
                fields.push(this.renderField(field));
            }
            
        });
        return (
            <div className="row-wrapper"> 
                {fields}
            </div>
        )
    }

    renderForm() {
        var rows = []
        Const.flightFormFields.forEach(row => {
            console.log(row);
            rows.push(this.renderRow(row));
        });
        return (
            <div>
                <form className="form" autoComplete="off"  onSubmit={(e)=>{e.preventDefault(); this.onSubmit()}}>
                    {rows}
                    <RenderSuccessDialog/>
                    {Helper.RenderFormButton(this.props.onSubmit, "Add Flight")}
                </form>
            </div>
        );
    }


    componentDidMount() {
    }

    render() {
        return (
            <div>
                {this.renderForm()}
            </div>
        );
    }
}

export default FlightForm;