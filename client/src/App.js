import React, { Component } from "react";
import LocationSearch from "./components/location_search/LocationSearch";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";

class App extends Component {
  state = {
    summary: null,
    precipitation_probability: null,
    precipitation_type: null,
    temperature: null,
    wind_speed: null,
    location: null,
    icon: "CLEAR_DAY"
  };

  handle_location_select = async location_data => {
    const { lat, lng, location_input } = location_data;
    try {
      const res = await axios.post("/api/weather", {
        lat,
        lng
      });

      const {
        summary,
        precipProbability,
        precipType,
        temperature,
        windSpeed,
        icon
      } = res.data;

      let formatted_icon_string = icon.replace(/-/g, "_");
      formatted_icon_string = formatted_icon_string.toUpperCase();

      this.setState({
        location: location_input,
        summary,
        precipitation_probability: precipProbability,
        precipitation_type: precipType,
        temperature,
        wind_speed: windSpeed,
        icon: formatted_icon_string
      });
    } catch (error) {
      console.log(error);
    }
  };

  render_precipitation_output = () => {
    const { precipitation_type, precipitation_probability } = this.state;

    if (precipitation_probability == 0) {
      return <div>0%</div>;
    } else {
      if (precipitation_type) {
        return (
          <div>
            <span className="precip-type">{`${precipitation_type}`}</span>
            <span className="precip-prob">{`${precipitation_probability *
              100}%`}</span>
          </div>
        );
      } else {
        return <div>N/A</div>;
      }
    }
  };

  render() {
    const { summary, temperature, wind_speed, location, icon } = this.state;

    return (
      <div className="custom-container">
        <div className="header">
          <div className="icon-container">
            <ReactAnimatedWeather
              icon={this.state.icon}
              color={"#000"}
              size={100}
              animate={true}
            />
          </div>
        </div>
        <div className="content">
          <div className="general-information">
            <div className="status">Enter A Location</div>
            <div className="location">To Find The Weather</div>
          </div>
          <div className="detail-section">
            <div className="detail">
              <div className="title">Wind</div>
              <div className="value">{wind_speed ? (
                `${wind_speed}km`
                ) : "N/A"}</div>
            </div>
            <div className="detail bordered">
              <div className="title">Temperature</div>
              <div className="value">
                {temperature ? (
                  <div>
                    {Math.round(temperature)} <span>&#8451;</span>
                  </div>
                ) : (
                  "N/A"
                )}
              </div>
            </div>
            <div className="detail">
              <div className="title">Precipitation</div>
              <div className="value">{this.render_precipitation_output()}</div>
            </div>
          </div>
          <div className="search-container">
            <LocationSearch on_location_select={this.handle_location_select} />
          </div>
        </div>
        <div className="row">
          <div className="col m12">
            <div className="center-align">
              <a href="https://darksky.net/poweredby" className="dark-sky-link">
                Powered By Dark Sky
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
