## Available Scripts

To start, in the project directory, run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Data Population

Run in Terminal using `node insertData.js` followed by the following parameters: 
- `dates` {month (formatted MM)} {startDate} {endDate}
- `pilots`
- `flights | meetings | apts` {month (formatted MM)} {startDate} {endDate}

## Authentication

You can choose to sign up with your @forces.gc.ca email address. You will need to click link in verification email to log in (this may take a few minutes). 

Otherwise, you can use the guest login: 
### Email: amelia.earhart97@outlook.com
### Password: amelia

To populate with fake test data: 
* Run node insertData [action] [parameters]
* Available actions: 
    * Pilots
    * Dates [month (two digit)] [startDate] [endDate]
    * Meetings [amount] [month (two digit)] [startDate] [endDate]
    * Apts [amount] [month (two digit)] [startDate] [endDate]
    * Flights [amount] [month (two digit)] [startDate] [endDate]

