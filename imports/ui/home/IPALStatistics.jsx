import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
        Table, Row, Col, Card, CardImg, CardText, CardBody,
        CardTitle, CardSubtitle, Button, Progress, Spinner
} from 'reactstrap';
import numbro from 'numbro';
import Avatar from '../components/Avatar.jsx';
import i18n from 'meteor/universe:i18n';
import axios from 'axios';

const T = i18n.createComponent();

export default class IPALStatistics extends Component {
        constructor(props) {
                super(props);
                this.timer = 0;
                this.state = {
                        total: '~',
                        hour24: "~"
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
                axios.get(`https://explorer.netcloth.org/lcd/cipal/count`)
                .then(function (rsp) {
                        let r = rsp.data
                        self.setState({
                                total:r.result.count
                        })
                })

                axios.get(`https://explorer.netcloth.org/cipal/count/latest/24hour`)
                .then(function (rsp) {
                        let r = rsp.data
                        self.setState({
                                hour24:r.result.count
                        })
                })
        }


        render() {

                const customStyle = {
                        // 原始css属性需要用引号
                        container: {
                                "height":"37px",
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