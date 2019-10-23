import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Transactions } from '/imports/api/transactions/transactions.js';
import ValidatorTransactions from './Transactions.jsx';

export default TransactionsContainer = withTracker((props) => {
    let transactionsHandle, transactions, transactionsExist;
    let loading = true;

    if (Meteor.isClient){
        transactionsHandle = Meteor.subscribe('transactions.validator', props.validator, props.delegator, props.limit);
        loading = !transactionsHandle.ready();
    }

    if (Meteor.isServer || !loading){
        transactions = Transactions.find({}, {sort:{height:-1}});

        if (Meteor.isServer){
            loading = false;
            transactionsExist = !!transactions;
        }
        else{
            transactionsExist = !loading && !!transactions;
        }
    }

    return {
        loading,
        transactionsExist,
        transferTxs: transactionsExist ? Transactions.find({
            $or: [
                {"tx.value.msg.type":"nch/MsgSend"},
                {"tx.value.msg.type":"nch/MsgMultiSend"}
            ]
        }).fetch() : {},
        stakingTxs: transactionsExist ? Transactions.find({
            $or: [
                {"tx.value.msg.type":"nch/MsgCreateValidator"},
                {"tx.value.msg.type":"nch/MsgEditValidator"},
                {"tx.value.msg.type":"nch/MsgDelegate"},
                {"tx.value.msg.type":"nch/MsgUndelegate"},
                {"tx.value.msg.type":"nch/MsgBeginRedelegate"}
            ]
        }).fetch() : {},
        distributionTxs: transactionsExist ? Transactions.find({
            $or: [
                {"tx.value.msg.type":"nch/MsgWithdrawValidatorCommission"},
                {"tx.value.msg.type":"nch/MsgWithdrawDelegationReward"},
                {"tx.value.msg.type":"nch/MsgModifyWithdrawAddress"}
            ]
        }).fetch() : {},
        governanceTxs: transactionsExist ? Transactions.find({
            $or: [
                {"tx.value.msg.type":"nch/MsgSubmitProposal"},
                {"tx.value.msg.type":"nch/MsgDeposit"},
                {"tx.value.msg.type":"nch/MsgVote"}
            ]
        }).fetch() : {},
        slashingTxs: transactionsExist ? Transactions.find({
            $or: [
                {"tx.value.msg.type":"nch/MsgUnjail"}
            ]
        }).fetch() : {},
        IBCTxs: transactionsExist ? Transactions.find({
            $or: [
                {"tx.value.msg.type":"nch/IBCTransferMsg"},
                {"tx.value.msg.type":"nch/IBCReceiveMsg"}
            ]
        }).fetch() : {},
        ipalTxs: transactionsExist ? Transactions.find({
            $or: [
                {"tx.value.msg.type":"nch/IPALCLaim"},
                {"tx.value.msg.type":"nch/ServerNodeClaim"}
            ]
        }).fetch() : {}
    };
})(ValidatorTransactions);
