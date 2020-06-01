import React from "react";
import "./Form.css";
import firebase from "./Firebase.js";
import Const from "./Const.js";
import Helper from "./Helper.js";
import {RenderSuccessDialog} from "./Overlay.js";

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

class MeetingForm extends React.Component {
    constructor(props) { 
        super(props);
        //allPilotIDs
        this.state = {
            title: "", 
            type: "meeting", 
            date: new Date().toDateInputValue(),
            startTime: 0,
            endTime: 0,
            location: "", 
            confLink: "",
            notes: "",
            userid: "",
            p1:"",p2:"",p3:"",p4:"",
        }
    }

    checkError(field, value) {
        switch (field){
        case 'p1':
            if (!this.props.allPilotIDs.includes(value) && value != "") {
                Helper.flag('p1', 'Invalid pilot');
                this.setState({ok: false});
            }
            else {this.setState({ok: true});}
            break;
        case 'p2':
            if (!this.props.allPilotIDs.includes(value) && value != "") {
                Helper.flag('p2', 'Invalid pilot');
                this.setState({ok: false});
            }
            else {this.setState({ok: true});}
            break;
        case 'p3':
            if (!this.props.allPilotIDs.includes(value) && value != "") {
                Helper.flag('p3', 'Invalid pilot');
                this.setState({ok: false});
            }
            else {this.setState({ok: true});}
            break;
        case 'p4':
            if (!this.props.allPilotIDs.includes(value) && value != "") {
                Helper.flag('p4', 'Invalid pilot');
                this.setState({ok: false});
            }
            else {this.setState({ok: true});}
            break;
        case 'startTime':
            if (isNaN(value) || !Helper.timeValid(value)) {
                Helper.flag('startTime', 'Enter between 0000 and 2359');
                this.setState({ok: false});
            }
            else if (parseInt(value) >= parseInt(this.state.endTime)) {
                Helper.flag('endTime', 'Return must be after dep.');
                this.setState({ok: false});
            }
            else {this.setState({ok: true});}
            break;
        case 'endTime':
            if (isNaN(value) || !Helper.timeValid(value)) {
                Helper.flag('endTime', 'Enter between 0000 and 2359');
            }
            else if (parseInt(this.state.startTime) >= parseInt(value)) {
                Helper.flag('endTime', 'Return must be after dep.');
                this.setState({ok: false});
                }
                else {this.setState({ok: true});}
                break;

        default: 
            this.setState({ok: true});
            break;
        }
    }

    onSubmit() {
        var required = ['title', 'startTime', 'endTime'];
        var remove = document.getElementsByClassName('alert-validate');
        for (let item of remove) {
            item.classList.remove('alert-validate');
        }
        required.forEach(field => {
            if (this.state[field] == "") {
                Helper.flag(field, "Required");
            }
        })


        if (document.getElementsByClassName('alert-validate').length == 0) {
            //TODO TODO TODO : now we have 4 users potentially!!! How to deal with this? 
            //TODO: UPDATE OVERLAY TO DISPLAY THIS 
            var newEvent = firebase.firestore().collection("events").doc()
            newEvent.set(this.state)
            .then(function() {
                console.log("Event successfully added to events!");})
            .catch(function(error) {
                console.error("Error adding event: ", error);
            });

            var users = [this.state.userid, this.state.p1, this.state.p2, this.state.p3, this.state.p4];
            users.forEach((user) => {
                var field = 'events.'+user;
                firebase.firestore().collection("dates").doc(this.state.date).update({
                    [field]: firebase.firestore.FieldValue.arrayUnion({'type':'meeting', 'startTime': this.state.startTime, 'endTime': this.state.endTime, 'id':newEvent.id})
                    })
                .then(function() {
                    console.log("Event successfully added to dates!");})
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                })
            })
            
            document.getElementsByClassName("success-modal")[0].style.display = "block";
        }
    }

    componentDidMount() {
        this.setState({userid: (this.props.activeUser[0] + this.props.activeUser.split(' ')[1]).toLowerCase()});
    }

    renderField(field) {
        const name = field.name;
        const displayName = field.hasOwnProperty("displayName") ? field.displayName.toUpperCase() : field.name.toUpperCase();
        const wrapperClassName = field.size + "-wrapper";
        const fieldClassName = "input"+ (this.state[name] != "" ? " has-val": "");
        var acceptedValues = [];
        if (["p1", "p2", "p3", "p4"].includes(field.name)) {
            acceptedValues = this.props.allPilotIDs;

        }

        //const datalist = field.hasOwnProperty('select') ? field.select : '';
        return (
            <div id={name} className={wrapperClassName + " validate-input"} onFocus={(e)=>{e.target.parentElement.classList.remove("alert-validate")}}>

            {Helper.getOptionsList('pilots', this.props.allPilotIDs)}
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
            
            case "date": 
                return (<div className="medium-wrapper">
                <input className="input has-val validate-input" type="date" name="name" defaultValue={new Date().toDateInputValue()} onBlur={(e)=>{var d = new Date(e.target.value);
                    d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
                    this.setState({date: d.toDateInputValue()});}}/>
                <span className="focus-input" data-placeholder="DATE"></span>
            </div>)
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
        Const.meetingFormFields.forEach(row => {
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

    render() {
        return (
            <div>
                {this.renderForm()}
            </div>
        );
    }

}

export default MeetingForm;