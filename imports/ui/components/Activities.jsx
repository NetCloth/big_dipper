import React, {Component } from 'react';
import { MsgType } from './MsgType.jsx';
import { Link } from 'react-router-dom';
import numbro from 'numbro';
import Account from '../components/Account.jsx';
import i18n from 'meteor/universe:i18n';
import Coin from '/both/utils/coins.js'

const T = i18n.createComponent();

MultiSend = (props) => {
    return <div>
        <p><T>activities.single</T> <MsgType type={props.msg.type} /> <T>activities.happened</T></p>
        <p><T>activities.senders</T>
            <ul>
                {props.msg.value.inputs.map((data,i) =>{
                    return <li key={i}><Account address={data.address}/> <T>activities.sent</T> {data.coins.map((coin, j) =>{
                        return <em key={j} className="text-success">{new Coin(coin.amount).toString()}</em>
                    })}
                    </li>
                })}
            </ul>
            <T>activities.receivers</T>
            <ul>
                {props.msg.value.outputs.map((data,i) =>{
                    return <li key={i}><Account address={data.address}/> <T>activities.received</T> {data.coins.map((coin,j) =>{
                        return <em key={j} className="text-success">{new Coin(coin.amount).toString()}</em>
                    })}</li>
                })}
            </ul>
        </p>
    </div>
}

export default class Activites extends Component {
    constructor(props){
        super(props);
    }

    render(){
        // console.log(this.props);
        let msg = this.props.msg;
        switch (msg.type){
        // bank
        case "nch/MsgSend":
            let amount = '';
            amount = msg.value.amount.map((coin) => new Coin(coin.amount).toString()).join(', ')
            return <p><Account address={msg.value.from_address} /> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /> <em className="text-success">{amount}</em> <T>activities.to</T> <span className="address"><Account address={msg.value.to_address} /></span><T>common.fullStop</T></p>
        case "nch/MsgMultiSend":
            return <MultiSend msg={msg} />

            // staking
        case "nch/MsgCreateValidator":
            return <p><Account address={msg.value.delegator_address}/> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /> <T>activities.operatingAt</T> <span className="address"><Account address={msg.value.validator_address}/></span> <T>activities.withMoniker</T> <Link to="#">{msg.value.description.moniker}</Link><T>common.fullStop</T></p>
        case "nch/MsgEditValidator":
            return <p><Account address={msg.value.address}/> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /></p>
        case "nch/MsgDelegate":
            return <p><Account address={msg.value.delegator_address}/> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /> <em className="text-warning">{new Coin(msg.value.amount.amount).toString()}</em> <T>activities.to</T> <Account address={msg.value.validator_address} /><T>common.fullStop</T></p>
        case "nch/MsgUndelegate":
            return <p><Account address={msg.value.delegator_address} /> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /> <em className="text-warning">{new Coin(msg.value.amount.amount).toString()}</em> <T>activities.from</T> <Account address={msg.value.validator_address} /><T>common.fullStop</T></p>
        case "nch/MsgBeginRedelegate":
            return <p><Account address={msg.value.delegator_address} /> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /> <em className="text-warning">{new Coin(msg.value.amount.amount).toString()}</em> <T>activities.from</T> <Account address={msg.value.validator_src_address} /> <T>activities.to</T> <Account address={msg.value.validator_dst_address} /><T>common.fullStop</T></p>

            // gov
        case "nch/MsgSubmitProposal":
            return <div>{JSON.stringify(msg.value)}</div>
            // return <p><Account address={msg.value.proposer} /> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /> <T>activities.withTitle</T> <Link to={"/proposals/"+this.props.events[2].attributes[0].value}>{msg.value.content.value.title}</Link><T>common.fullStop</T></p>
        case "nch/MsgDeposit":
            return <div>{JSON.stringify(msg.value)}</div>
            // return <p><Account address={msg.value.depositor} /> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /> <em className="text-info">{msg.value.amount.map((amount,i) =>new Coin(amount.amount).toString()).join(', ')}</em> <T>activities.to</T> <Link to={"/proposals/"+msg.value.proposal_id}><T>proposals.proposal</T> {msg.value.proposal_id}</Link><T>common.fullStop</T></p>
        case "nch/MsgVote":
            return <div>{JSON.stringify(msg.value)}</div>
            // return <p><Account address={msg.value.voter} /> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} />  <Link to={"/proposals/"+msg.value.proposal_id}><T>proposals.proposal</T> {msg.value.proposal_id}</Link> <T>activities.withA</T> <em className="text-info">{msg.value.option}</em><T>common.fullStop</T></p>

            // distribution
        case "nch/MsgWithdrawValidatorCommission":
            return <p><Account address={msg.value.validator_address} /> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /><T>common.fullStop</T></p>
        case "nch/MsgWithdrawDelegationReward":
            return <p><Account address={msg.value.delegator_address}/> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /> <T>activities.from</T> <Account address={msg.value.validator_address} /><T>common.fullStop</T></p>
        case "nch/MsgModifyWithdrawAddress":
            return <p><Account address={msg.value.delegator_address}/> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /></p>

            // slashing
        case "nch/MsgUnjail":
            return <p><Account address={msg.value.delegator_address}/> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /><T>common.fullStop</T></p>

            // ibc
        case "nch/IBCTransferMsg":
            return <MsgType type={msg.type} />
        case "nch/IBCReceiveMsg":
            return <MsgType type={msg.type} />

            // ipal
        case "nch/IPALClaim":
            return <p><Account address={msg.value.operator_address}/> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type}/> moniker: {msg.value.moniker} <T>common.fullStop</T></p>
        case "nch/CIPALClaim":
            return <p><Account address={msg.value.from}/> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type}/> user_address {msg.value.user_request.params.user_address} <T>common.fullStop</T></p>

        default:
            return <div>{JSON.stringify(msg.value)}</div>
        }
    }
}