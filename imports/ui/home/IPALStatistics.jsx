import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
        Table, Row, Col, Card, CardImg, CardText, CardBody,
        CardTitle, CardSubtitle, Button, Progress, Spinner
} from 'reactstrap';
import numbro from 'numbro';
import Avatar from '../components/Avatar.jsx';
import i18n from 'meteor/universe:i18n';
const T = i18n.createComponent();

export default class IPALStatistics extends Component {
        constructor(props) {
                super(props);
                this.timer = 0;
                this.state = {
                        total: 0,
                        hour24: "0"
                }
        }

        componentDidMount() {
                let self = this;
                this.tick()
                self.timer = setInterval(() => this.tick(), 10_000);
        }

        componentWillUnmount() {
                Meteor.clearInterval(this.timer);
        }

        tick = () => {
                var self = this
                fetch('http://rpc.netcloth.org/cipal/count')
                        .then(res => res.json())
                        .then(json => {
                                self.setState({
                                        total: json.result.count
                                })
                        })

                fetch('http://rpc.netcloth.org/cipal/count/latest/24hour')
                        .then(res => res.json())
                        .then(json => {
                                self.setState({
                                        hour24: json.result.count
                                })
                        })
        }


        render() {

                const customStyle = {
                        // 原始css属性需要用引号
                        container: {
                                "height":"25px",
                                "display": "flex",
                                "margin-bottom":"10px",
                        },
                        diff: {
                                "margin-left":"15px"
                        },
                        text: {
                                "color":"#bd081c",
                        }
                      };



                if (this.props.loading) {
                        return <Spinner type="grow" color="primary" />
                }
                else {
                        return <div style={customStyle.container}>
                         <p> <T>IPALStatistics.totalUser</T> <span style={customStyle.text}>{this.state.total}</span> </p>  
                         <p style={customStyle.diff}> <T>IPALStatistics.hour_24</T>  <span style={customStyle.text}>{this.state.hour24}</span></p>
                        </div>;
                }
        }
}