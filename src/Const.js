const Const = {

    //Dropdown select options for fields 
    dcolist : ["DCO", "DPCO", "DNCO"],
    aclist : ["424","427","455","460","461","462","481","483","484","485","486","487","488","490","498"],
    configlist : ["S","F","H","B","V","SD","HO","MX","I","BN","C","FF","NR","RP","DC6S","DC6F","DGAU","GC6","DA","INV",],
    prilist : ["TASK", '1', '2', '3', '4', '5', '6', 1, 2, 3, 4, 5, 6],
    rolelist: ['N/A', 'ace', 'instructor', 'staff', 'test pilot', 'admin', ],
    rolelistnoadmin: ['N/A', 'ace', 'instructor', 'staff', 'test pilot' ],

    //Form fields for Adding Flights 
    flightFormFields : [
        {date: {name: "date", custom: true, size: 'medium'}, 
        startTime: {name: "startTime", displayName: "est. departure", size: 'medium'}, 
        endTime: {name: "endTime", displayName: "est. return", size: 'medium'}, 
        flighttime: {name: "flighttime", custom: true}},

        {captain: {name: "captain", selectList: 'pilots', size: 'medium'}, 
        fo: {name: "fo", selectList: 'pilots', displayName: "first officer", size: 'medium'}, 
        fe: {name: "fe", selectList: 'pilots', displayName: "flight engineer", size: 'medium'}, 
        crew: {name: "crew", selectList: 'pilots', displayName: "other crew", size: 'medium'}}, 

        {ac: {name: "ac", size: 'small', selectList: 'aclist'}, 
        backup: {name: "backup", size: 'small', selectList: 'aclist'}, 
        mission: {name: "mission", size: 'medium'}, 
        details: {name: "details", size: 'medium'}, 
        config:{name: "config", size: 'medium', selectList: 'configlist', default: 'NR'}}, 

        {remarks: {name: "remarks", size: 'large'}}, 

        {pri: {name: "pri", displayName: 'sqn pri', size: 'medium'}, 
        dco: {name: "dco", selectList: 'dcolist', size: 'medium'}} ],
    

    meetingFormFields : [
            {title: {name: "title", size: 'large'}}, 

            {date: {name: "date", custom: true, size: 'medium'}, 
            startTime: {name: "startTime", displayName: "Start Time", size: 'medium'}, 
            endTime: {name: "endTime", displayName: "End Time", size: 'medium'}},

            {p1: {name: "p1", displayName: "Attendee 1", size: 'medium'}, 
            p2: {name: "p2", displayName: "Attendee 2", size: 'medium'}, 
            p3: {name: "p3", displayName: "Attendee 3", size: 'medium'}, 
            p4: {name: "p4", displayName: "Attendee 4", size: 'medium'}},

            {location: {name: "location", size: 'large'}, 
            confLink: {name: "confLink", displayName: "Conference Link", size: 'large'}},

            {notes: {name: "notes", size: 'large'}}, 
        ]
    
}

export default Const;