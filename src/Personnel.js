import Login from "./Login";
import React from 'react';
import ReactGA from 'react-ga';
import firebase from "./Firebase.js";
import ErrorPage from './ErrorPage.js';
import './Personnel.css';
import Helper from './Helper.js';
import Const from './Const.js';
import DELETE from './img/delete.png';
import DELETE_HOVER from './img/delete-hover.png';


function initializeReactGA() {
    ReactGA.initialize('UA-168152066-1');
    ReactGA.pageview('/Personnel');
}

function PersonnelInfo(props) {
    return (
        <div>
            <div className="personnelInfo">
                <RenderInfo user={props.user} team={props.team} name={props.name} teamNum={props.teamNum} lastFlight={props.lastFlight} role={props.role} email={props.email}/>
            </div>
            <RenderLogoutBtn/>
            <Approvals role={props.role} approvals={props.approvals}/>
        </div>
    )
}

function RenderInfo(props) {
    return (
        <div>
            <div className="myInfo">
                <div className="infoField">
                    <h5>UserID</h5>
                    <input className='pinput' id="userid" defaultValue={props.user} type="text" readOnly/>
                </div>
                <div className="infoField">
                    <h5>Name</h5>
                    <input className='pinput' id="name" defaultValue={props.name} type="text"readOnly/>
                </div>
                <div className="infoField">
                    <h5>Last Flight</h5>
                    <input className='pinput' id="lastFlight" defaultValue={props.lastFlight} type="date" readOnly/>
                </div>
                <div className="infoField">
                    <h5>Role</h5>
                    <input className='pinput' id="role" list='rolelist' defaultValue={props.role} type="text" readOnly/>
                </div>
                <div className="infoField">
                    <h5>Email</h5>
                    <input className='pinput' id="useremail" defaultValue={props.email} type="text" readOnly/>
                </div>
                <div className="infoField">
                    <h5>Team Number</h5>
                    <input className='pinput' id="teamNum" defaultValue={props.teamNum} type="text" onBlur={(e)=>{changeTeam(e,props.user, props.teamNum)}}/>
                </div>
            </div>
            <div className="teamInfo">
                <TeamInfo team={props.team}/>
            </div>
        </div>
    )
}

function TeamInfo(props) {
    var team = [];

    if (props.team) {
        props.team.forEach((member) => {
            team.push(<tr>{Helper.parseID(member)}</tr>)
        }) 
    }

    return (
        <table className="teamTable">
            <tr><th>Team Members</th></tr>
            {team}
        </table>
    )
}

function setRole(e, pilot, oldrole) {
    if (e.target.value == '') {
        e.target.value = oldrole
    }
    else {
        firebase.firestore().collection("pilots").doc(pilot).update({role: e.target.value});
    }
}

function Approvals(props) {
    var approvedtable = [];
    var notapprovedtable = [];

    console.log(props);
    if (props.role.toLowerCase() == 'admin' || props.role.toLowerCase() == '427 admin') {

        props.approvals.forEach((pilot)=> {
            var name = pilot.firstName + ' ' + pilot.lastName;
            var email = pilot.email != null ? pilot.email : '';
            var nameField = ['admin', '427 admin'].includes(pilot.role.toLowerCase()) ? (<td><RenderAdminTag/>{name}</td>) : <td>{name}</td>;

            if (pilot.role.toLowerCase() == '427 admin') {
                approvedtable.push(<tr id={pilot.id}>
                    {nameField} 
                    <td>{email}</td>
                    <td id='team'>{pilot.team}</td>
                    <td id='role'>{pilot.role}</td>
                    <td></td>
                    <td></td></tr>)
            }
            else {
                if (pilot.approved) {
                approvedtable.push(<tr id={pilot.id}>
                    {nameField} 
                    <td>{email}</td>
                    <td id='team'>{pilot.team}</td>
                    <td id='approvalsrole'><input id='approvalsrole' list='rolelist' defaultValue={pilot.role} type="text"
                    onBlur={(e)=>{setRole(e, pilot.id, pilot.role)}}/></td>
                    <td><RenderApprovedBtn/></td>
                    <td><RenderDeleteBtn/></td></tr>)
                }
                else {
                    notapprovedtable.push(<tr id={pilot.id}>
                        <td>{name}</td>
                        <td>{email}</td>
                        <td id='team'>{pilot.team}</td>
                        <td id='approvalsrole'><input id='approvalsrole' list='rolelistnoadmin' defaultValue={pilot.role} type="text" 
                        onBlur={(e)=>{setRole(e, pilot.id, pilot.role)}}/></td>
                        <td><RenderApproveBtn/></td>
                        <td><RenderDeleteBtn/></td></tr>)
                }
            }
        })
        
            return (
                <div>
                <div id='approval-header'>
                    <h2>Approvals</h2>
                    <p>This is only visible to admins</p>
                </div>
                <table className="approvalsTable">
                {Helper.getOptionsList('rolelist', Const.rolelist)}
                {Helper.getOptionsList('rolelistnoadmin', Const.rolelistnoadmin)}
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Team</th>
                    <th>Role</th>
                    <th>Approve</th>
                    <th> </th>
                </tr>
                {notapprovedtable}
                {approvedtable}
                </table>
                </div>
            )
    }

    return <div></div>;
}

function changeTeam(e, pilot, oldVal) {
    if (isNaN(e.target.value)) {
        e.target.value = oldVal;
    }
    else {
        firebase.firestore().collection("pilots").doc(pilot).update({team: e.target.value});
        firebase.firestore().collection("pilots").doc(oldVal).update({pilots: firebase.firestore.FieldValue.arrayRemove(pilot)});
        firebase.firestore().collection("pilots").doc(e.target.value).update({pilots: firebase.firestore.FieldValue.arrayUnion(pilot)});
    }
}

function RenderApproveBtn() {
    return (
        <div className='approve-btn-div '>
                <button className="approve-btn" type="button" onClick={((e) => {
                    e.target.className += ' approved';
                    e.target.innerHTML = 'Approved';
                    var pilot = e.target.parentElement.parentElement.parentElement.id;

                    firebase.firestore().collection("pilots").doc(pilot).update({
                        approved: true,
                    })
                        .then(function(docRef) {
                        console.log("Successfully Approved!");
                        })
                        .catch(function(error) {
                        console.error("Error making approval: ", error);
                    });
                    })}>
                    Approve
                </button>
        </div>
    );
}
function RenderApprovedBtn() {
    return (
        <div className='approved-btn-div '>
                <button className="approved" type="button">
                    Approved
                </button>
        </div>
    );
}

function RenderAdminTag() {
    return (
                <button className="admin-tag" type="button" disabled='true'>
                    ADMIN
                </button>
    );
}

function RenderLogoutBtn() {
    return (
        <div className='logout-btn-div '>
                <button className="logout-btn" type="button" onClick={logOut}>
                    Log Out
                </button>
        </div>
    );
}

function RenderDeleteBtn() {
    return (
        <img alt="delete" className="delete" src={DELETE} title='Delete' onClick={(e)=>{
            var row = e.target.parentElement.parentElement
            var pilot = row.id;
            var team = row.cells['team'].innerHTML.toString();
            var role = row.cells['role'].innerHTML;
            if (role == 'admin') {
                window.confirm("You cannot delete an admin");
                return;
            }

            if (window.confirm("Are you sure you want to delete this user?")) {
                //DELETING FROM TEAM 
                firebase.firestore().collection("pilots").doc(team).update({
                    "pilots":firebase.firestore.FieldValue.arrayRemove(pilot)
                })
                    .then(function() {
                    console.log("Successfully deleted!");
                    })
                    .catch(function(error) {
                    console.error("Error deleting pilot: ", error);
                });
                
                //DELETING THE USER 
                firebase.firestore().collection("pilots").doc(pilot).delete()
                    .then(function() {
                    console.log("Successfully deleted!");
                    window.location.reload();
                    })
                    .catch(function(error) {
                    console.error("Error deleting pilot: ", error);
                });
            } 
        }} />
    );
}

function logOut() {
    if (!window.confirm("Are you sure you want to log out?")) {
        return;
      } 
    return <Login/>
}


class Personnel extends React.Component{
    constructor(props) {
        super(props)
        /* name */
        this.state={
            userID: '',
            team: [],
            teamNum: null,
            lastFlight: null,
            email: '',
            hasError: false,
            approvals: [],
            role: '',
        };
    }
    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        console.log(error, info);
    }

    componentDidMount() {
        initializeReactGA();
        this.getTeamMembers();
        var id = Helper.parseName(this.props.name);
        this.setState({userID: id});
        this.getApprovals();
    }

    getApprovals() {
        firebase.firestore().collection("pilots")
        .get()
        .then((querySnapshot) => {
            var approvals = []
            querySnapshot.forEach((pilot)=> {
                if (pilot.data() && pilot.data().firstName) {
                    approvals.push({
                        id: pilot.id,
                        firstName: pilot.data().firstName, 
                                lastName: pilot.data().lastName, 
                                email: pilot.data().email, 
                                role: pilot.data().role, 
                                team: pilot.data().team,
                                approved: pilot.data().approved})
                }
            })
            this.setState({approvals: approvals});
            console.log(approvals);
        })
        .catch(function(error) {
            console.log("This user doesn't exist: ", error);
        });
    }

    getTeamMembers() {
        var user = Helper.parseName(this.props.name);
        firebase.firestore().collection("pilots").doc(user)
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                var lastFlight = querySnapshot.data().lastFlight;
                var email = querySnapshot.data().email;
                var num = querySnapshot.data().team;
                var role = querySnapshot.data().role;
                this.setState({teamNum: num, lastFlight: lastFlight, email: email, role: role});
                firebase.firestore().collection("pilots").doc(num.toString())
                .get()
                .then((querySnapshot) => {
                    if (!querySnapshot.empty && querySnapshot.data()) {
                        this.setState({team: querySnapshot.data().pilots});
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
            console.log("This user doesn't exist: ", error);
        });
    }

    render() {
        if (this.state.hasError) {
            return <ErrorPage/>
        }
        return (
            <PersonnelInfo user={this.state.userID} name={this.props.name} role={this.state.role} team={this.state.team} teamNum={this.state.teamNum} 
                            lastFlight={this.state.lastFlight}
                            email={this.state.email} approvals={this.state.approvals}/>
        )
    }
}

export default Personnel;