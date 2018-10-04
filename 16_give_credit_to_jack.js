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
var wif_private_keys = require('./WIF_private_keys.js');
var address_jack = new bitcore.PrivateKey.fromWIF(wif_private_keys.jack);

dest_public_key= address_jack.toAddress('testnet');

console.log('Indirizzo destinazione ', dest_public_key);


// Ora andiamo a trovare un output di transazione non speso
var insight = new Insight('testnet');
insight.getUnspentUtxos(source.publicKey, function(err, utxos){
	if(err){
		console.log(err);
	}else{
		// console.log('ecco un\'output di transazione non speso: ', utxos);
		var tx = bitcore.Transaction();
		tx.from(utxos);
		tx.to(dest_public_key, 900000);
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

		// invio al network la transazione
		insight.broadcast(tx.toString(), function(err, returnedTxId){
			if(err){
				console.log(err);
			}else{
				console.log(
					'transazione inviata, ecco l\'Id Transazione: ', 
					returnedTxId);
			}
		});
	}
});