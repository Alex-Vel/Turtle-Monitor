import React, { Component } from 'react'
import { Charts, ChartContainer, ChartRow, YAxis, LineChart, styler, Resizable} from "react-timeseries-charts";
import { TimeSeries, TimeEvent, TimeRange } from "pondjs";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {Card, CardContent} from '@mui/material';
import './temperature.css';




export class TemperatureSeries extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            dataTemp:null,
            dataHumid:null,
            temperatureTimeRange: new TimeRange([0, new Date().getTime()]),
        }
    }
    async componentDidMount(){
        var firestore = getFirestore();
        var auth = getAuth()
        var dataTemp = []
        var dataHumid = []
        var query = await getDocs(collection(firestore,"fridges_IoT",auth.currentUser.uid,"oldData"));
        query.forEach((document) => {
            var unix_timestamp = document.id.slice(-10)
            dataTemp.push(new TimeEvent(new Date(unix_timestamp * 1000), { value: document.data().ambient_temp }));
            dataHumid.push(new TimeEvent(new Date(unix_timestamp * 1000), { value: document.data().humidity }));
        });
        var seriesTemp = new TimeSeries({
            name: "avg temps",
            events: dataTemp
        });
        var seriesHumid = new TimeSeries({
            name: "avg humidity",
            events: dataHumid
        });
        var startTime = seriesTemp.timerange().begin().getTime()+((seriesTemp.timerange().end().getTime()-seriesTemp.timerange().begin().getTime())/2);
        var timeRange = new TimeRange([startTime, new Date().getTime()]);
        if(seriesTemp.size()>0){
            this.setState({
                dataTemp:seriesTemp,
                dataHumid:seriesHumid,
                temperatureTimeRange:timeRange
            })
        }
    }

    handleTimeRangeChange = timerange => {
        this.setState({ temperatureTimeRange:timerange });
    };
    renderTemp(){
        const { dataTemp, temperatureTimeRange } = this.state;
        const croppedTemp = dataTemp.crop(temperatureTimeRange);
        const Style = styler([
            {key: "value", color: "white", width: 1},
        ]);
        return (
            <ChartContainer  timeRange={temperatureTimeRange} enablePanZoom={true} onTimeRangeChanged={this.handleTimeRangeChange}>

                        <ChartRow id="Temperature" height="300">
                            <YAxis
                                id="y"
                                label="Temperature (°C)"
                                min={croppedTemp.min()}
                                max={croppedTemp.max()}
                                format=",.0f"
                            />
                            <Charts>
                                <LineChart
                                    axis="y"
                                    series={dataTemp}
                                    columns={["value"]}
                                    style={Style}
                                />
                            </Charts>
                        </ChartRow>
                    </ChartContainer>

        )
    }
    renderHumid(){ 
        const { dataHumid, temperatureTimeRange } = this.state;
        const croppedHumid = dataHumid.crop(temperatureTimeRange);
        const Style = styler([
            {key: "value", color: "white", width: 1},
        ]);
        return (
            <ChartContainer timeRange={temperatureTimeRange} enablePanZoom={true} onTimeRangeChanged={this.handleTimeRangeChange}>

                        <ChartRow id="Humidity" height="300">
                            <YAxis
                                id="y"
                                label="Humidity (%)"
                                min={croppedHumid.min()}
                                max={croppedHumid.max()}
                                format=",.0f"
                            />
                            <Charts>
                                <LineChart
                                    axis="y"
                                    series={dataHumid}
                                    columns={["value"]}
                                    style={Style}
                                />
                            </Charts>
                        </ChartRow>
                    </ChartContainer>
        )
    }

    render() {
        const { dataTemp, dataHumid } = this.state;
        return (
            <div>
            <Card id="TemperatureSeries" variant="outlined">
                {dataTemp ? 
                <CardContent> 
                    <Resizable>
                        {this.renderTemp()}
                    </Resizable>
                </CardContent>
                :
                <div>Loading...</div>
                }
            </Card>
            <div id="p7">
                <p>
                    Humidity in your fridge:
                </p>
            </div>
            <Card id="TemperatureSeries" variant="outlined">
                {dataHumid ? 
                <CardContent>
                    <Resizable>
                        {this.renderHumid()}
                    </Resizable>
                </CardContent>
                :
                <div>Loading...</div>
                }
            </Card>
            </div>
        )
    }
               
}

export default TemperatureSeries
