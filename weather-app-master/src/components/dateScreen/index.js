import { h, Component } from 'preact';
import $ from 'jquery';
import style from './date.less';
import Button from '../button';
import HomeScreen from '../homeScreen';


//date screen with three hour forecast
export default class DateScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screen: 'Date',
            hour: [],
            temperature: [],
            windSpeed: [],
            display: true
        };
    }



    //api call to get the forecast details
    componentDidMount() {
        // Make API call to get hourly forecast data
        const apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=51.51&longitude=-0.13&hourly=temperature_2m,windspeed_120m&forecast_days=1';

        $.ajax({
            url: apiUrl,
            dataType: 'json',
            success: this.parseResponse,
            error: function(req, err){ console.log('API call failed ' + err); }
        });
    }

     //function for switching the screen to homescreen
     switchToHome = () =>{

        this.setState({ screen : 'Home'})
        
    }

    render() {
        if(this.state.screen == 'Date')
        {
            const hourRows = this.state.hour.map((hour, index) => {
                if (index % 3 === 0) {
                    return (
                        // table rows
                        <tr>
                            {/* showing three - hour forecast */}
                            <td>{hour}</td>
                            <td>{this.state.temperature[index]}°C</td>
                            <td>{this.state.windSpeed[index]} km/h</td>
                        </tr>
                    );
                } else {
                    return null;
                }
            });
    
            return (
                
                <div class={style.dateapp}>
                  <h1>Hourly Forecast</h1>
                  <table>
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Temperature</th>
                        <th>Wind Speed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hourRows}
                    </tbody>
                  </table>
                  {/* back button to change to homescreen */}
                  <button class={style.backBtn} onClick= {this.switchToHome}>  Back</button>
                </div>
              );

        }
        else if (this.state.screen == 'Home'){
            return(
                // if the setState is home it will change to  homescreen with the state values
                <HomeScreen />
            );
        }
    }

    // data fetched from the json file
    parseResponse = (parsed_json) => {
        const hourlyData = parsed_json['hourly'];
        const hour = hourlyData['time'].map(h => h.slice(11));;
        const temperature = hourlyData['temperature_2m'];
        const windSpeed = hourlyData['windspeed_120m'];

        // Set states for fields so they could be rendered later on
        this.setState({
            hour: hour,
            temperature: temperature,
            windSpeed: windSpeed,
            display: false
        });
    }
}
