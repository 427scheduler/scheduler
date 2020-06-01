import React from 'react';
import "./ErrorPage.css";
import HELI_FRONT from "./img/heli_front.svg";
import HELI from "./img/helicopter.png";
import ReactGA from 'react-ga';

function initializeReactGA() {
    ReactGA.initialize('UA-168152066-1');
    ReactGA.pageview('/Error');
}

class ErrorPage extends React.Component {

    componentDidMount() {
        initializeReactGA();
    }
    render() {
        return (
        <div id="body">
            <div id="text">
                <img id='flying' src={HELI}/>
                <h1>Oops. Something went wrong.</h1>
                <div id="button_cont" align="center"><a class="example_f" href="./" target="_self" rel="nofollow"><span>Return to Base</span></a></div>
            </div>
            
            <div id='landed-container'>
                <img id='landed' src={HELI_FRONT}/>
                <img id='landed' src={HELI_FRONT}/>
            </div>
            
        </div>
        )
    }
}

export default ErrorPage;