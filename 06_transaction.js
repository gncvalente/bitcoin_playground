var explorers = require('bitcore-explorers'); delete global._bitcore;
var bitcore = require('bitcore-lib');
var Insight = explorers.Insight;

// Indirizzo sorgente - deterministico - brain wallet
var walletNumero = 1;
var value = new Buffer('casa cane gatto leone tigre' + '__' + walletNumero);

var hash = bitcore.crypto.Hash.sha256(value);
var bn = bitcore.crypto.BN.fromBuffer(hash);

var source = {};
source.privateKey = new bitcore.PrivateKey(bn);
source.publicKey = source.privateKey.toAddress('testnet');

console.log('Indirizzo sorgente ', source.publicKey);
console.log(source.publicKey.toObject());
console.log('');

// Indirizzo destinazione 
var dest = {};
dest.privateKey = new bitcore.PrivateKey();
dest.publicKey= dest.privateKey.toAddress('testnet');

console.log('Indirizzo destinazione ', dest.publicKey);
console.log(dest.publicKey.toObject());
console.log('');

// Ora andiamo a trovare un output di transazione non speso
var insight = new Insight('testnet');
insight.getUnspentUtxos(source.publicKey, function(err, utxos){
	if(err){
		console.log(err);
	}else{
		// console.log('ecco un\'output di transazione non speso: ', utxos);
		var tx = bitcore.Transaction();
		tx.from(utxos);
		tx.to(dest.publicKey, 500000);
		// daro' 50000 satoshi al miner che inserira' nel blocco 
		// la mia transazione :)
		tx.fee(50000);	
		// il resto mettilo sempre nel mio wallet sorgente :)
		tx.change(source.publicKey);
		// segno questa transazione con la mia chiave privata
		// si sono io che voglio inviare questi satoshi :)
		tx.sign(source.privateKey);

		// console.log('questa e\' la transazione', tx.toObject());
		tx.serialize(); 

		var scriptIn = bitcore.Script(tx.toObject().inputs[0].script);
		console.log('input scripting: ', scriptIn);

		var scriptOut = bitcore.Script(tx.toObject().outputs[0].script);
		console.log('\noutput scripting 0 : ', scriptOut);

		var scriptOut = bitcore.Script(tx.toObject().outputs[1].script);
		console.log('output scripting 1 : ', scriptOut);

		console.log('\n\nqui per piu\' info:', 'https://en.bitcoin.it/wiki/Script');

		// invio al network la transazione
		// insight.broadcast(tx.toString(), function(err, returnedTxId){
		// 	if(err){
		// 		console.log(err);
		// 	}else{
		// 		console.log(
		// 			'transazione inviata, ecco l\'Id Transazione: ', 
		// 			returnedTxId);
		// 	}
		// });
	}
});