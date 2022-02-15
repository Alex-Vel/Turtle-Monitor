import React, { Component } from 'react'
import { getFirestore, doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore"
import './temperature.css';
import Button from '@mui/material/Button';

export class TemperatureInput extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
             date: new Date(),
             number:0.0,
        }
    }
    updateInput = e => {
        this.setState({
          [e.target.name]: e.target.value
        });
      }
    addTemperature =async(e) =>{
        const firestore = getFirestore()
        e.preventDefault();
        var loc = "temperature/gCtQcYpVpyfmfrtV36gd/fridge1";
        console.log(this.state)
        await setDoc(doc(firestore, loc, new Date().toLocaleString() ), {
            time: this.state.date,
            temperature: this.state.number
          });

        this.setState({
            date: new Date(),
            number: 0.0
        })
        
    }
    copyFridge = async (e) => {
        //Simple function to copy fridge data to test the frontend
        const firestore = getFirestore()
        e.preventDefault();
        var loc = "/fridges_IoT/IC7zVLHK4yRpTsdMm6rzzuuDiUP2";
        var locpaul = "/fridges_IoT/x2rVxVAfoFUHhpH0LScjicZRlMX2";
        var locjulia = "/fridges_IoT/KY0Fgt0Yz5bnvI0qBYsI1MzpvL42";
        var dataDoc= await (await getDoc(doc(firestore, loc, "liveData", "Alex_Fridge"))).data();
        console.log(dataDoc)
        await setDoc(doc(firestore, locpaul, "liveData", "Paul_Fridge"), {
            ambient_temp: dataDoc.ambient_temp,
            humidity: dataDoc.humidity,
            bottle_temp: dataDoc.bottle_temp,
            bottle_cold: dataDoc.bottle_cold,
            door: dataDoc.door,
            myRef: dataDoc.myRef,
        });
        await setDoc(doc(firestore, locjulia, "liveData", "Julia_Fridge"), {
            ambient_temp: dataDoc.ambient_temp,
            humidity: dataDoc.humidity,
            bottle_temp: dataDoc.bottle_temp,
            bottle_cold: dataDoc.bottle_cold,
            door: dataDoc.door,
            myRef: dataDoc.myRef,
        });
        var col = await getDocs(collection(firestore, loc, "oldData"));
        col.forEach(async (document) => {
            let doorVal = document.data().door;
            if(typeof(document.data().door) == 'undefined' ){
                doorVal = false;
            }
            await setDoc(doc(firestore, locpaul, "oldData", "Paul_Fridge"+ document.id.slice(-10)), {
                ambient_temp: document.data().ambient_temp,
                humidity: document.data().humidity,
                bottle_temp: document.data().bottle_temp,
                door: doorVal,
                myRef: document.data().myRef
                });
            await setDoc(doc(firestore, locjulia, "oldData", "Julia_Fridge"+ document.id.slice(-10)), {
                ambient_temp: document.data().ambient_temp,
                humidity: document.data().humidity,
                bottle_temp: document.data().bottle_temp,
                door: doorVal,
                myRef: document.data().myRef
            });
        })
        console.log("Copied")
    }
    render() {
        return (
            <div id="temperatureInput">
                
                <div id="card">
                    <Button variant="contained" id="button_copyFridge" onClick={this.copyFridge}>Copy Data from existing Fridge</Button>
                    <form id="form" onSubmit={this.addTemperature} >
                        <p id="p8">
                            Insert date:
                        </p>
                        <input id="date"
                            type="datetime-local"
                            name="date"
                            onChange={this.updateInput}
                            value={this.state.date}
                        />
                        <p id="p8">
                            Insert Temperature:
                        </p>
                        <input id="number"
                            type="number"
                            name="number"
                            placeholder="0.0"
                            onChange={this.updateInput}
                            value={this.state.number}
                        />
                        <br></br>
                        <Button variant="contained" id="button_submit" type="submit">Submit</Button>
                        </form>
                </div>
            </div>
        )
    }
}

export default TemperatureInput
