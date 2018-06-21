var explorers = require('bitcore-explorers'); delete global._bitcore;
var bitcore = require('bitcore-lib');
var Insight = explorers.Insight;

var walletNumero = 1;
var value = new Buffer('casa cane gatto leone tigre' + '__' + walletNumero);

var hash = bitcore.crypto.Hash.sha256(value);
var bn = bitcore.crypto.BN.fromBuffer(hash);

var address = new bitcore.PrivateKey(bn).toAddress('testnet');

// Ora andiamo a trovare le unspent transaction outputs
var insight = new Insight('testnet');
insight.getUnspentUtxos(address, function(err, utxos){
	if(err){

	}else{
		console.log(utxos);
	}
});