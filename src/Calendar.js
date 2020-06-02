import React from 'react';
import moment from 'moment'
import firebase from "./Firebase.js";
import './Dashboard.css';
import Helper from './Helper.js';
import RIGHT_BTN from './img/right-arrow.png';
import LEFT_BTN from './img/left-arrow.png';
import Switch from './Switch.js';

function DayHeader(props) {
    return (
        
        <div className='dayHeader'>
            <h3 id='date'>{props.day + "  "}</h3><h3>{props.date}</h3>
        </div>
    )
}

function DayContents(props) {
    var content = [];
    if (props.curDayData) {
        var sortedDayData = Helper.sortEvents(props.curDayData);

        sortedDayData.forEach(event => {
            var [type, start, end, details] = [event.type, event.startTime, event.endTime, event.title];
            var h = Math.max(end-start, 60);
            content.push(
                <div key={event.type+event.startTime+event.endTime} className={type+'Event'} style={{height: (h*0.6)+'px'}} onClick={()=>{props.toggleOverlay(type, event.id)}}>
                    <p>{start + " - " +end}</p>
                    <h5 className='name'>{type[0].toUpperCase()+type.slice(1,)}</h5>
                    <h6>{details}</h6>
                </div>
            )
        });
    }
    return content;
}

function DayView(props) {
    return (
        <div className='dayView'>
            <DayHeader day={props.day} date={props.date}/>
            <DayContents events={props.events} curDayData={props.curDayData} toggleOverlay={(type,id)=>{props.toggleOverlay(type,id)}}/>
        </div>
    )
}

function WeekView(props) {
    var dayCount = props.curWeek.length;
    var days = dayCount == 7 ? ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'] : ['Mon', 'Tues', 'Wed', 'Thur', 'Fri'];
    var week = props.curWeek;
    var weekContent = [];

    for (var i=0; i < dayCount; i++) {
        //console.log(props.curWeekData[i]);
        weekContent.push(<DayView
                        key={week[i].date()} day={days[i]} 
                        date={week[i].date()} 
                        curDayData={props.curWeekData[i]} 
                        toggleOverlay={(type,id)=>{props.toggleOverlay(type,id)}}/>)
    }

    return (
        <div className="weekView">{weekContent}</div>)
}

function getCurWeekDates(showWeekends, date) {
    //Getting dates in the week

    //Edge case: if a Sunday is selected and only weekDays are shown, show the next week
    if (date.format('dddd')=="Sunday") {
        var day = showWeekends ? date : date.clone().add(1, 'day');
    }
    else {var day = showWeekends ? date.startOf('week') : date.startOf('isoweek');}

    var week = [];
    var dayCount = showWeekends ? 7 : 5;

    for (var i =0; i < dayCount; i++) {
        week.push(day);
        day = day.clone().add(1, 'day');
    }
    return week
}

function WeekdaysHeader() {
    var weekdayShort = moment.weekdaysShort();
    var content = []
    for (var i = 0; i < 7; i++) {
        content.push(<th key={weekdayShort[i]} className="week-day">
        {weekdayShort[i]}
       </th>);
    }

    return content;
}



function DaysOfMonth(props) {
    var m = props.selectedDate.clone().format("MM");
    var y = props.selectedDate.clone().format("YYYY");
    //var curWeek = getCurWeekDates(props.showWeekends, props.selectedDate.clone())

    var blanks = [];
    for (let i = 0; i < props.firstDayOfMonth; i++) {
      blanks.push(
        <td key={'blanks'+i} className="calendar-day empty">{""}</td>
      );
    }
    var parsedWeek = {firstDay: props.curWeek[0].date(), month: props.curWeek[0].month(), doesOverlap: (props.curWeek[0].date()>22 && props.curWeek[4].date() < 6), days: []};
    props.curWeek.forEach(a => {parsedWeek.days.push(a.date())});
    var daysInMonth = [];
    var selectedDateMonth = props.selectedDate.month();
    
    for (let d = 1; d <= props.selectedDate.daysInMonth(); d++) { 
        var currentDay = "";   
        if (selectedDateMonth == parsedWeek.month && parsedWeek.days.includes(d) && d >= parsedWeek.days[0]) {
            currentDay = "curweek";
        }
        var testDate = y + "-" + m + "-" + (d < 10 ? '0':'') + d;
        var dot = props.flights && props.flights[testDate] == true ? 'cal-dot hasFlight' : 'cal-dot';
        daysInMonth.push(  
            <td key={d} className={`calendar-day ${currentDay}`}>   
                <span onClick={e => { props.setCurWeek(moment().month(selectedDateMonth).date(d));}} >{d}</span>
                <div className={dot}></div>
            </td>);
    }
    var totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
        if (i % 7 !== 0 ) {
          cells.push(row); // if index not equal 7 that means not go to next week
        } else {
            rows.push(cells); // when reach next week we contain all td in last week to rows : we're excluding weekends
            cells = []; // empty container 
            cells.push(row); // in current loop we still push current row to new container
        }
        if (i === totalSlots.length - 1) { // when end loop we add remain date
          rows.push(cells);
        }
    });

    let daysinmonth = rows.map((d, i) => {
    return <tr key={'row'+i}>{d}</tr>;
    });

    return (
        <table className="calendar-table">
        <thead>
            <tr>{WeekdaysHeader()}</tr>
        </thead>
        <tbody>{daysinmonth}</tbody>
        </table>
    )
}

class Calendar extends React.Component {
    constructor(props) {
        super(props); 
            /*  curDate : 
            *   id : 
            *   showWeekends : bool
            *   toggleOverlay()
            *   setCurWeek(day)
            */
        this.state = {
            selectedDate: moment(), 
            flights: {},
            showWeekends: false,
            curWeekData: [],
            curWeek: []
        }
    }

    firstDayOfMonth = () => {
        let dateObject = moment(this.state.selectedDate);
        let firstDay = moment(dateObject)
                     .startOf("month")
                     .format("d"); 
       return firstDay;
    };
 
    month = () => {
        return this.state.selectedDate.format("MMMM");};
    year = () => {
        return this.state.selectedDate.format("YYYY");
    }

    onPrev = () => {
        this.setState({selectedDate: this.state.selectedDate.subtract(1, 'month')});
    };
    onNext = () => {
        this.setState({selectedDate: this.state.selectedDate.add(1, 'month')});
    };

    componentWillMount() {

        //Retrieving data with showWeekends as OFF by default
        this.getWeekData(false, this.state.selectedDate);
        
        //Convert displayName to userID
        if (this.props.id) {
            var id = this.props.id[0].toLowerCase() + this.props.id.split(' ')[1].toLowerCase();

            firebase.firestore().collection('pilots').doc(id).get()
            .then((querySnapshot) => {
                this.setState({flights: querySnapshot.data().flights})
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
        }
    }

    selectDate(date) {
        this.setState({selectedDate: date});
        this.getWeekData(this.state.showWeekends, date);
    }

    toggleWeekendView() {
        console.log("toggleWeekendView: ", this.state.selectedDate);
        var showWeekends = !this.state.showWeekends;
        this.getWeekData(showWeekends, this.state.selectedDate)
        this.setState({showWeekends: showWeekends});
    }

    getWeekData(showWeekends, date) {
        //Getting dates in the week
        console.log(showWeekends, date);

        if (this.props.id) {
            var week = getCurWeekDates(showWeekends, date);
            var id = this.props.id[0].toLowerCase() + this.props.id.split(' ')[1].toLowerCase();
            this.setState({curWeek: week});
            console.log(showWeekends, date);
            console.log(week);

            this.setState({curWeekData: []});
            week.forEach(day => {
                var d = day.format('YYYY') + '-' + day.format('MM') + '-' + day.format('DD') ;
                console.log(d);
                firebase.firestore().collection('dates').doc(d).get()
                    .then((querySnapshot) => {
                        var events = querySnapshot.get("events");
                        var newData = this.state.curWeekData;
                        if (querySnapshot.exists && events != undefined) {
                            newData.push(events[id]);
                            console.log(d, events[id])
                        }
                        else {
                            newData.push(undefined);
                        }
                        console.log(newData);
                        this.setState({curWeekData: newData});
                    })
                    .catch(function(error) {
                        console.log("Error getting documents: ", error);
                });
            })
        }
    }

    render () {
        var firstDay = this.firstDayOfMonth();

        return (
            <div>
                <div className="my-schedule-div">
                    <h2>My Schedule</h2>
                    <div className='weekend-toggle-div'>
                        <button className="show-weekends-toggle" onClick={this.toggleWeekendView.bind(this)}>Show Weekends</button>
                        <Switch isOn={this.state.showWeekends} handleToggle={this.toggleWeekendView.bind(this)}/>
                    </div>
                </div>
                <div className="upcomingEvents">
                    <WeekView  
                                selectedDate={this.state.selectedDate}
                                curWeek={this.state.curWeek}
                                curWeekData={this.state.curWeekData}
                                toggleOverlay={(type,id)=>{this.props.toggleOverlay(type,id)}}/>
                    
                    <div className="monthView">
                        <div className="month-calendar">
                            <img className='month-btn' src={LEFT_BTN} onClick={e => {this.onPrev();}}></img>
                            <div className="month-calendar-header">{this.month() + " " + this.year()}</div>
                            <img className='month-btn' src={RIGHT_BTN} onClick={e => {this.onNext();}}></img>
                        </div>
                        <DaysOfMonth 
                                    showWeekends={this.state.showWeekends}
                                    setCurWeek={(day)=>{this.selectDate(day)}} 
                                    curWeek={this.state.curWeek}
                                    selectedDate={this.state.selectedDate} 
                                    firstDayOfMonth={firstDay}
                                    flights={this.state.flights}/>
                    </div>
                </div>
            </div>)
    }
}

export default Calendar;