import React, { Component } from "react";
import { withFormik, Form, Field } from "formik";
// https://medium.com/@hamzaqaisrani/using-the-google-maps-places-autocomplete-javascript-api-in-a-react-project-5742bab4abc9
import Script from "react-load-script";

class LocationSearch extends Component {
  state = {
    query: "",
    lat: "",
    lng: ""
  };

  handle_script_load = () => {
    // Declare Options For Autocomplete
    const options = { types: ["(cities)"] };

    // Initialize Google Autocomplete
    /*global google*/
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("location_input"),
      options
    );
    // Avoid paying for data that you don't need by restricting the
    // set of place fields that are returned to just the address
    // components and formatted address
    this.autocomplete.setFields(["formatted_address", "geometry"]);
    // Fire Event when a suggested name is selected
    this.autocomplete.addListener("place_changed", this.handle_place_select);
  };

  handle_place_select = () => {
    const location = this.autocomplete.getPlace();
    // Check if address is valid
    if (location) {
      // Set State
      this.setState({
        query: location.formatted_address,
        lat: location.geometry.location.lat(),
        lng: location.geometry.location.lng()
      });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { setFieldValue } = this.props;
    if (prevState !== this.state) {
      setFieldValue("location_input", this.state.query);
      setFieldValue("lat", this.state.lat);
      setFieldValue("lng", this.state.lng);
    }
  };

  render() {
    return (
      <div>
        <Form>
          <div className="custom-input-wrapper">
            <div className="row">
              <div className="input-field col m4 offset-m4">
                <Field id="location_input" name="location_input" />
              </div>
              <div className="input-field col m4">
                <button type="submit" className="btn btn-search">
                  <i className="material-icons custom-icon create-icon">
                    search
                  </i>
                </button>
              </div>
            </div>
          </div>
        </Form>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyASG3gi07UDJjjjSAtibzgZ6uo7bb0IQLA&libraries=places"
          onLoad={this.handle_script_load}
        />
      </div>
    );
  }
}

const Formik = withFormik({
  mapPropsToValues(props) {
    return {
      location_input: "",
      lat: "",
      lng: ""
    };
  },
  handleSubmit(values, props) {
    props.props.on_location_select(values);
  },
  enableReinitialize: true
})(LocationSearch);

export default Formik;
