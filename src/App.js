import React, { Component, useState } from "react";
import { GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import CurrentLocation from "./Map";
import * as axios from "axios";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";

const api = axios.create({
  baseURL: "https://localhost:5001/notes",
});

const mapStyles = {
  width: "100%",
  height: "100%",
};

export class MapContainer extends Component {

  constructor() {
    super();
    this.state = {
      show: false,
      note: "",
      usernameInput: "",
      showHide: false,
      showingInfoWindow: false, // Hides or shows the InfoWindow
      activeMarker: {}, // Shows the active marker upon click
      selectedPlace: {}, // Shows the InfoWindow to the selected place upon a marker
    };
    this.createNote = this.createNote.bind(this);
    this.getNote = this.getNote.bind(this);
  }

  showModal = (e) => {
    this.setState({
      show: !this.state.show,
    });
  };

  onSubmit = () => {
    console.log(this.state.usernameInput);
    this.getNote();
  };

  onClose = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };
  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });

  getNote = async (usernameInput) => {
    console.log("reading");
    let data = await api
      .get()
      .then((data) => {
        console.log(data.data.value);
        this.setState({ note: data.data.value });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  createNote = async () => {
    let usernameSaved = document.getElementById("username").value;
    console.log('saved username:', usernameSaved);
    this.state.usernameInput = usernameSaved;
    let noteSaved = document.getElementById("notes").value;
    let res = await api.post("", {
      value: noteSaved,
      username: usernameSaved,
    });
    console.log("result is", res);
  };

  onInfoWindowOpen = (props, e) => {
    const newWindows = (
      <Container>
        <h3>Current Location</h3>
        <hr></hr>
        <h6>1. Enter an username</h6>
        <Row>
          <Col>
            <input type="text" id="username" />
          </Col>
        </Row>
        <hr></hr>
        <h6>2. Add note</h6>
        <Row>
          <Col>
            <input type="text" id="notes" />
          </Col>
        </Row>
        <hr></hr>
        <Row>
          <Col>
            <Button variant="primary" onClick={this.createNote}>
              Add
            </Button>{" "}
          </Col>
        </Row>
        <hr></hr>

        <h6>3. Past notes...</h6>

        <Row>{this.state.note}</Row>

      </Container>
    );
    ReactDOM.render(
      React.Children.only(newWindows),
      document.getElementById("iwc")
    );
  };

  MapsComponent = () => {
    return (
      <span>
        {/* <InputGroup size="lg" className="mb-3">
          <FormControl
            placeholder="Enter username"
            aria-describedby="basic-addon2"
            value={this.state.usernameInput}
            onChange={(e) => this.setState({ usernameInput: e.target.value })}
          />
          <InputGroup.Append>
            <Button
              onClick={() => {
                this.onSubmit();
              }}
            >
              Save
            </Button>
          </InputGroup.Append>
        </InputGroup>{" "} */}
        <CurrentLocation centerAroundCurrentLocation google={this.props.google}>
          <Marker onClick={this.onMarkerClick} name={"Current Location"} />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onClose}
            onOpen={(e) => {
              //this.getNote();
              this.onInfoWindowOpen(this.props, e);
            }}
          >
            <div id="iwc"></div>
          </InfoWindow>
        </CurrentLocation>
      </span>
    );
  };

  render() {
    return (
      <div>
        <this.MapsComponent />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "",
})(MapContainer);
