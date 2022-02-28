import React, { Component } from 'react'
import { getFirestore, doc, onSnapshot, getDoc, docData} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {Card, CardContent, CardHeader, Typography} from '@mui/material';
import './temperature.css';

const firestore = getFirestore()
const auth = getAuth()

export class TemperatureCurrent extends Component {


    constructor(props) {
        super(props)
    
        this.state = {
            temperature: 0,
            humidity: 0
        }
    }
    async componentDidMount(){
        let docRef = doc(firestore, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        let docData;
        console.log(auth.currentUser.uid);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          docData = docSnap.data();
          this.setState({temperature: docData.temperature})
          this.setState({humidity: docData.humidity})
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
    }

    componentDidUpdate(){
 
    
    }


    render() {
        return (
            <Card id="mui-card" sx={{ maxWidth: 345 }} variant="outlined">
                <CardHeader id="mui-title" title={this.state.name} />
                <CardContent id="mui-content">
                    <Typography id="mui-content">Ambient temperature: {this.state.temperature}</Typography>
                    <Typography id="mui-content">Humidity: {this.state.humidity}</Typography>
                </CardContent>
            </Card>    
        )
    }
}

export default TemperatureCurrent