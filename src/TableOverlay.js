import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import axios from "axios";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import {  ButtonGroup, Button } from "react-bootstrap";
import * as API from './api/index';

const noteAPI = API.NOTE_API;

export class TableOverlay extends Component {
  constructor() {
    super();
    this.state = {
      toggle: false,
      username: [],
      columns: [
        {
          dataField: "username",
          text: "Username",
          filter: textFilter({
            placeholder: "Search",
          }),
        },

        {
          dataField: "location",
          text: "Location",
          filter: textFilter({
            placeholder: "Search",
          }),
        },
        {
          dataField: "value",
          text: "Note",
          filter: textFilter({
            placeholder: "Search",
          }),
        },
      ],
    };
    //this.onToggle = this.onToggle.bind(this)
  }

  loadTableData = () => {
    try {
      axios.get(noteAPI).then((res) => {
        //console.log(res.data);
        this.setState({
          username: res.data,
        });
      });
    } catch (error) {
      alert(error);
    }
  };

  componentDidMount() {
    //const allNoteAPI = 'https://localhost:5001/notes';
    //const getAllNote = axios.get(allNoteAPI);
    // axios.all([getAllNote, getgeoLocation]).then(
    //   axios.spread((...allData) =>{
    //     const allDataNote = allData[0];
    //     const allGeo = allData[1];
    //     //console.log('allDataNote', allDataNote);
    //     console.log( allGeo.data.Response.View[0].Result[0].Location.Address.Label);
    //     this.setState({
    //       username: allDataNote.data
    //     })
    //     for(let i=0; i<allData[0].data.length; i++ ){
    //       const GeoLat = allData[0].data[i].lat;
    //       const GeoLng = allData[0].data[i].lng;
    //     }
    //   })
    // )
    this.loadTableData();
  }

  componentDidUpdate() {
    this.loadTableData();
  }

  render() {
    const options = {
      sizePerPage: 5,
      paginationSize: 3,
      hideSizePerPage: true,
    };
    return (
      <div className="container">
        <div  style={{
         top: '102px',
        
    }}></div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ButtonGroup>
            <Button
              variant="info" 
              onClick={() => {
                this.setState({ toggle: !this.state.toggle });
              }}
              onMouseEnter={() => {
                this.setState({ toggle: true });
              }}
            >
              Check the community
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                window.location.reload();
              }}
            >
              Logout
            </Button>
          </ButtonGroup>
        </div>

        {/* <Row>
          <Col xs={12} md={10}>
            <div
              className="col-md-12 btn btn-info"
              onClick={() => {
                this.setState({ toggle: !this.state.toggle });
              }}
              onMouseEnter={() => {
                this.setState({ toggle: true });
              }}
              //onMouseLeave={() => {this.setState({toggle: false})}}
            >
              Check the community
            </div>
          </Col>
          <Col xs={6} md={2}>
            <div
              className="col-md-12 btn btn-danger"
              onClick={() => {
                window.location.reload();
              }}
            >
              Logout
            </div>
          </Col>
        </Row> */}

        {this.state.toggle ? (
          <div style={{ margin: 0 }} className="overlay">
            <BootstrapTable
              hover
              keyField="id"
              data={this.state.username}
              columns={this.state.columns}
              filter={filterFactory()}
              pagination={paginationFactory(options)}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default TableOverlay;
