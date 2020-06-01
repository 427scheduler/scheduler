import firebase from "./src/Firebase.js";

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


function createPilots() {
    /*firebase.firestore().collection("pilots").doc('aearhart').set({
        team: 1, 
        role: 'aviator',
        lastFlight: '01-01-2019',
    })
        .then(function(docRef) {
        console.log("Document successfully written!", docRef.id);
        })
        .catch(function(error) {
        console.error("Error writing document: ", error);
    });*/
    firebase.firestore().collection("pilots").doc('clindbergh').set({
        team: 1, 
        role: 'aviator',
        lastFlight: '01-01-2019',
        })
        .then(function(docRef) {
        console.log("Document successfully written!", docRef.id);
        })
        .catch(function(error) {
        console.error("Error writing document: ", error);
    });
    firebase.firestore().collection("pilots").doc(1).update({pilots: firebase.firestore.FieldValue.arrayUnion("clindbergh")});
    firebase.firestore().collection("pilots").doc('pmitchell').set({
        team: 1, 
        displayName: 'Pete Mitchell',
        role: 'ace',
        lastFlight: '01-01-2019',
        })
        .then(function(docRef) {
        console.log("Document successfully written!", docRef.id);
        })
        .catch(function(error) {
        console.error("Error writing document: ", error);
    });
    firebase.firestore().collection("pilots").doc(1).update({pilots: firebase.firestore.FieldValue.arrayUnion("pmitchell")});

    firebase.firestore().collection("pilots").doc('jdoolittle').set({
        team: 1, 
        displayName: 'Jimmy Doolittle',
        role: 'aviator',
        lastFlight: '01-01-2019',
        })
        .then(function(docRef) {
        console.log("Document successfully written!", docRef.id);
        })
        .catch(function(error) {
        console.error("Error writing document: ", error);
    });
    firebase.firestore().collection("pilots").doc(1).update({pilots: firebase.firestore.FieldValue.arrayUnion("jdoolittle")});
    firebase.firestore().collection("pilots").doc('cyeager').set({
        team: 2, 
        displayName: 'Chuck Yeager',
        role: 'test pilot',
        lastFlight: '01-01-2019',
        })
        .then(function(docRef) {
        console.log("Document successfully written!", docRef.id);
        })
        .catch(function(error) {
        console.error("Error writing document: ", error);
    });
    firebase.firestore().collection("pilots").doc(2).update({pilots: firebase.firestore.FieldValue.arrayUnion("cyeager")});
    firebase.firestore().collection("pilots").doc('owright').set({
        team: 1, 
        displayName: 'Orvill Wright',
        role: 'test pilot',
        lastFlight: '01-01-2019',
        })
        .then(function(docRef) {
        console.log("Document successfully written!", docRef.id);
        })
        .catch(function(error) {
        console.error("Error writing document: ", error);
    });
    firebase.firestore().collection("pilots").doc(1).update({pilots: firebase.firestore.FieldValue.arrayUnion("owright")});
    firebase.firestore().collection("pilots").doc('ehartmann').set({
        team: 2,
        displayName: 'Erich Hartmann',
        role: 'ace',
        lastFlight: '01-01-2019',
        })
        .then(function(docRef) {
        console.log("Document successfully written!", docRef.id);
        })
        .catch(function(error) {
        console.error("Error writing document: ", error);
    });
    firebase.firestore().collection("pilots").doc(2).update({pilots: firebase.firestore.FieldValue.arrayUnion("ehartmann")});
    firebase.firestore().collection("pilots").doc('wwright').set({
        team: 2,
        displayName: 'Wilbur Wright',
        role: 'aviator',
        lastFlight: '01-01-2019',
        })
        .then(function(docRef) {
        console.log("Document successfully written!", docRef.id);
        })
        .catch(function(error) {
        console.error("Error writing document: ", error);
    });
    firebase.firestore().collection("pilots").doc(2).update({pilots: firebase.firestore.FieldValue.arrayUnion("wwright")});

    

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

function createFlights(num, month, start, end) {
    var ac = [472, 582, 479, 496, 428, 409]
    var pilots = ['wwright', 'clindbergh', 'cyeager', 'aearhart', 'pmitchell', 'jdoolittle', 'ehartmann', 'owright', '', '', '', '', '', '', ''];
    var config = ['NR FF', "V FF", "DC6S", "DC0S"];
    var dco = ['ok','ok','ok','ok','warn', 'warn', 'bad', 'ok','ok'];
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

    for (var i  = 0; i < 10 ; i ++) {
        var s = start[getRandom(0,20)];
        var e = s + l[getRandom(0,18)];
        state.captain = pilots[getRandom(0, 7)];
        state.fo = pilots[getRandom(0, 7)];
        var d = getRandom(start,end);
        state.date= "2020-" + month + '-' + (d < 10 ? '0' : '') + d;
        state.ac = ac[getRandom(0, 5)];
        state.mission= "427 AU H"+ getRandom(1, 8) + getRandom(0,6) + "3 G0" + getRandom(0, 9);
        state.fe = pilots[getRandom(0, 13)];
        state.remarks= getRandom(1,6) == 4 ? 'Academic Shoot' : '';
        state.crew = pilots[getRandom(0, 13)];
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
            console.error("Error adding event: ", error);
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

        const ref = firebase.firestore().collection("dates").doc(state.date);
        ref.get()
            .then((docSnapshot) => {if (!docSnapshot.exists)
            { ref.set({
                dutymtp: null,
                sdo: null,
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
        firebase.firestore().collection("dates").doc(state.date).update(updates)
        .then(function() {
            console.log("Event successfully added to dates!");})
        .catch(function(error) {
            console.error("Error writing document: ", error);
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
            console.error("Error writing document: ", error);
        })})

        firebase.firestore().collection("dates").doc(state.date).update(updates)
        .then(function() {
            console.log("Event successfully added to dates!");})
        .catch(function(error) {
            console.error("Error writing document: ", error);
        })
    }
}
/*************************************************     MASS MEETING UPDATES **************************************************/
 function createMeetings(num, month, start, end) {
    var l = [30, 60, 60, 60, 90, 90, 90, 90, 90, 90, 120, 120, 120, 150, 180]
    var pilots = ['aearhart', 'wwright', 'clindbergh', 'cyeager', 'aearhart', 'pmitchell', 'jdoolittle', 'ehartmann', 'owright'];
    var start = [800, 900, 1020, 1150, 1130, 1240, 1320, 1340, 1420, 1530];
    var location = ['', "", '', 'Classroom A', 'Room 201', "Courtyard", '', '', ''];
    var details = ['Strategy Discussion', "Sync with CO", "Lunch Discussion", "Review Scheduler"];
    var state = {};

    for (var i  = 0; i < num ; i ++) {

        var s = start[getRandom(0,9)];
        var e = s + l[getRandom(0,14)];

        state.title =  details[getRandom(0, 3)];
        state.type= "meeting";
        var d = getRandom(start,end);
        state.date= "2020-" + month + '-' + (d < 10 ? '0' : '') + d;
        state.startTime= (s < 1000 ? '0': '') + s.toString();
        state.endTime= (e < 1000 ? '0': '') + e.toString();
        state.location= location[getRandom(0, 8)]; 
        state.confLink= "";
        state.notes= "";
        state.userid=pilots[getRandom(0, 8)];
        console.log(state);



    console.log(state);
    var newEvent = firebase.firestore().collection("events").doc()
    newEvent.set(state)
    .then(function() {
        console.log("Event successfully added to events!");})
    .catch(function(error) {
        console.error("Error adding event: ", error);
    });

    var field = 'events.'+state.userid;
    firebase.firestore().collection("dates").doc(state.date).update({
        [field]: firebase.firestore.FieldValue.arrayUnion({'type':'meeting', 'startTime': state.startTime, 'endTime': state.endTime, 'id':newEvent.id})
        })
    .then(function() {
        console.log("Event successfully added to dates!");})
    .catch(function(error) {
        console.log({'type':'meeting', 'startTime': state.startTime, 'endTime': state.endTime, 'id':newEvent.id});
        console.error("Error writing document: ", error);
    })}

}

/*************************************************     MASS APT UPDATES **************************************************/
function createApts(num, month, start, end)

{
    var l = [30,30, 60, 60, 60, 90, 90, 90, 90, 90, 120, 120, 120, 150, 180]
    var pilots = ['wwright', 'clindbergh', 'cyeager', 'aearhart', 'pmitchell', 'jdoolittle', 'ehartmann', 'owright'];
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
        var d = getRandom(start,end);
        state.date= "2020-" + month + '-' + (d < 10 ? '0' : '') + d;
        
        state.startTime= (s < 1000 ? '0': '') + s.toString();
        state.endTime= (e < 1000 ? '0': '') + e.toString();
        state.event = event[getRandom(0, 3)];
        state.notes= "";
        state.location=location[getRandom(0, 8)];
        state.userid=pilots[getRandom(0, 7)];
        console.log(state);



    console.log(state);
    var newEvent = firebase.firestore().collection("events").doc()
    newEvent.set(state)
    .then(function() {
        console.log("Event successfully added to events!");})
    .catch(function(error) {
        console.error("Error adding event: ", error);
    });

    var field = 'events.'+state.userid;
    firebase.firestore().collection("dates").doc(state.date).update({
        [field]: firebase.firestore.FieldValue.arrayUnion({'type':'apt', 'startTime': state.startTime, 'endTime': state.endTime, 'id':newEvent.id})
        })
    .then(function() {
        console.log("Event successfully added to dates!");})
    .catch(function(error) {
        console.error("Error writing document: ", error);
    })}
}

function error() {
    console.log("Please input [action] [count] [month] [startDay] [endDay]");
}


var args = process.argv.slice(2);
var action = args[0];

switch(action) {
    case apt:
        if (args.length < 5) {error(); return;}
        createApts(args[1], args[2], args[3]);
        break;
    case meeting:
        if (args.length < 5) {error(); return;}
        createMeetings(args[1], args[2], args[3]);
        break;
    case flight:
        if (args.length < 5) {error(); return;}
        createFlights(args[1], args[2], args[3]);
        break;
    case pilots: 
        createPilots();
    default:
      return;
}
