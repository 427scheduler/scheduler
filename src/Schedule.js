import React from 'react';
import firebase from './Firebase.js';
import {firebaseCreateDate} from "./FirebaseHelper.js";
import Helper from "./Helper.js"
import "./Schedule.css";
import RIGHT_BTN from './img/right-arrow.png';
import LEFT_BTN from './img/left-arrow.png';
import ErrorPage from './ErrorPage.js';
import ReactGA from 'react-ga';

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

//Google Anlaytics
function initializeReactGA() {
    ReactGA.initialize('UA-168152066-1');
    ReactGA.pageview('/Schedule');
}


function RenderDate(props) {
    var weekday = props.date.getDay();
    var day = props.date.getDate();
    var month = props.date.getMonth();
    var year = props.date.getFullYear();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November","December"];
    
    if (props.view === 'sm-view') {
        return (
            <div className={'flight-date sm-view'}>
                <h2>{month+" / "+day+" / "+year}</h2>
            </div>
        )
    }
    
    return (
        <div className={'flight-date lg-view'}>
            <h2>{days[weekday] +", "+months[month]+" "+day+", "+year}</h2>
        </div>
    )
}

function RenderDayHeader(props) {
    var displayDate = new Date(props.date);
    var curDate = new Date();
    var diff = Math.round((displayDate.getTime() - curDate.getTime())/(24*60*60*1000));

    // Only show flights for last week to the next 2 weeks
    var disableLeft = diff === -7;
    var disableRight= diff === 14;
    return (
        <div className="day-header">
            <img alt="left" className={'date-btn' + (disableLeft ? ' disabled': '')} src={LEFT_BTN} onClick={()=>{props.changeDate(disableLeft ? 0 : -1)}}></img>
            <RenderDate date={displayDate} view="lg-view"/>
            <RenderDate date={displayDate} view="sm-view"/>
            <img alt="right" className={'date-btn' + (disableRight ? ' disabled': '')} src={RIGHT_BTN} onClick={()=>{props.changeDate(disableRight ? 0 : 1)}}></img>
            <div className="schedule-tabs tabs">
                <button className={props.activeTab === '24HR' ? "schedule-tab tab activeTab": "schedule-tab tab"} onClick={()=>{props.setState('24HR')}}>24HR</button>
                <button className={props.activeTab === 'AM' ? "schedule-tab tab activeTab": "schedule-tab tab"} onClick={()=>{props.setState('AM')}}>AM</button>
                <button className={props.activeTab === 'PM' ? "schedule-tab tab activeTab": "schedule-tab tab"} onClick={()=>{props.setState('PM')}}>PM</button>
            </div>
        </div>
        
    )
}

function Event(props) {
    return (<td><button className={props.name} style={props.style} onClick={props.toggleOverlay} title={props.start+" - "+props.end}/></td>)
}

function createRow(pilot, events, toggleOverlay, mode) {
    var r = [];
    r.push(<td className='pilot-col'>{Helper.parseID(pilot)}</td>);
    for (var i = 0; i < 12 ; i += 1) {
        r.push(<td></td>);
    }
        /*if (events.length > 0) {events.forEach(event => {
            var [type, left, right, id] = [event.type, parseFloat(event.startTime)/100, parseFloat(event.endTime)/100, event.id];
            //If over the hour, then increment by 50%
            var offset = parseInt(left%2) == 0 ? 0 : 4;
            //Divide by 15 minute increments
            offset += (left-parseInt(left))/0.15;
            var style = {width: ((right-left)*50)+'%', left: (offset*12.5)+'%'};
            r[1+parseInt(left/2)] = <Event name={type} style={style} toggleOverlay={()=>{toggleOverlay(type, id)}}/>;
        })*/
        if (events.length > 0) {events.forEach(event => {
            var [type, left, right, id] = [event.type, parseFloat(event.startTime)/100, parseFloat(event.endTime)/100, event.id];
            var skip = false;
            if (mode == "AM") {
                //Display AM events only 
                if (left > 11.59) {skip = true;}
                else if (right > 12) {right = 12}
            }
            if (mode == "PM" && right > 11.59) {
                //Display PM events only 
                if (right < 12) {skip = true;}
                else if (left < 12) {left = 12}
            }
            if (!skip) { 
                var divisor = mode == "24HR" ? 2 : 1;
                var multiplier = mode == "24HR" ? 1 : 2;
                var clear = mode == "PM" ? 12 : 0;
                //If over the hour, then increment by 50%
                var offset = (mode == "24HR" && parseInt(left%2) != 0) ? 4 : 0;
                //Divide by 15 minute increments
                offset += (left-parseInt(left))/0.15;
                var style = {width: ((right-left)*50*multiplier)+'%', left: (offset*multiplier*12.5)+'%'};
                r[1+parseInt(left/divisor)-clear] = <Event name={type} style={style} toggleOverlay={()=>{toggleOverlay(type, id)}} start={event.startTime} end={event.endTime}/>;
            }
        })
    }
    return r;
}

function Day(props) {
    /*var testdata = {'aearhart': [{'startTime': '0530', 'endTime': '0720', 'type': 'flight', 'id': ''}, {'startTime': '1830', 'endTime': '1920', 'type': 'apt', 'id': ''}], 
    'pmitchell': [{'startTime': '0900', 'endTime': '1040', 'type': 'flight', 'id': ''}, {'startTime': '1630', 'endTime': '1920', 'type': 'meeting', 'id': ''}],
    'clindberg': [{'startTime': '1230', 'endTime': '1500', 'type': 'flight', 'id': ''}],
    'cyeager': [{'startTime': '2030', 'endTime': '2120', 'type': 'flight', 'id': ''}, {'startTime': '0530', 'endTime': '0820', 'type': 'apt', 'id': ''}],
    'owright': [{'startTime': '0330', 'endTime': '0720', 'type': 'flight', 'id': ''}],}*/
    var data = props.data;
    var tableRows = [];
    var teamLength = Object.keys(props.teamdata).length;

    //Create table header 
    var tableHeaders = [];
    tableHeaders.push(<th></th>);
    var startIndex, endIndex, inc;
    switch(props.activeTab) {
        case "AM": 
            [startIndex, endIndex, inc] = [0, 12, 1];
            break;
        case "PM": 
            [startIndex, endIndex, inc] = [12, 24, 1];
            break;
        default: 
            [startIndex, endIndex, inc] = [0, 24, 2];
            break;
    }
    for (var i = startIndex; i < endIndex ; i += inc) {
        tableHeaders.push(<th>{(i < 10 ? '0'+i.toString() : i.toString())+'00'}</th>);
    }
    //Create empty columns for gridline
    var rowTemplate = [];
    for (i = 0; i < 12 ; i += 1) {
        rowTemplate.push(<td></td>);
    }

    tableRows.push(<tr className='underline'>{createRow(props.userid, props.userdata, props.toggleOverlay, props.activeTab)}</tr>);

    Object.keys(props.teamdata).forEach(key => {
        if (tableRows.length === teamLength) {
            //Add divider to last element of team 
            tableRows.push(<tr className='underline'>{createRow(key, props.teamdata[key], props.toggleOverlay, props.activeTab)}</tr>);
        }
        else {
            tableRows.push(<tr>{createRow(key, props.teamdata[key], props.toggleOverlay, props.activeTab)}</tr>);
        }
    });
    

    Object.keys(data).forEach(key => {
        tableRows.push(<tr>{createRow(key, data[key], props.toggleOverlay, props.activeTab)}</tr>);
    });

    return (
        <div className="day-container">
            <table className='schedule-table'>
                <thead>
                    <tr>
                        {tableHeaders}
                    </tr>
                </thead>
                <tbody> 
                    {tableRows}
                </tbody>
            </table>
        </div>
        
    )
}

function Legend(props) {
    return (
        <div className="legend-container">
            <div className="legend-color flight"></div>
            <h4 className="legend-entry">Flight</h4>
            <div className="legend-color apt"></div>
            <h4 className="legend-entry">Appointment</h4>
            <div className="legend-color meeting"></div>
            <h4 className="legend-entry">Meeting</h4>
        </div>
    )
}


class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            date: new Date(),
            team: [],
            userid: '',
            userdata: [],
            teamdata: [],
            hasError:false,
            activeTab: '24HR',
        }
    }


    getData(newDate) {
        var date = newDate.getFullYear() + '-' + (newDate.getMonth() < 9 ? '0':'') + (newDate.getMonth()+1) + '-' + (newDate.getDate() < 10 ? '0':'') + (newDate.getDate()) ;

        //get new data
        firebase.firestore().collection("dates").doc(date)
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                var data = querySnapshot.data();
                var team = this.state.team;

                if (data.events) {
                    var tmpteamdata = {};
                    var tmpdata = {};

                    //For each pilot with events today: check if they are user/same team/neither and push accordingly
                    this.setState({userdata: data.events[this.state.userid] || []})
                    team.forEach(p => {
                        if (p != this.state.userid) {
                            tmpteamdata[p] = data.events[p] || []
                        }
                    })

                    Object.keys(data.events).forEach(key => {
                        if(!(team.includes(key) || key === this.state.userid)) {
                            tmpdata[key] = data.events[key];
                        }
                    })
                    this.setState({data: tmpdata, teamdata: tmpteamdata});
                }
            }
            else {
                console.log("Document doesn't exist");
                this.setState({data: null});
            };
        })
        .catch(function(error) {
            //Date doesn't exist 
            firebaseCreateDate(date);
            console.error("ERROR: Couldn't access date: ", error)
        });
    }

    changeDate(offset) {
        if (offset != 0) {
            var newDate = new Date(this.state.date);
            newDate.setDate(newDate.getDate() + offset);
            this.setState({date: new Date(newDate)})
            this.getData(newDate);
        }
    }

    componentDidMount() {
        initializeReactGA();
        
        //Convert displayName to userID
        var id = this.props.user[0].toLowerCase() + this.props.user.split(' ')[1].toLowerCase();
        this.setState({userid: id});
        
         //get team members
         firebase.firestore().collection("pilots").doc(id)
         .get()
         .then((querySnapshot) => {
             if (!querySnapshot.empty) {
                 var newteam = querySnapshot.data().team;
                 firebase.firestore().collection("pilots").doc(newteam.toString())
                 .get()
                 .then((querySnapshot) => {
                     if (!querySnapshot.empty) {
                         this.setState({team: querySnapshot.data().pilots});
                         this.getData(new Date());
                     }
                     else {
                         console.log("Document doesn't exist");
                         this.setState({team: null});
                     };
                 });  
             }
             else {
                 console.log("Document doesn't exist");
                 this.setState({team: null});
             };
         })
         .catch(function(error) {
             console.log("Error getting documents: ", error);
         });


         
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
        return (
            <div className='page-container'>
                <RenderDayHeader date={this.state.date} changeDate={(i)=>{this.changeDate(i)}} setState={(newTab)=>{this.setState({activeTab: newTab})}} activeTab={this.state.activeTab}/>
                <Day toggleOverlay={(event,id)=>{this.props.toggleOverlay(event, id)}} data={this.state.data} teamdata={this.state.teamdata}
                    userid={this.state.userid} 
                    userdata={this.state.userdata}
                    activeTab={this.state.activeTab}/>
                <Legend/>
            </div>
        )
    }
}

export default Schedule;