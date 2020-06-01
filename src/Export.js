import XLSX from 'xlsx';
import firebase from "./Firebase.js";

const sheetHeader =["DAILY FLYING ORDER", "","","","","","","","","","","","","","","",""];
const emptyCells = ["","","","","","",""];
const emptyRow = ["","","","","","","","","","","","","","","","",""];
const configCodesHeader = ["CONFIG CODES"].concat(emptyRow.slice(1));
const flightHeaders = ["startTime","endTime","A/C","BACKUP","captain","fo","fe","crew","config","details","mission","details","config","remarks","pri","meal","DCO"];
const configCodes=[["STANDARD CONFIG","","S","DEP ADAM","","DA","VIP","","V","DUAL C6 SIDE FIRE","","DC6S","INGRESS CONSOLE","","I","",,"",],
["FRIES KIT","","FR","FULL FUEL","","FF","SDS","","SD","DUAL C6 FRONT FIRE","","DC6F","BARRIER NET","","BN","",,"",],
["HOOK","","H","NO CONFIG REQUEST","","NR","HOIST","","HO","DUAL GAU","","DGAU","SEE COMMENT","","C","",,"",],
["AUW BALLAST KIT","","B","RAPPEL","","RP","MX-15 BALL","","MX","1 x GAU / 1 x C6","","G/C6","CABIN INVERTER","","INV","",,"",]];
const signature = ["SIGNATURE"].concat(emptyRow.slice(1));
const notes = ["NOTES"].concat(emptyRow.slice(1));
var date = [];
var numFlights = 0;

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

const download = (url, name) => {
    let a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()

    window.URL.revokeObjectURL(url)
}

function Export(ids, d) {
    var day = [];
    numFlights = ids.length;
    day.push(["DATE: " + d.date].concat(emptyCells).concat(["SDO: "+d.sdo]).concat(emptyCells).concat([""]));
    day.push(["TWILIGHT CIV: " + d.twilightciv].concat(emptyCells).concat(["TWILIGHT NAUT: "+d.twilightnaut]).concat(emptyCells).concat([""]));
    day.push(["DAY FDO: " + d.fdoday].concat(emptyCells).concat(["NIGHT FDO: "+d.fdonight]).concat(emptyCells).concat([""]));
    day.push(["DESK SGT DAY: " + d.desksgtday].concat(emptyCells).concat(["DESK SGT NIGHT: "+d.desksgtnight]).concat(emptyCells).concat([""]));
    day.push(["MTP: " + d.mtp].concat(emptyCells).concat(["GROUND RUN: "+d.groundrun]).concat(emptyCells).concat([""]));
                        
    //Gathering all data: 
    //Flights declared as dict to maintain order in array using keys. We then retrieve only the values

    if (ids.length > 0) {
        var flights = {};
        ids.forEach((id) => {
            flights[id] = '';
        })
        firebase.firestore().collection("events").where(firebase.firestore.FieldPath.documentId(), 'in', ids)
            .get()
            .then((querySnapshot) => {
                querySnapshot.docs.forEach((d) => {
                    var id = d.id;
                    var d = d.data();
                    date = d.date;
                    flights[id] = [
                        d.startTime,
                        d.endTime,
                        d.ac,
                        d.backup,
                        d.captain,
                        d.fo,
                        d.fe,
                        d.crew,
                        d.config,
                        d.details,
                        d.mission,
                        d.details,
                        d.config,
                        d.remarks,
                        d.pri,
                        d.meal,
                        d.dco];
                    })
                    getFile(Object.values(flights), day);
                })
            
            .catch(function(error) {
                console.log("Error getting data: ", error);
            });
    }
    else {
        //No flights to display
        getFile([], day);
    }
    
}

function getFile(flightData, dayData) {

    var exportData = [sheetHeader].concat(dayData).concat([flightHeaders])
                        .concat(flightData)
                        .concat([emptyRow])
                        .concat([configCodesHeader])
                        .concat(configCodes)
                        .concat([emptyRow])
                        .concat([notes])
                        .concat([emptyRow])
                        .concat([signature]);
    console.log(exportData);
    /* convert from array of arrays to worksheet */
    var worksheet = XLSX.utils.aoa_to_sheet(exportData);

    /* merge cells A1:B1 */
    var merges = [XLSX.utils.decode_range("A1:Q1"), XLSX.utils.decode_range("A2:H2"),XLSX.utils.decode_range("I2:Q2"), XLSX.utils.decode_range("A3:H3"),XLSX.utils.decode_range("I3:Q3"), XLSX.utils.decode_range("A4:H4"),XLSX.utils.decode_range("I4:Q4"), XLSX.utils.decode_range("A5:H5"),XLSX.utils.decode_range("I5:Q5"), XLSX.utils.decode_range("A6:H6"),XLSX.utils.decode_range("I6:Q6"), 
    XLSX.utils.decode_range("A"+(8+numFlights).toString()+":Q"+(8+numFlights).toString()),XLSX.utils.decode_range("A"+(9+numFlights).toString()+":Q"+(9+numFlights).toString()) ];

    for (var i= 0; i <4; i++) {
        merges.push(XLSX.utils.decode_range("A"+(10+i+numFlights).toString()+":B"+(10+i+numFlights).toString()));
        merges.push(XLSX.utils.decode_range("D"+(10+i+numFlights).toString()+":E"+(10+i+numFlights).toString()));
        merges.push(XLSX.utils.decode_range("G"+(10+i+numFlights).toString()+":H"+(10+i+numFlights).toString()));
        merges.push(XLSX.utils.decode_range("J"+(10+i+numFlights).toString()+":K"+(10+i+numFlights).toString()));
        merges.push(XLSX.utils.decode_range("M"+(10+i+numFlights).toString()+":N"+(10+i+numFlights).toString()));
    }

    //merges.push(XLSX.utils.decode_range(XLSX.utils.decode_range("A"+(20+numFlights).toString()+":Q"+(20+numFlights).toString())));
    //merges.push(XLSX.utils.decode_range(XLSX.utils.decode_range("A"+(21+numFlights).toString()+":Q"+(21+numFlights).toString())));

    /* add merges */
    if(!worksheet['!merges']) worksheet['!merges'] = [];
    worksheet['!merges'] = merges;

    /** formatting */
    var wsrows =  [
        {hpt: 30}, // row 1 sets to the height of 30 in pixels
      ];

    worksheet['!rows'] = wsrows; // ws - worksheet

    /** generate workbook */
    var new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, worksheet, date);

    /* write file */
    const wbout = XLSX.write(new_workbook, {type:'binary', bookType:"xlsx"});

    let url = window.URL.createObjectURL(new Blob([s2ab(wbout)], {type:'application/octet-stream'}))

    download(url, 'DailyFlyingOrder.xlsx');
}

export default Export;

