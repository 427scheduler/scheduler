import React from 'react';
import "./Flights.css";
import RIGHT_BTN from './img/right-arrow.png';
import LEFT_BTN from './img/left-arrow.png';
import firebase from "./Firebase.js";
import Helper from "./Helper.js";
import {firebaseCreateDate} from "./FirebaseHelper.js";
import HELI_BLUE from './img/heli-blue-front.jpeg';
import HELI_DARK from './img/heli-dark-front.jpeg';
import HELI_LIGHT from './img/heli-light-front.jpeg';
import ErrorPage from './ErrorPage.js';
import ReactGA from 'react-ga';
import Export from './Export.js';

const headers = ['ETD', 'ETR', 'AC', 'CREW', 'MISSION', 'DETAILS', 'CONFIG', 'SQ PRI', 'DCO'];
const menu_timeout_length = 200;

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

function initializeReactGA() {
    ReactGA.initialize('UA-168152066-1');
    ReactGA.pageview('/Flights');
}

/*
function date(curDate) {
    //var today = new Date();
    var weekday = curDate.getDay();
    var day = curDate.getDate();
    var month = curDate.getMonth();
    var year = curDate.getFullYear();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November","December"];
    return (
        <div className='flight-date'>
            <h2>{days[weekday] +", "+months[month]+" "+day+", "+year}</h2>
        </div>
    )
}*/

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

function RenderMore(props) {
    return (
        <div className={"more" + (props.open ? " show-more-menu" : '')} onMouseEnter={props.showMenu} onMouseLeave={props.hideMenu} >
        <button id="more-btn" className="more-btn" aria-hidden={!props.open}>
            <span className="more-dot"></span>
            <span className="more-dot"></span>
            <span className="more-dot"></span>
        </button>
        <div className="more-menu" onMouseEnter={props.enterMenuOpt} onMouseLeave={props.leaveMenuOpt}>
            <div className="more-menu-caret">
                <div className="more-menu-caret-outer"></div>
                <div className="more-menu-caret-inner"></div>
            </div>
            <ul className="more-menu-items" tabindex="-1" role="menu" aria-labelledby="more-btn" aria-hidden="true">
                <li className="more-menu-item" role="presentation">
                    <button type="button" className="more-menu-btn" role="menuitem" onClick={() => {props.hideMenu(); props.prepareForExport();}}>Export</button>
                </li>
            </ul>
        </div>
    </div>
    )
}

function RenderFlightDayHeader(props) {
    var displayDate = new Date(props.date);
    var curDate = new Date();
    var diff = Math.round((displayDate.getTime() - curDate.getTime())/(24*60*60*1000));

    // Only show flights for last 3 days to the next 2 weeks
    var disableLeft = diff === -3;
    var disableRight= diff === 14;

    return (
        <div className="flight-day-header">
            <img className={'date-btn' + (disableLeft ? ' disabled': '')} src={LEFT_BTN} onClick={()=>{props.changeDate(disableLeft ? 0 : -1)}}></img>
            <RenderDate date={displayDate} view="lg-view"/>
            <RenderDate date={displayDate} view="sm-view"/>
            <img className={'date-btn' + (disableRight ? ' disabled': '')} src={RIGHT_BTN} onClick={()=>{props.changeDate(disableRight ? 0 : 1)}}></img>
            <RenderMore open={props.open} showMenu={props.showMenu} hideMenu={props.hideMenu} enterMenuOpt={props.enterMenuOpt} leaveMenuOpt={props.leaveMenuOpt} prepareForExport={props.prepareForExport}/>
        </div>
    )
}

function RenderFlightDay(props) {
    var tableHeaders = [];
    headers.forEach(title => {
        tableHeaders.push(<th>{title}</th>)
    });
    var tableRows = [];
    var meals = 0;
    
    if (props.data != null) {
        props.data.forEach(entry => {
        if (props.test) {
            var d = entry;
        }
        else {
            var d = entry.data();
        }
        if (parseInt(d.endTime) >= 2000) {
            //Meals will be provided 
            meals += 2;
            meals += d.fe != "" ? 1 : 0;
            meals += d.crew != "" ? 1 : 0;
        }
        var fe = d.fe != '' ? ' | ' + Helper.getLastName(d.fe) : '';
        var crew = d.crew != '' ? ' | ' + Helper.getLastName(d.crew) : '';
        var r = [<td className='etd'>{d.startTime}</td>,
        <td className='etr'>{d.endTime}</td>,
        <td className='ac'><div className='ac-wrap'>{d.ac}</div></td>,
        <td className='crew'>{Helper.getLastName(d.captain) + ' | ' + Helper.getLastName(d.fo) + fe + crew}</td>,
        <td className='mission'>{d.mission}</td>,
        <td className='details'>{d.details}</td>,
        <td className='config'>{d.config}</td>,
        <td className='pri'>{d.pri + ' SOA'}</td>,
        <td className='dco'><div className={"dot "+d.dco+"status"}></div></td>,

        ];
        
        var startTime = parseInt(d.startTime);
        tableRows.push(<tr className={(props.curTime.getDate() == props.date.getDate() && startTime < props.curTime.getHours()*100+props.curTime.getMinutes()) ? 'expired':''} onClick={props.toggleOverlay.bind(this,entry.id)}>{r}</tr>);
        })
        props.setMeals(meals);

        return (
            <div className="flight-day">
                <table>
                    <tr>
                        {tableHeaders}
                    </tr>
                    {tableRows}
                </table>
            </div>
        )
    }
    else {
        return (
            <div className="noFlights">
                <div className="noFlightsContent">
                    <img className="noFlightsLogo" src={HELI_DARK}/>
                    <img className="noFlightsLogo" src={HELI_BLUE}/>
                    <img className="noFlightsLogo" src={HELI_LIGHT}/>
                <hr/>
                </div>
                <div className="noFlightsText">
                    <p>No flights today</p>
                </div>
            </div>
        )
    }
    
}


function getRandom(x, y) {
    var min = Math.ceil(x);
    var max = Math.floor(y);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function RenderFlightDayBox(props) {
    return (
        <div className="flight-day-box">
            <RenderFlightDayHeader date={props.date} changeDate={(offset)=>{props.changeDate(offset)}} open={props.open}
                                    showMenu={props.showMenu}
                                    hideMenu={props.hideMenu}
                                    enterMenuOpt={props.enterMenuOpt}
                                    leaveMenuOpt={props.leaveMenuOpt}
                                    prepareForExport={props.prepareForExport}/>
            <RenderFlightDay date={props.date} test={props.test} setMeals={(m)=>{props.setMeals(m)}} data={props.data} curTime={props.curTime} toggleOverlay={(id)=>{props.toggleOverlay(id)}}/>
        </div>
    )
}

function RenderInfoBox(props) {
    return (
        <div className="info-box">
            <div className="info-title">
                <h5>{props.title}</h5>
            </div>
            <div className="info-content" contentEditable={props.edit} suppressContentEditableWarning={true} onBlur={(event)=>{props.updateDayStats(props.id, event.target.textContent);}}>
                <h5>{props.value[props.id]}</h5>
            </div>
        </div>
    )
}

function RenderInfoBar(props) {
    const default_info = {"EVENING TWILIGHT":props.twilightciv, "SNAGS DESK SGT": props.desksgtday, "DUTY MTP": props.mtp, "SDO":props.sdo, "FDO": props.fdoday, "DUTY GROUND RUN": props.groundrun};
    var boxes = [];
    boxes.push(<RenderInfoBox title={"EVENING TWILIGHT"} value={props} id={'twilightciv'} updateDayStats={(f, e)=>{props.updateDayStats(f,e)}} edit={true}/>)
    boxes.push(<RenderInfoBox title={"SNAGS DESK SGT"} value={props} id={'desksgtday'} updateDayStats={(f, e)=>{props.updateDayStats(f,e)}} edit={true}/>)
    boxes.push(<RenderInfoBox title={"DUTY MTP"} value={props} id={'mtp'} updateDayStats={(f, e)=>{props.updateDayStats(f,e)}} edit={true}/>)
    boxes.push(<RenderInfoBox title={"SDO"} value={props} id={'sdo'} updateDayStats={(f, e)=>{props.updateDayStats(f,e)}} edit={true}/>)
    boxes.push(<RenderInfoBox title={"FDO"} value={props} id={'fdoday'} updateDayStats={(f, e)=>{props.updateDayStats(f,e)}} edit={true}/>)
    boxes.push(<RenderInfoBox title={"DUTY GROUND RUN"} value={props} id={'groundrun'} updateDayStats={(f, e)=>{props.updateDayStats(f,e)}} edit={true}/>)
    boxes.push(<RenderInfoBox title="MEALS" value={{'meals': props.meals}} id={'meals'} edit={false}/>)
    
    return (
        <div className="info-bar">
            <div className="time-title">
                <h5>CURRENT TIME</h5>
            </div>
            <div className="time">
                <h2>{(props.curTime.getHours()<10?"0":"")+props.curTime.getHours()+':'+(props.curTime.getMinutes()<10?"0":"")+props.curTime.getMinutes()}</h2>
            </div>
            {boxes}
        </div>
    )
}

class Flights extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curTime: new Date(),
            date: new Date(),
            data: null,
            //testData: generateTestData(),
            twlightnaut: "N/A",
            twilightciv: "N/A",
            desksgtday: "N/A", 
            desksgnight: "N/A", 
            mtp: "N/A", 
            sdo: "N/A",
            fdoday: "N/A",
            fdonight: "N/A",
            meals: 0,
            groundrun: "N/A",
            hasError: false,
            mouseOverMenu: false,
            mouseOverMenuOpt: false,
        }
    }
    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
        this.getData(new Date());
        initializeReactGA();
    }

    componentWillUnmount() {clearInterval(this.timerID);}

    tick() {this.setState({curTime: new Date()});}


    showMenu() {
        this.setState({ mouseOverMenu: true });
    }
    hideMenu() {
        setTimeout(() => {
            this.setState({ mouseOverMenu: false });
          }, menu_timeout_length);
    }
    enterMenuOpt = () => {
        this.setState({ mouseOverMenuOpt: true });
      }
    
    leaveMenuOpt = () => {
         setTimeout(() => {
          this.setState({ mouseOverMenuOpt: false });
         }, menu_timeout_length);
    }


    prepareForExport() {
        //Get all ID's of flights happening today 
        var ids = [];
        if (this.state.data) {

            this.state.data.docs.forEach((entry)=> {
                console.log(entry.id, " ", entry.data().startTime);
                ids.push(entry.id);
            })
        }

        //Get all info for the day
        var dayInfo = {
            date: this.state.date,
            twilightnaut: this.state.twlightnaut,
            twilightciv: this.state.twilightciv,
            desksgtday: this.state.desksgtday, 
            desksgnight: this.state.desksgnight,
            mtp: this.state.mtp,
            sdo: this.state.sdo,
            fdoday: this.state.fdoday,
            fdonight: this.state.fdonight,
            meals: this.state.meals,
            groundrun: this.state.groundrun};
        //Export 
        Export(ids, dayInfo);
    }


    updateDayStats(field, newValue) {
        if (this.state[field] !== newValue) {
            this.setState({[field]: newValue});
            var date = this.state.date.getFullYear() + '-' + (this.state.date.getMonth() < 9 ? '0':'') + (this.state.date.getMonth()+1) + '-' + (this.state.date.getDate() < 10 ? '0':'') + (this.state.date.getDate());
            
            firebase.firestore().collection("dates").doc(date).set({
                [field]: newValue
                }, {merge: true})
                .then(function() {
                console.log("Document successfully written!");
                })
                .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }
    }    

    getData(newDate) {
        var date = newDate.getFullYear() + '-' + (newDate.getMonth() < 9 ? '0':'') + (newDate.getMonth()+1) + '-' + (newDate.getDate() < 10 ? '0':'') + (newDate.getDate()) ;
        console.log("DATE: " + date);
        //get new data
        firebase.firestore().collection("events").where('type', '==', 'flight').where('date', '==', date).where('startTime', '>=', '0000').orderBy("startTime")
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                this.setState({data: querySnapshot})
            }
            else {
                console.log("Document doesn't exist");
                this.setState({data: null});
            };
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });

        firebase.firestore().collection("dates").doc(date)
        .get()
        .then((querySnapshot) => {
            var d = querySnapshot.data();
            this.setState({
                //TODO: show civil and day/night
                twilightciv: d.twilightciv != null ?  d.twilightciv : "N/A",
                twilightnaut: d.twilightnaut != null ? d.twilightnaut : "N/A",
                desksgtday: d.desksgtday != null ? d.desksgtday : "N/A", 
                desksgtnight: d.desksgtnight != null ? d.desksgtnight : "N/A", 
                mtp: d.mtp != null ?  d.mtp: "N/A", 
                sdo: d.sdo != null ?  d.sdo: "N/A", 
                fdoday: d.fdoday != null ? d.fdoday  : "N/A",
                fdonight: d.fdonight != null ? d.fdonight : "N/A",
                groundrun: d.groundrun != null ? d.groundrun : "N/A"})
            
        })
        .catch(function(error) {
            firebaseCreateDate(date);
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

    setMeals(m) {
        if (m != this.state.meals && m >= 0 ) {
            this.setState({meals: m});
        }
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
            <div className='container'>
                <RenderFlightDayBox date={this.state.date} 
                                    data={this.state.data}
                                    test={this.state.data == null}
                                    curTime={this.state.curTime} 
                                    toggleOverlay={(id)=>{this.props.toggleOverlay(id)}} 
                                    changeDate={(offset)=>{this.changeDate(offset)}}
                                    setMeals={(m)=>{this.setMeals(m)}}
                                    open={this.state.mouseOverMenu || this.state.mouseOverMenuOpt}
                                    showMenu={this.showMenu.bind(this)}
                                    hideMenu={this.hideMenu.bind(this)}
                                    enterMenuOpt={this.enterMenuOpt.bind(this)}
                                    leaveMenuOpt={this.leaveMenuOpt.bind(this)}
                                    prepareForExport={this.prepareForExport.bind(this)}/>
                <RenderInfoBar date={this.state.date} curTime={this.state.curTime} updateDayStats={(f,e)=>{this.updateDayStats(f,e)}}
                                twilightciv={this.state.twilightciv}
                                desksgtday={this.state.desksgtday} 
                                mtp={this.state.mtp}
                                sdo={this.state.sdo}
                                fdoday={this.state.fdoday}
                                groundrun={this.state.groundrun}
                                meals={this.state.meals}/>
            </div>
        )
    }
}

export default Flights;
