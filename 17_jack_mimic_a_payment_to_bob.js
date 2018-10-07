var explorers = require('bitcore-explorers'); delete global._bitcore;
var bitcore = require('bitcore-lib');
var Insight = explorers.Insight;
var sleep = require('sleep');

bitcore.Networks.defaultNetwork = bitcore.Networks.livenet;

var wif_private_keys = require('./WIF_private_keys.js');
var address_jack = new bitcore.PrivateKey.fromWIF(wif_private_keys.jack);
var address_bob = new bitcore.PrivateKey.fromWIF(wif_private_keys.bob);
var address_jack_tresure = new bitcore.PrivateKey.fromWIF(wif_private_keys.jack_tresure);


src_public_key= address_jack.toAddress();
dst_public_key= address_bob.toAddress();
ack_tresure_public_key= address_jack_tresure.toAddress();

console.log('Indirizzo pubblico di Bob ', dst_public_key);
console.log('Indirizzo pubblico del tesoro di jack ', ack_tresure_public_key);

process.exit();


// Ora andiamo a trovare un output di transazione non speso
var insight = new Insight();

insight.getUnspentUtxos(src_public_key, function(err, utxos){
	if(err){
		console.log(err);
	}else{
		// console.log('ecco un\'output di transazione non speso: ', utxos);
		var tx = bitcore.Transaction();
		tx.from(utxos);
		tx.to(dst_public_key, 10000);
		// daro' 50000 satoshi al miner che inserira' nel blocco 
		// la mia transazione :)
		tx.fee(6514);	
		// il resto mettilo sempre nel mio wallet sorgente :)
		tx.change(src_public_key);
		// segno questa transazione con la mia chiave privata
		// si sono io che voglio inviare questi satoshi :)
		tx.sign(address_jack);

		// console.log('questa e\' la transazione', tx.toObject());
		tx.serialize(); 

		var tx2 = bitcore.Transaction();
		tx2.from(utxos);
		tx2.to(ack_tresure_public_key, 10000);
		// daro' 50000 satoshi al miner che inserira' nel blocco 
		// la mia transazione :)
		tx2.fee(20000);	
		// il resto mettilo sempre nel mio wallet sorgente :)
		tx2.change(src_public_key);
		// segno questa transazione con la mia chiave privata
		// si sono io che voglio inviare questi satoshi :)
		tx2.sign(address_jack);

		// console.log('questa e\' la transazione', tx.toObject());
		tx2.serialize(); 

		console.log('questa e\' la transazione numero due', tx2.toString());

		sleep.sleep(30);

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