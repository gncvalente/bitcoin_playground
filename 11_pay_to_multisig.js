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
console.log('');

// Indirizzi destinazione multisig
// https://github.com/bitpay/bitcore-lib/blob/master/docs/examples.md#import-an-address-via-wif
// https://www.bitaddress.org/  // ?testnet=true

var address_pippo = new bitcore.PrivateKey('cPWLZe8vFZDoNmWjE4Fz3WGKeGB2Pn681q1ixqLqJ7cB61VZ64sv');
var address_peppino = new bitcore.PrivateKey('cQXHJNtC9STmAuG6ttwjgmLyUjVWjibG7LPV1aJSbSUupAphgqQ8');
var address_cappuccio = new bitcore.PrivateKey('cPqgwLiLCk2yKW7Zr76ytkyHMLe2ABEApvs374y85qZxngMMnCy7');

var dest_pubkeys = [
	new bitcore.PublicKey(address_pippo) ,
	new bitcore.PublicKey(address_peppino),
	new bitcore.PublicKey(address_cappuccio),
];

dest_pubkeys.sort();

console.log('Indirizzi destinazione ');
console.log(dest_pubkeys[0]);
console.log(dest_pubkeys[1]);
console.log(dest_pubkeys[2]);
console.log('');

// script multi sig
var threshold = 2;
var script = new bitcore.Script.buildMultisigOut(dest_pubkeys, threshold);
var dest_address = new bitcore.Address(dest_pubkeys, threshold);

console.log('Script Multisig ');
console.log(script.toString(), '\n');


// Ora andiamo a trovare un output di transazione non speso
var insight = new Insight('testnet');
insight.getUnspentUtxos(source.publicKey, function(err, utxos){
	if(err){
		console.log(err);
	}else{
		// console.log('ecco un\'output di transazione non speso: ', utxos);
		var tx = bitcore.Transaction();
		tx.from(utxos);
		// tx.addOutput(
		// 	new bitcore.Transaction.Output({
		// 	script: script,
		// 	satoshis: 200000
		//   })
		// );
		tx.to(dest_address, 500000);
		
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