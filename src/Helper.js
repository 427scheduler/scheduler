import React from "react";
import Const from "./Const.js";
import firebase from "./Firebase.js";

const Helper = {
    parseID(id) {
        //aearhart to A. Earhart 
        if (id) {
        return id[0].toUpperCase() + ". " + id[1].toUpperCase() + id.slice(2);}
    },

    parseName(name) {
        //Amelia Earhart to aearhart
        if (name) {
        return name[0].toLowerCase() + name.slice(name.indexOf(' ')+1).toLowerCase();}
    },

    getLastName(id) {
        //aearhart to Earhart
        if (id != "") {
            return id[1].toUpperCase() + id.slice(2);
        }
        return "";
    },    

    getshortenedDate(d) {
        //YYYY-MM-DD
        return (
            d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +  ("0" + d.getDate()).slice(-2)
        )
    },

    sortEvents(events) {
        var sortedEvents = []
        events.forEach((event) => {
            if (sortedEvents.length == 0) {
                sortedEvents.push(event)
            }
            else {
                var i = 0;
                while (i < sortedEvents.length && parseInt(sortedEvents[i].startTime) < parseInt(event.startTime) ) {
                    i += 1;
                }
                //Insert at index i
                sortedEvents.splice(i, 0, event);
            }
        })
        return sortedEvents
    },


    getOptionsList(id, values) {
        //Creates a datalist object for dropdown options
        var l = [];
        values.forEach((v) => {
            l.push(<option value={v}/>);
        });
        return (<datalist id={id}>{l}</datalist>);
    },


    checkFieldError(field, value, acceptedValues) {
        var ok = true;
        switch (field){
            case 'captain':
            case 'fe':
            case 'fo':
            case 'crew':
            case 'p1':
            case 'p2':
            case 'p3':
            case 'p4':
                if (!acceptedValues.includes(value) && value != "") {
                    this.flag(field, 'Invalid pilot');
                }
                else {
                    if (document.getElementsByName("endTime")[0].value != '' && document.getElementsByName("startTime")[0].value != '') {
                        this.checkConflict(value, document.getElementsByName('date')[0].value, document.getElementsByName("endTime")[0].value, document.getElementsByName("startTime")[0].value, field)

                    }
                }
                break;
            case 'startTime':
                if (isNaN(value) || !this.timeValid(value)) {
                    this.flag('startTime', 'Enter between 0000 and 2359');
                    ok = false;
                }
                else if (parseInt(value) >= parseInt(document.getElementsByName("endTime")[0].value)) {
                    this.flag('startTime', 'Return must be after dep.');
                    ok = false;
                }
                else {ok = true;}
                break;
            case 'endTime':
                if (isNaN(value) || !this.timeValid(value)) {
                    this.flag('endTime', 'Enter between 0000 and 2359');
                    ok = false;
                }
                else if (parseInt(document.getElementsByName("startTime")[0].value) >= parseInt(value)) {
                    this.flag('endTime', 'Return must be after dep.');
                    ok = false;
                }
                else {ok = true;}
                break;
            case 'dco':
                if (!(Const.dcolist.includes(value.toUpperCase()))) {
                    this.flag('dco', 'Must be DCO/DNCO/DPCO');
                    ok = false;
                }
                else {ok = true;}
                break;
            case 'config':
                if (!(Const.configlist.includes(value.toUpperCase())) && value != '') {
                    this.flag('config', 'Config not accepted. See dropdown.');
                    ok = false;
                }
                else {ok = true;}
                break;
            case 'ac':
                if (!(Const.aclist.includes(value.toUpperCase()))) {
                    this.flag('ac', 'AC not valid');
                    ok = false;
                }
                else {ok = true;}
                break;
            case 'backup':
                if (!(Const.aclist.includes(value.toUpperCase())) && value != '') {
                    this.flag('backup', 'Backup not valid');
                    ok = false;
                }
                else {ok = true;}
                break;
            case 'pri':
                if (!Const.prilist.includes(value.toUpperCase()) && value != '') {
                    this.flag('pri', 'Must be TASK or 1-6');
                    ok = false;
                }
                else {ok = true;}
                break;
            default: 
                ok = true;
                break;
            }
    },

    timeValid(time) {
        return time.length === 4 && parseInt(time.slice(0,2)) < 24 && parseInt(time.slice(2)) < 60;
    },


    flag(field, message) {
        var element = document.getElementById(field);
        element.setAttribute('data-validate', message);
        element.classList.add('alert-validate');
    },
    warn(field, message) {
        var element = document.getElementById(field);
        element.setAttribute('data-validate', 'Conflict');
        element.classList.add('warn-validate');
    },


    RenderFormButton(onSubmit, text) {
        return (
            <div className="container-form-btn">
                <div className="wrap-form-btn">
                    <div className="form-bgbtn"></div>
                    <button className="form-btn" onClick={onSubmit}>
                        {text}
                    </button>
                </div>
            </div>
        );
    },
    
    checkConflict(pilot, date, end, start, field) {
        //Error checking
        
        firebase.firestore().collection("dates").doc(date)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.exists) {
                var events = querySnapshot.data().events[pilot];
                if (events) {
                    events.forEach((event) => {
                        //console.log(event.startTime, event.endTime)
                        //console.log(start, end)
                        //Check: [{}], {[}] and [{]}, {[]}
                        if ((event.startTime <= end && end <= event.endTime) || (start <= event.endTime && event.endTime <= end)) {
                            this.warn(field);
                        } 
                    })
                }
            }
        }
            
        )
        .catch(function(error) {
            console.error("Error adding event: ", error);
        });
    }

}




export default Helper;