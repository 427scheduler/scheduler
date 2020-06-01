const firebase = require( "./node_modules/firebase/app");
require("./node_modules/firebase/firestore");

var firebaseConfig = {
    apiKey: "AIzaSyBUWu46P2u56hwTx4ClhB8upvQBOdE-wWA",
    authDomain: "scheduler-188df.firebaseapp.com",
    databasei: "https://scheduler-188df.firebaseio.com",
    projectId: "scheduler-188df",
    storageBucket: "scheduler-188df.appspot.com",
    messagingSenderId: "1042925041868",
    appId: "1:1042925041868:web:dc80c0076e941eeb"
};

firebase.initializeApp(firebaseConfig);


    // Add a new document in collection "dates"
    /*for (var i = 1; i <= 30; i++) {
        var a = i < 10 ? '0' : '';
        var date = '2020-04-'  + a + i ;

    const ref = firebase.firestore().collection("dates").doc(date);
    console.log(date);
    ref.get()
        .then((docSnapshot) => {if (!docSnapshot.exists)
        { ref.set({
            dutymtp: null,
            oic: null,
            groundrun: null,
            twilightciv: null,twilightnaut: null,
            desksgtday: null, desksgtnight: null,
            fdoday: null, fdonight: null
        })
        .then(()=> {
            console.log("Date successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing date: ", error);
        });
    }});
}*/




function getRandom(x, y) {
    var min = Math.ceil(x);
    var max = Math.floor(y);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function deleteAll() {
    firebase.firestore().collection("pilots").delete()
        .then(function(docRef) {
        console.log("Pilots successfully deleted!", docRef.id);
        })
        .catch(function(error) {
        console.error("Error deleting pilots: ", error);
    });
     firebase.firestore().collection("events").delete()
        .then(function(docRef) {
        console.log("Events successfully deleted!", docRef.id);
        })
        .catch(function(error) {
        console.error("Error deleting events: ", error);
    });
     firebase.firestore().collection("dates").delete()
        .then(function() {
        console.log("Dates successfully deleted!");
        })
        .catch(function(error) {
        console.error("Error deleting dates: ", error);
    });
}

function createPilots() {
    /*firebase.firestore().collection("pilots").doc('aearhart').set({
        team: 1, 
        role: 'admin',
        displayName: 'Amelia Earhart',
        firstName: 'Amelia',
        lastName: 'Earhart',
        email: 'amelia.earhart97@outlook.com',
        lastFlight: '2019-01-01',
        approved: true,
    })
        .then(function() {
        console.log("aearhart successfully written!");
        })
        .catch(function(error) {
        console.error("Error writing aearhart: ", error);
    });*/

    firebase.firestore().collection("pilots").doc('clindbergh').set({
        team: 1, 
        role: 'aviator',
        lastFlight: '2019-01-01',
        displayName: 'Charles Lindbergh',
        firstName: 'Charles',
        lastName: 'Lindbergh',
        email: 'clindbergh@forces.gc.ca',
        approved: false,
        })
        .then(function() {
        console.log("clindbergh successfully written!");
        //firebase.firestore().collection("pilots").doc('1').update({pilots: firebase.firestore.FieldValue.arrayUnion("clindbergh")});
        })
        .catch(function(error) {
        console.error("Error writing clindbergh: ", error);
    });
    
    firebase.firestore().collection("pilots").doc('pmitchell').set({
        team: 1, 
        displayName: 'Pete Mitchell',
        firstName: 'Pete',
        lastName: 'Mitchell',
        role: 'ace',
        lastFlight: '2019-01-01',
        email: 'pmitchell@forces.gc.ca',
        approved: false,
        })
        .then(function() {
        console.log("pmitchell successfully written!");
        })
        .catch(function(error) {
        console.error("Error writing pmitchell: ", error);
    });
    //firebase.firestore().collection("pilots").doc('1').update({pilots: firebase.firestore.FieldValue.arrayUnion("pmitchell")});


    firebase.firestore().collection("pilots").doc('jdoolittle').set({
        team: 1, 
        displayName: 'Jimmy Doolittle',
        firstName: 'Jimmy',
        lastName: 'Doolittle',
        role: 'aviator',
        lastFlight: '2019-01-01',
        approved: true,
        email: 'jdoolittle@forces.gc.ca',
        })
        .then(function() {
        console.log("jdoolittle successfully written!");
        })
        .catch(function(error) {
        console.error("Error writing jdoolittle: ", error);
    });
    //firebase.firestore().collection("pilots").doc('1').update({pilots: firebase.firestore.FieldValue.arrayUnion("jdoolittle")});

    firebase.firestore().collection("pilots").doc('cyeager').set({
        team: 2, 
        displayName: 'Chuck Yeager',
        firstName: 'Chuck',
        lastName: 'Yeager',
        role: 'test pilot',
        lastFlight: '2019-01-01',
        approved: true,
        email: 'cyeager@forces.gc.ca',
        })
        .then(function() {
        console.log("cyeager successfully written!");
        })
        .catch(function(error) {
        console.error("Error writing cyeager: ", error);
    });
    //firebase.firestore().collection("pilots").doc('2').update({pilots: firebase.firestore.FieldValue.arrayUnion("cyeager")});


    firebase.firestore().collection("pilots").doc('owright').set({
        team: 1, 
        displayName: 'Orvill Wright',
        firstName: 'Orvill',
        lastName: 'Wright',
        role: 'test pilot',
        lastFlight: '2019-01-01',
        approved: true,
        email: 'owright@forces.gc.ca',
        })
        .then(function() {
        console.log("owright successfully written!");
        })
        .catch(function(error) {
        console.error("Error writing owright: ", error);
    });
    //firebase.firestore().collection("pilots").doc('1').update({pilots: firebase.firestore.FieldValue.arrayUnion("owright")});

    firebase.firestore().collection("pilots").doc('ehartmann').set({
        team: 2,
        displayName: 'Erich Hartmann',
        firstName: 'Erich',
        lastName: 'Hartmann',
        role: 'ace',
        lastFlight: '2019-01-01',
        approved: false,
        email: 'ehartmann@forces.gc.ca',
        })
        .then(function() {
        console.log("ehartmann successfully written!");
        })
        .catch(function(error) {
        console.error("Error writing ehartmann: ", error);
    });
    //firebase.firestore().collection("pilots").doc('2').update({pilots: firebase.firestore.FieldValue.arrayUnion("ehartmann")});

    firebase.firestore().collection("pilots").doc('wwright').set({
        team: 2,
        displayName: 'Wilbur Wright',
        firstName: 'Wilbur',
        lastName: 'Wright',
        role: 'aviator',
        lastFlight: '2019-01-01',
        approved: false,
        email: 'wwright@forces.gc.ca',
        })
        .then(function(docRef) {
        console.log("wwright successfully written!");
        return;
        })
        .catch(function(error) {
        console.error("Error writing wwright: ", error);
    });
    //firebase.firestore().collection("pilots").doc('2').update({pilots: firebase.firestore.FieldValue.arrayUnion("wwright")});

    firebase.firestore().collection("pilots").doc('csullenberger').set({
        team: 2,
        displayName: 'Chesley Sullenberger',
        firstName: 'Chesley',
        lastName: 'Sullenberger',
        role: 'aviator',
        lastFlight: '2019-01-01',
        approved: false,
        email: 'csullenberger@forces.gc.ca',
        })
        .then(function(docRef) {
        console.log("csullenberger successfully written!");
        return;
        })
        .catch(function(error) {
        console.error("Error writing csullenberger: ", error);
    });
    //firebase.firestore().collection("pilots").doc('2').update({pilots: firebase.firestore.FieldValue.arrayUnion("csullenberger")});

    firebase.firestore().collection("pilots").doc('chadfield').set({
        team: 2,
        displayName: 'Chris Hadfield',
        firstName: 'Chris',
        lastName: 'Hadfield',
        role: 'test pilot',
        lastFlight: '2019-01-01',
        approved: false,
        email: 'chadfield@forces.gc.ca',
        })
        .then(function(docRef) {
        console.log("chadfield successfully written!");
        return;
        })
        .catch(function(error) {
        console.error("Error writing chadfield: ", error);
    });
    //firebase.firestore().collection("pilots").doc('2').update({pilots: firebase.firestore.FieldValue.arrayUnion("chadfield")});

    firebase.firestore().collection("pilots").doc('1').set({
        pilots: ['clindbergh', 'pmitchell', 'jdoolittle', 'owright']
    })
        .then(function() {
        console.log("Team 1 successfully written!");
        })
        .catch(function(error) {
        console.error("Error writing team: ", error);
    });
    firebase.firestore().collection("pilots").doc('2').set({
        pilots: ['chadfield', 'csullenberger', 'cyeager', 'ehartmann', 'wwright']
    })
        .then(function() {
        console.log("Team 2 successfully written!");
        })
        .catch(function(error) {
        console.error("Error writing team: ", error);
    });
    return;
}


/** 

var ac = [472, 582, 479, 496, 428, 409]
var pilots = ['wwright', 'clindbergh', 'cyeager', 'aearhart', 'pmitchell', 'jdoolittle', 'ehartmann', 'owright'];
var config = ['NR FF', "V FF", "DC6S", "DC0S"];
var dco = ['ok','ok','ok','ok','ok','ok','warn', 'warn', 'bad'];
var details = ['SME', "ALP2"];

for (var i  = 0; i < 10 ; i ++) {
    var pilot = pilots[getRandom(0, 7)];
    var fo = pilots[getRandom(0, 7)];
    var date = "2019-07-" + getRandom(18, 30);
    var acval = ac[getRandom(0, 5)];
    var configval = config[getRandom(0, 3)];
    var detail = details[getRandom(0, 1)];
    var end=  parseInt(getRandom(0, 23) + getRandom(0, 5) +'0');
    var start = parseInt(getRandom(Math.floor(end/100), 23) + getRandom(0, 5) +'0');
var newEvent = firebase.firestore().collection("events").doc();
var newUpcomingEvent = firebase.firestore().collection('pilots').doc(pilot).collection('upcoming-events').doc();



newUpcomingEvent.set({
    ac: acval,
    captain: pilot,
    flightid: newEvent.id,
    config: configval,
    date: date,
    fo: fo,
    details: detail,
    endTime: end,
    startTime: start,
    })
.then(function(docRef) {
    console.log("Document successfully written!");})
.catch(function(error) {
    console.error("Error writing document: ", error);
})

newEvent.set({
    ac: acval,
    captain: pilot,
    config: configval,
    date: date,
    dco: dco[getRandom(0, 8)],
    details: detail,
    fo: fo,
    mission: "427 AU H"+ getRandom(1, 8) + getRandom(0,6) + "3 G0" + getRandom(0, 9),
    pri: getRandom(1, 6),
    remarks: getRandom(1,6) == 4 ? 'Academic Shoot' : '',
    meal: getRandom(1,15) == 6 ? true : false,
    endTime: end,
    startTime: start,
    type: "flight",
    })
.then(function(docRef) {
    console.log("Document successfully written!");})
.catch(function(error) {
    console.error("Error writing document: ", error);
})



}
*/


/*
firebase.firestore().collection("pilots").doc('aearhart').set({
    ac: ac[getRandom(0, 5)],
    captain: pilots[getRandom(0, 7)],
    config: config[getRandom(0, 3)],
    date: "2019-07-" + getRandom(18, 30),
    dco: dco[getRandom(0, 8)],
    details: details[getRandom(0, 1)],
    fo: pilots[getRandom(0,7)],
    mission: "427 AU H"+ getRandom(1, 8) + getRandom(0,6) + "3 G0" + getRandom(0, 9),
    pri: getRandom(1, 6),
    remarks: getRandom(1,6) == 4 ? 'Academic Shoot' : '',
    meal: getRandom(1,15) == 6 ? true : false,
    endTime: parseInt(getRandom(0, 23) + getRandom(0, 5) +'0'),
    startTime: parseInt(getRandom(0, 23) + getRandom(0, 5) +'0'),
    type: "flight",
    })
.then(function(docRef) {
    console.log("Document successfully written!");})
.catch(function(error) {
    console.error("Error writing document: ", error);
})*/




/**************************** MASS FLIGHT CREEATION  ****************************/

function createFlights(num, month, begin, end) {
    var ac = [472, 582, 479, 496, 428, 409]
    var pilots = ['wwright', 'clindbergh', 'cyeager', 'aearhart', 'pmitchell', 'jdoolittle', 'ehartmann', 'owright', 'csullenberger', 'chadfield', '', '', '', '', '', '', ''];
    var config = ['NR FF', "V FF", "DC6S", "DC0S"];
    var dco = ['dco','dco','dco','dco','dpco', 'dpco', 'dnco', 'dco','dco'];
    var details = ['SME', "ALP2"];
    var start = [130, 250, 320, 430, 520, 510, 720, 800, 930, 1020, 1110, 1130, 1230, 1310, 1350, 1420, 1530, 1720, 1820, 1920, 2040];
    var l = [60,90, 120, 120, 120, 150, 180, 210, 60,  90, 90, 90, 90, 90, 120, 120, 120, 150, 180]
    var state = {};

    function firebaseSetBool(pilot, date) {
        var flightDate = 'flights.' + date;
        firebase.firestore().collection("pilots").doc(pilot).update({[flightDate]: true})
        .then(function() {
            console.log("Boolean successfully set for pilot");})
        .catch(function(error) {
            console.error("Error setting flight boolean", error);
        })
    }

    for (var i  = 0; i < num ; i ++) {
        var s = start[getRandom(0,20)];
        var e = s + l[getRandom(0,18)];
        if (parseInt(e.toString().split('').slice(0, -2)) > 60) {
            e -= 40
        };
        state.captain = pilots[getRandom(0, 9)];
        state.fo = pilots[getRandom(0, 9)];
        var d = getRandom(begin,end);
        state.date= "2020-" + month + '-' + (d < 10 ? '0' : '') + d;
        state.ac = ac[getRandom(0, 5)];
        state.mission= "427 AU H"+ getRandom(1, 8) + getRandom(0,6) + "3 G0" + getRandom(0, 9);
        state.fe = pilots[getRandom(0, 15)];
        state.remarks= getRandom(1,6) == 4 ? 'Academic Shoot' : '';
        state.crew = pilots[getRandom(0, 15)];
        state.dco = dco[getRandom(0,8)];
        state.pri = getRandom(1, 6);
        state.config = config[getRandom(0, 3)];
        state.details = details[getRandom(0, 1)];
        state.startTime= (s < 1000 ? '0': '') + s.toString();
        state.type="flight";
        state.endTime= (e < 1000 ? '0': '') + e.toString();

        var newEvent = firebase.firestore().collection("events").doc();
        newEvent.set(state)
        .then(function() {
            console.log("Event successfully added to events!");})
        .catch(function(error) {
            console.error("Error adding event: ", error.substring(0, 100));
        });

        var updates = {};
        updates['events.'+state.captain] = firebase.firestore.FieldValue.arrayUnion({'type':'flight', 'startTime': state.startTime, 'endTime': state.endTime, 'id':newEvent.id});
        updates['events.'+state.fo] = firebase.firestore.FieldValue.arrayUnion({'type':'flight', 'startTime': state.startTime, 'endTime': state.endTime, 'id':newEvent.id});
        firebaseSetBool(state.captain, state.date);
        firebaseSetBool(state.fo, state.date);
        var newUpcomingEvents = [firebase.firestore().collection('pilots').doc(state.captain).collection('upcoming-events').doc(),
        firebase.firestore().collection('pilots').doc(state.fo).collection('upcoming-events').doc()];

        if (state.fe) {
            updates['events.'+state.fe] = firebase.firestore.FieldValue.arrayUnion({'type':'flight', 'startTime': state.startTime, 'endTime': state.endTime, 'id':newEvent.id});
            newUpcomingEvents.push(firebase.firestore().collection('pilots').doc(state.fe).collection('upcoming-events').doc());
            firebaseSetBool(state.fe, state.date);
        }
        if (state.crew) {
            updates['events.'+state.crew] = firebase.firestore.FieldValue.arrayUnion({'type':'flight', 'startTime': state.startTime, 'endTime': state.endTime, 'id':newEvent.id});
            newUpcomingEvents.push(firebase.firestore().collection('pilots').doc(state.crew).collection('upcoming-events').doc());
            firebaseSetBool(state.crew, state.date);
        }

        firebase.firestore().collection("dates").doc(state.date).update(updates)
        .then(function() {
            console.log("Event successfully added to dates!");})
        .catch(function(error) {
            console.error("Error writing document: ", error.substring(0, 100));
        })

        console.log(newUpcomingEvents)
        newUpcomingEvents.forEach((x)=>{x.set({
            ac: state.ac,
            captain: state.captain,
            flightid: newEvent.id,
            config: state.config,
            date: state.date,
            fo: state.fo,
            fe: state.fe,
            crew: state.crew,
            details: state.details,
            endTime: state.endTime,
            startTime: state.startTime,})
        .then(function() {
            console.log("Event successfully added to pilots!");})
        .catch(function(error) {
            console.error("Error writing document: ", error.substring(0, 100));
        })})

        firebase.firestore().collection("dates").doc(state.date).update(updates)
        .then(function() {
            console.log("Event successfully added to dates!");})
        .catch(function(error) {
            console.error("Error writing document: ", error.substring(0, 100));
        })
    }
    return;
}

/*************************************************     MASS MEETING UPDATES **************************************************/
 function createMeetings(num, month, begin, end) {
    var l = [30, 60, 60, 60, 90, 90, 90, 90, 90, 90, 120, 120, 120, 150, 180]
    var pilots = ['aearhart', 'wwright', 'clindbergh', 'cyeager', 'aearhart', 'pmitchell', 'jdoolittle', 'ehartmann', 'owright','csullenberger', 'chadfield'];
    var start = [800, 900, 1020, 1150, 1130, 1240, 1320, 1340, 1420, 1530];
    var location = ['', "", '', 'Classroom A', 'Room 201', "Courtyard", '', '', ''];
    var details = ['Strategy Discussion', "Sync with CO", "Lunch Discussion", "Review Scheduler"];
    var state = {};

    for (var i  = 0; i < num ; i ++) {

        var s = start[getRandom(0,9)];
        var e = s + l[getRandom(0,14)];
        if (parseInt(e.toString().split('').slice(0, -2)) > 60) {
            e -= 40
        };

        state.title =  details[getRandom(0, 3)];
        state.type= "meeting";
        var d = getRandom(begin,end);
        console.log(end, parseInt(end))
        state.date= "2020-" + month + '-' + (d < 10 ? '0' : '') + d;
        state.startTime= (s < 1000 ? '0': '') + s.toString();
        state.endTime= (e < 1000 ? '0': '') + e.toString();
        state.location= location[getRandom(0, 8)]; 
        state.confLink= "";
        state.notes= "";
        state.userid=pilots[getRandom(0, 10)];
        console.log(state);



    console.log(state);
    var newEvent = firebase.firestore().collection("events").doc()
    newEvent.set(state)
    .then(function() {
        console.log("Event successfully added to events!");})
    .catch(function(error) {
        console.error("Error adding event: ", error.substring(0, 100));
    });

    var field = 'events.'+state.userid;
    firebase.firestore().collection("dates").doc(state.date).update({
        [field]: firebase.firestore.FieldValue.arrayUnion({'type':'meeting', 'startTime': state.startTime, 'endTime': state.endTime, 'id':newEvent.id})
        })
    .then(function() {
        console.log("Event successfully added to dates!"); return;})
    .catch(function(error) {
        console.log({'type':'meeting', 'startTime': state.startTime, 'endTime': state.endTime, 'id':newEvent.id});
        console.error("Error writing document: ", error.substring(0, 100));
    })}
    return;

}

/*************************************************     MASS APT UPDATES **************************************************/
function createApts(num, month, begin, end)

{
    var l = [30,30, 60, 60, 60, 90, 90, 90, 90, 90, 120, 120, 120, 150, 180]
    var pilots = ['csullenberger', 'chadfield','wwright', 'clindbergh', 'cyeager', 'aearhart', 'pmitchell', 'jdoolittle', 'ehartmann', 'owright'];
    var start = [800, 900, 1020, 1150, 1130, 1240, 1320, 1340, 1420, 1530];
    var location = ['', "", '', 'Classroom A', 'Room 201', "Courtyard", '', '', ''];
    var details = ['Medical', "Dentist", "Course", "Temp Leave"];
    var event = ['apt', 'leave', 'pers', 'yl'];
    var state = {};

    for (var i  = 0; i < num ; i ++) {

        state.title =  details[getRandom(0, 3)];
        state.type=  "apt";
        var s = start[getRandom(0,9)];
        var e = s + l[getRandom(0,14)];
        if (parseInt(e.toString().split('').slice(0, -2)) > 60) {
            e -= 40
        };
        var d = getRandom(begin,end);
        
        state.date= "2020-" + month + '-' + (d < 10 ? '0' : '') + d;
        
        state.startTime= (s < 1000 ? '0': '') + s.toString();
        state.endTime= (e < 1000 ? '0': '') + e.toString();
        state.event = event[getRandom(0, 3)];
        state.notes= "";
        state.location=location[getRandom(0, 8)];
        state.userid=pilots[getRandom(0, 9)];

    var newEvent = firebase.firestore().collection("events").doc()
    newEvent.set(state)
    .then(function() {
        console.log("Event successfully added to events!");})
    .catch(function(error) {
        console.error("Error adding event: ", error.substring(0, 100));
    });

    var field = 'events.'+state.userid;
    firebase.firestore().collection("dates").doc(state.date).update({
        [field]: firebase.firestore.FieldValue.arrayUnion({'type':'apt', 'startTime': state.startTime, 'endTime': state.endTime, 'id':newEvent.id})
        })
    .then(function() {
        console.log("Event successfully added to dates!"); return;})
    .catch(function(error) {
        console.error("Error writing document: ", error.substring(0, 100));
    })}
    return;
}


/*********************************** HELPER FUNCTIONS  *******************************/
function error() {
    console.log("Please input [action] [count] [month] [startDay] [endDay]");
}

function createDates(month, start, end) {
    var twilights = ['1720', '1800', '1820', '1830', '1840', '1850', '1900', '1920', ""];
    var pilots = ['csullenberger', 'chadfield','wwright', 'clindbergh', 'cyeager', 'aearhart', 'pmitchell', 'jdoolittle', 'ehartmann', 'owright', ''];
    
    for (var i = start ; i <= end ; i++) {
        date = '2020-' + month + '-' + (i < 10 ? '0' : '') + i
        const ref = firebase.firestore().collection("dates").doc(date);
        ref.get()
            .then((docSnapshot) => {if (!docSnapshot.exists)
            { ref.set({
                dutymtp: pilots[getRandom(0,9)],
                oic: pilots[getRandom(0,9)],
                groundrun: pilots[getRandom(0,9)],
                twilightciv: twilights[getRandom(0, 8)],twilightnaut: twilights[getRandom(0, 7)],
                desksgtday: pilots[getRandom(0,9)], desksgtnight: pilots[getRandom(0,9)],
                fdoday: pilots[getRandom(0,9)], fdonight: pilots[getRandom(0,9)],
                sdo: pilots[getRandom(0,9)],
            })
            .then(()=> {
                console.log(date + " successfully written!"); return;
            })
            .catch(function(error) {
                console.error("Error writing date: ", error);
            });
        }});
    }
}

var args = process.argv.slice(2);
var action = args[0];

switch(action) {
    case "apts":
        if (args.length < 5) {error(); return;}
        createApts(args[1], args[2], args[3], args[4]);
        break;
    case "meetings":
        if (args.length < 5) {error(); return;}
        createMeetings(args[1], args[2], parseInt(args[3]), parseInt(args[4]));
        
        break;
    case "flights":
        if (args.length < 5) {error(); return;}
        createFlights(args[1], args[2], args[3], args[4]);
        break;
    case "pilots": 
        createPilots();
        break;
    case 'dates': 
        createDates(args[1], args[2], args[3]);
        break;

    default:
        console.log("Please input [apt | meeting | flights | pilots | dates] followed by parameters")
      return;
}

