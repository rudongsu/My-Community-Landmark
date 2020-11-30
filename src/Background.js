import { render } from '@testing-library/react';
import React, {Component} from 'react';
import * as axios from 'axios';

const api = axios.create({
    baseURL: "https://localhost:5001/notes",
  });

class Background extends Component {
    constructor(){
        super();
        this.state = {
            notes: [],
        }
    }

    componentDidMount = async() => {
         await api.get()
        .then((data) => {
            let notes = data.data.map(       
                (note) => {
                    //console.log(note);
                    return (
                        <div key={note.id}>
                            '{note.value}'
                        </div>
                    )
                }
            );
            this.setState({notes: notes});
        })

    }

    render(){
        return(
            <div>
                {this.state.notes}
            </div>
        )
    }
    
}



export default Background
