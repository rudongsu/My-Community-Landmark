import React, { Component } from "react";
import { GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import CurrentLocation from "./Map";
import * as axios from "axios";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit } from "react-icons/fa";
import {RiDeleteBin5Line} from "react-icons/ri";

import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import * as API from "./api/index";

const noteAPI = API.NOTE_API;

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false, //shows maps
      notes: [], //object to save all returned notes from DB
      overlay: true, //loading screen overlay
      showingInfoWindow: false, // Hides or shows the InfoWindow
      activeMarker: {}, // Shows the active marker upon click
      selectedPlace: {}, // Shows the InfoWindow to the selected place upon a marker
      latValue: "", //coordinates value
      lngValue: "", //coordinates value
      location: "", //location as string
      usernameSaved: "", //entered username
    };
    this.createNote = this.createNote.bind(this);
    this.getNote = this.getNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
  }

  callbackFunction = (childData) => {
    this.setState({
      usernameSaved: childData,
    });
  };

  showModal = (e) => {
    this.setState({
      show: !this.state.show,
    });
  };

  onClose = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      latValue: props.mapCenter.lat,
      lngValue: props.mapCenter.lng,
    });
    this.getLocation();
    this.getNote();
  };

  getLocation = () => {
    const geoLocationAPI =
    "https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?prox=" +
    this.state.latValue.toString() +
    "%2C" +
    this.state.lngValue.toString() +
    "%2C250&mode=retrieveAddresses&maxresults=1&gen=9&apiKey=" +
    process.env.REACT_APP_HEREAPIKEY;
    axios.get(geoLocationAPI).then((res)=>{
      const reverseGeo =
      res.data.Response.View[0].Result[0].Location.Address.Label;
    //console.log(reverseGeo);
    this.setState({
      location: reverseGeo,
    });
    }).catch((error)=>{console.log(error);});
  
  }
  
  updateNote = (note) =>{


  }

  deleteNote = (note) =>{
    axios.delete(noteAPI + "/" + note._id)
    .then((res) => {
      console.log('delete success: ', res.status);
      this.getNote();
    })
    .catch((error) =>{
      console.error('error', error);
    })
  }
  
  getNote = () => {
    axios
      .get(noteAPI + "/" + this.state.usernameSaved)
      .then((res) => {
        let notes = res.data.map((note) => {
          return (
            <Container>
              <Row>
                <Col sm={8} md={8} lg={8} xs={8}>
                  <div key={note._id}>'{note.value}'</div>
                </Col>
                {/* <Col sm={2} md={2} lg={2} xs={2}>
                  <div onClick={() =>  this.updateNote(note)}>
                  <FaEdit />
                  </div>
                </Col> */}
                <Col sm={4} md={4} lg={4} xs={4}>
                  <div onClick = {() => this.deleteNote(note)}>
                  <RiDeleteBin5Line />
                  </div>
                </Col>
              </Row>
            </Container>
          );
        });
        this.setState({ notes: notes });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  createNote = () => {
    let noteSaved = document.getElementById("notes").value;

    const geoLocationAPI =
      "https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?prox=" +
      this.state.latValue.toString() +
      "%2C" +
      this.state.lngValue.toString() +
      "%2C250&mode=retrieveAddresses&maxresults=1&gen=9&apiKey=" +
      process.env.REACT_APP_HEREAPIKEY;

    if (noteSaved === "") {
      alert("note cannot be empty");
    } else {
      try {
        axios.get(geoLocationAPI).then((res) => {

          axios
            .post(noteAPI, {
              value: noteSaved,
              username: this.state.usernameSaved,
              lat: this.state.latValue.toString(),
              lng: this.state.lngValue.toString(),
              location: this.state.location,
            })
            .then((res) => {
              if (res.status >= 200 && res.status < 400) {
                this.getNote();
              }
            });
        });
      } catch (e) {
        alert(e);
      }
    }
    
  };

  onInfoWindowOpen = (props, e) => {
    const newWindows = (
      <Container>
        <h3><b>Current Location:</b></h3>
        <h4><i>{this.state.location}</i></h4>
        <hr></hr>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Add new note"
            aria-label=""
            aria-describedby="basic-addon2"
            id="notes"
          />
          <InputGroup.Append>
            <Button variant="primary" onClick={this.createNote}>
              SAVE
            </Button>{" "}
          </InputGroup.Append>
        </InputGroup>
        <hr></hr>
        <Row>
          <Col xs={12} md={8}>
            {" "}
            <h6>My saved notes ({this.state.usernameSaved})</h6>
          </Col>
        </Row>
        {this.state.notes.length === 0 ? (
          <div>notes not found...</div>
        ) : (
          <div>{this.state.notes}</div>
        )}
      </Container>
    );
    ReactDOM.render(
      React.Children.only(newWindows),
      document.getElementById("iwc")
    );
  };

  MapsComponent = () => {
    return (
      <CurrentLocation
        centerAroundCurrentLocation
        google={this.props.google}
        parentCallback={this.callbackFunction}
      >
        <Marker onClick={this.onMarkerClick} name={"Current Location"} />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
          onOpen={(e) => {
            this.onInfoWindowOpen(this.props, e);
          }}
        >
          <div id="iwc"></div>
        </InfoWindow>
      </CurrentLocation>
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
  //apiKey: process.env.REACT_APP_GoogleAPIKey,
})(MapContainer);
