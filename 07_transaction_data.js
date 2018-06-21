var explorers = require('bitcore-explorers'); delete global._bitcore;
var bitcore = require('bitcore-lib');
var Insight = explorers.Insight;

// Indirizzo destinazione 
var dest = {};
dest.privateKey = new bitcore.PrivateKey();
dest.publicKey= dest.privateKey.toAddress('testnet');

console.log('Indirizzo destinazione ', dest.publicKey);

// Indirizzo sorgente - deterministico - brain wallet
var walletNumero = 1;
var value = new Buffer('casa cane gatto leone tigre' + '__' + walletNumero);

var hash = bitcore.crypto.Hash.sha256(value);
var bn = bitcore.crypto.BN.fromBuffer(hash);

var source = {};
source.privateKey = new bitcore.PrivateKey(bn);
source.publicKey = source.privateKey.toAddress('testnet');

// Ora andiamo a trovare un output di transazione non speso
var insight = new Insight('testnet');
insight.getUnspentUtxos(source.publicKey, function(err, utxos){
	if(err){
		console.log(err);
	}else{
		// console.log('ecco un\'output di transazione non speso: ', utxos);
		var tx = bitcore.Transaction();
		tx.from(utxos);
		// daro' 50000 satoshi al miner che inserira' nel blocco 
		// la mia transazione :)
		tx.fee(50000);	
		
		tx.addData("CIAO GIANCARLO E' STATO QUI!");

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
		console.log('output scripting: ', scriptOut);

		// console.log('dest.publicKey', dest.publicKey);
		// console.log('source.publicKey', source.publicKey);

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