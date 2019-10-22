import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Blockscon } from '/imports/api/blocks/blocks.js';
import { Transactions } from '/imports/api/transactions/transactions.js';
import Block from './Block.jsx';

export default BlockContainer = withTracker((props) => {
    let blockHandle, transactionHandle;
    let loading = true;

    if (Meteor.isClient){
        blockHandle = Meteor.subscribe('blocks.findOne', parseInt(props.match.params.blockId));
        transactionHandle = Meteor.subscribe('transactions.height', parseInt(props.match.params.blockId));
        loading = !blockHandle.ready() && !transactionHandle.ready();    
    }

    let block, txs, transactionsExist, blockExist;

    if (Meteor.isServer || !loading){
        block = Blockscon.findOne({height: parseInt(props.match.params.blockId)});
        txs = Transactions.find({height:parseInt(props.match.params.blockId)});

        if (Meteor.isServer){
            loading = false;
            transactionsExist = !!txs;
            blockExist = !!block;
        }
        else{
            transactionsExist = !loading && !!txs;
            blockExist = !loading && !!block;
        }
        
    }

    return {
        loading,
        blockExist,
        transactionsExist,
        block: blockExist ? block : {},
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
                {"tx.value.msg.type":"nch/IPALCLaim"}
            ]
        }).fetch() : {},
    };
})(Block);