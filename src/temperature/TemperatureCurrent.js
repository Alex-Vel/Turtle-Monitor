import React, { Component } from 'react'
import { getFirestore, collection, getDocs, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {Card, CardContent, CardHeader, Typography} from '@mui/material';
import './temperature.css';
import sendNotification from './WebPush';


const firestore = getFirestore()
const auth = getAuth()

export class TemperatureCurrent extends Component {

    constructor(props) {
        super(props)

        var data ={
            ambient_temp:0,
            humidity:0,
            bottle_temp:0,
            bottle_cold:false,
            door:false,
            myref:null
        }
        this.state = {
             currentTemp: data,
             name:"",
             initialValues:true,
             doorWarning:true,
             bottleWarning:true,
        }
    }
    async componentDidMount(){
        const query = await getDocs(collection(firestore,"fridges_IoT",auth.currentUser.uid,"liveData"));
        query.forEach((document) => {
            this.setState({
                currentTemp:document.data(),
                name:document.id,
                initialValues:false,
                bottleWarning:false,
                doorWarning:false
            })
        });
    }
    unsub = onSnapshot(collection(firestore,"fridges_IoT",auth.currentUser.uid,"liveData"), (query) => {
        //the query may be empty or contain multiple documents, we only need one document
        //the correct data is currently saved in the latest document, thus we loop through the documents and save the latest one
        var doc
        query.forEach((document) => {
            doc=document.data()
        });
        // if a document exists we then update the state, this is different from the initial loading in componentDidMount to avoid mutiple notifications on multiple documents
        if(doc!==undefined){
            //check if the ambient temperature change is greater than 10%
            if(!this.state.initialValues && (doc.ambient_temp > this.state.currentTemp.ambient_temp*1.1 || doc.ambient_temp < this.state.currentTemp.ambient_temp*0.9)){
                sendNotification("The ambient temperature has changed. \n Current temperature: "+doc.ambient_temp+"°C\n Old temperature: "+this.state.currentTemp.ambient_temp+"°C")
            }
            //check if bottle is cooled down
            if(doc.bottle_cold&&!this.state.bottleWarning){
                sendNotification("The bottle is cooled down")
                this.setState({bottleWarning:true})
            } else if(!doc.bottle_cold&&this.state.bottleWarning){
                this.setState({bottleWarning:false})
            }
            //check if door is open
            if(doc.door&&!this.state.doorWarning){
                sendNotification("The door is open for more than 5 minutes, please close it")
                this.setState({
                    doorWarning:true
                })
            }else if(!doc.door&&this.state.doorWarning){
                this.setState({
                    doorWarning:false
                })
            }
            this.setState({
                currentTemp:doc,
                initialValues:false
            })
        }      
    });
    render() {
        return (
            <Card id="mui-card" sx={{ maxWidth: 345 }} variant="outlined">
                <CardHeader id="mui-title" title={this.state.name} />
                <CardContent id="mui-content">
                    <Typography id="mui-content">Ambient temperature: {this.state.currentTemp.ambient_temp}</Typography>
                    <Typography id="mui-content">Bottle temperature: {this.state.currentTemp.bottle_temp}</Typography>
                    <Typography id="mui-content">Humidity: {this.state.currentTemp.humidity}</Typography>
                    <Typography id="mui-content">Door: {this.state.currentTemp.door?"Open":"Closed"}</Typography>
                </CardContent>
            </Card>    
        )
    }
}

export default TemperatureCurrent