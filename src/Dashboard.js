import React from 'react';
import './index.css';
import './Dashboard.css';
import firebase from "./Firebase.js";
import ReactGA from 'react-ga';
import Helper from './Helper.js';
import HELI_GRAY from './img/helicopter-gray.png';
import Calendar from './Calendar.js';
import ErrorPage from './ErrorPage.js';

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
Date.prototype.toDateInputValuePos = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() + this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

function initializeReactGA() {
    ReactGA.initialize('UA-168152066-1');
    ReactGA.pageview('/Dashboard');
}

function AddFlightCard(props) {
    return (
        <div className="addFlight">
            <img className="addFlightLogo" src={HELI_GRAY}/>
            <div className="addFlightText"> 
                <h4> No Upcoming Flights </h4>
                <button className="addFlightBtn" onClick={props.changeTab}>Add a Flight</button>
            </div>
        </div>
    );
}

function FlightCard(props) {
    var date = "";
    if (props.data.date == props.today.toDateInputValue()){ date = 'Today';} 
    else if (props.data.date == props.tomorrow.toDateInputValue()) { date = "Tomorrow";} 
    else {var tmp = new Date(props.data.date);
        tmp.setDate(tmp.getDate() + 1);
        date = tmp.toDateString().slice(0,10).replace(' ', ', ');}

    var time = props.data.startTime + ' - ' + props.data.endTime;
    return (
        <div className="flightCard" onClick={props.toggleOverlay.bind(this, props.data.flightid)}>
            <div className="date">
                <h2>{date}</h2>
                <p>{time}</p>
            </div>
            <hr/>
            <div className="flight-card-content">
                <div className="infoLine">
                    <div className="title">
                        <h5>CAPT</h5>
                    </div>
                    <div className="text">
                        <h5>{Helper.parseID(props.data.captain)}</h5>
                    </div>
                </div>
                <div className="infoLine">
                    <div className="title">
                        <h5>FO</h5>
                    </div>
                    <div className="text">
                        <h5>{Helper.parseID(props.data.fo)}</h5>
                    </div>
                </div>
                <div className="infoLine">
                    <div className="title"><h5>A/C</h5></div>
                    <div className="text"><h5>{props.data.ac}</h5></div>
                </div>
                <div className="infoLine">
                    <div className="title"><h5>TYPE</h5></div>
                    <div className="text"><h5>{props.data.details}</h5></div>
                </div>
                <div className="infoLine">
                    <div className="title"><h5>CONFIG</h5></div>
                    <div className="text"><h5>{props.data.config}</h5></div>
                </div>
            </div>
        </div>
    );
}

class Dashboard extends React.Component {

    //TODO: Should not be hardcoded userid
    constructor(props) {
        super(props);
        //name
        this.state = {
            data: {},
            curDate: new Date(),
            hasError: false,
            userid: Helper.parseName(this.props.name),
        }
    }

  /*  initWeek() {
        var week = [];
        var cur = new Date();
        var startOfWeek = moment(cur).startOf('isoweek');
        for (var i =0; i < 5; i++) {
            week.push([startOfWeek.month(), startOfWeek.date()]);
            startOfWeek.add(1, 'day');
        }
        return week; 
    }*/

/*
    setCurWeek(day) {
        var week = [];

        var startOfWeek = this.state.showWeekends ? day.startOf('week') : day.startOf('isoweek');
        var dayCount = this.state.showWeekends ? 7 : 5;
        for (var i =0; i < dayCount; i++) {
            week.push([startOfWeek.month(), startOfWeek.date()]);
            startOfWeek.add(1, 'day');
        }
        
        this.setState({curWeek: week});
        this.getData(week);
    }

    getData(week) {
        var id = this.props.id[0].toLowerCase() + this.props.id.split(' ')[1].toLowerCase();
        this.setState({curWeekData: []});
        week.forEach(day => {
            var d = this.state.curDate.getFullYear() + '-' + (day[0] < 9 ? '0' : '') + (day[0]+1) + '-' + (day[1] < 10 ? '0' : '') + day[1] ;
            firebase.firestore().collection('dates').doc(d).get()
                .then((querySnapshot) => {
                    var tmp = this.state.curWeekData;
                    tmp.push(querySnapshot.data().events[id]);
                    this.setState({curWeekData: tmp});
                })
                .catch(function(error) {
                    console.log("Error getting documents: ", error);
            });
        })
    }
*/


    renderUpcomingEvents() {
        //this.setCurWeek(new Date(this.state.curDate));
        return (
            <Calendar   id={this.props.name} 
                        toggleOverlay={(type,id)=>{this.props.toggleOverlay(type,id)}}
            />
        )
    }

    renderUpcomingFlights() {
        //this.initWeek();
        var cards = [];
        var today = new Date(this.state.curDate);
        var tomorrow = new Date(this.state.curDate);
        tomorrow.setDate(today.getDate() + 1);
        if (this.state.data.length > 0) {
            for (var i= 0; i < this.state.data.length; i++) {
                cards.push(<FlightCard key={this.state.data[i].data().flightid} data={this.state.data[i].data()} today={today} tomorrow={tomorrow} toggleOverlay={(id)=>{this.props.toggleOverlay('flight', id);}}/>)
            }
        }
        else {
            cards.push(<AddFlightCard key={'emptyFlightCard'} changeTab={this.props.changeTab}/>);
        }
        
        return cards
    }

    componentDidMount() {

        //this.setState({userid: (this.props.activeUser[0] + this.props.activeUser.split(' ')[1]).toLowerCase()});
        if (this.props.activeUser) {
            var id = (this.props.activeUser[0] + this.props.activeUser.split(' ')[1]).toLowerCase();
        
            firebase.firestore().collection("pilots").doc(id).collection('upcoming-events').where('date', '>=', this.state.curDate.toDateInputValue())
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    this.setState({data: querySnapshot.docs})
                }
                else {
                    console.log("No entries in document");
                };
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
        }

        //this.getData(this.state.curWeek);

        initializeReactGA();
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        console.log(error, info);
    }

    toggleWeekendView() {
        if (this.state.showWeekends) {
            document.getElementsByClassName('show-weekends-toggle')[0].classList.remove('toggle-active');
            this.setState({showWeekends: false});
        }
        else {
            document.getElementsByClassName('show-weekends-toggle')[0].classList.add('toggle-active');
            this.setState({showWeekends: true});
        }
    }

    render() { 
        if (this.state.hasError) {
            return <ErrorPage/>
          }
        return (
            <div>
                <h2>My Upcoming Flights</h2>
                <div className="upcomingFlights">
                    {this.renderUpcomingFlights()}
                </div>
                {this.renderUpcomingEvents()}
            </div>
            
        )
    };
}

export default Dashboard;