import firebase from "./Firebase.js";

let firestore = firebase.firestore();

function firebaseDeleteFlight(id, props) {
    //Delete from events 
    firestore.collection("events").doc(id)
        .delete()
        .then(
            console.log("Document successfully deleted from events"))
        .catch(function(error) {
            console.log("Error getting documents: ", error);
    });

    var pilots = [props.captain, props.fo];
    if (props.crew) {pilots.push(props.crew)};
    if (props.fe) {pilots.push(props.fe)};
    console.log(pilots);
    
    pilots.forEach(pilot => {
        var path = "events." + pilot;

        //Delete from dates
        console.log("Deleting from date: ", props.date);
        firestore.collection("dates").doc(props.date).update({
            [path]: firebase.firestore.FieldValue.arrayRemove({'type':'flight', 'startTime':props.startTime, 'endTime': props.endTime, 'id': id})
        })
            .then(
                console.log("Document successfully deleted from events"))
            .catch(function(error) {
                console.log("Error getting documents: ", error);
        });

        //Delete from pilots
        firestore.collection("pilots").doc(pilot).collection('upcoming-events').where('flightid', '==', id)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  doc.ref.delete();
                });
            });

        //Change events boolean 
        var flightDate = 'flights.' + props.date;
        firebase.firestore().collection("pilots").doc(pilot).update({[flightDate]: false})
        .then(function() {
            console.log("Boolean successfully set for "+pilot);})
        .catch(function(error) {
            console.error("Error setting flight boolean", error);
        })
    })
}

function firebaseDeleteAptMeeting(type, id, props) {
    //Delete from events 
    firestore.collection("events").doc(id)
        .delete()
        .then(
            console.log("Document successfully deleted from events"))
        .catch(function(error) {
            console.log("Error getting documents: ", error);
    });

    var path = "events." + props.userid;

    //Delete from dates
    firestore.collection("dates").doc(props.date).update({
        //[path]: [path].filter(post => post.id !== id)
        [path]: firebase.firestore.FieldValue.arrayRemove({'type':type, 'startTime':props.startTime, 'endTime': props.endTime, 'id': id})
    })
    .then(
        console.log("Document successfully deleted from events"))
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    })
}


function firebaseCreateDate(date) {
    firebase.firestore().collection("dates").doc(date).set({
        dutymtp: null,
        sdd: null,
        oic: null,
        groundrun: null,
        twilightciv: null,twilightnaut: null,
        desksgtday: null, desksgtnight: null,
        fdoday: null, fdonight: null,
        events: {},
    });
}



export {firebaseDeleteFlight, firebaseCreateDate, firebaseDeleteAptMeeting};