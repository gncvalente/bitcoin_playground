var explorers = require('bitcore-explorers'); delete global._bitcore;
var bitcore = require('bitcore-lib');
var Insight = explorers.Insight;

// Indirizzi destinazione multisig
// https://github.com/bitpay/bitcore-lib/blob/master/docs/examples.md#import-an-address-via-wif
// https://www.bitaddress.org/

var address_pippo = new bitcore.PrivateKey('cPWLZe8vFZDoNmWjE4Fz3WGKeGB2Pn681q1ixqLqJ7cB61VZ64sv');
var address_peppino = new bitcore.PrivateKey('cQXHJNtC9STmAuG6ttwjgmLyUjVWjibG7LPV1aJSbSUupAphgqQ8');
var address_cappuccio = new bitcore.PrivateKey('cPqgwLiLCk2yKW7Zr76ytkyHMLe2ABEApvs374y85qZxngMMnCy7');

var privateKeys = [
	address_pippo,
	address_peppino,
	// address_cappuccio
];

privateKeys.sort();

var publicKeys = privateKeys.map(bitcore.PublicKey);

publicKeys.sort();

var address = new bitcore.Address(publicKeys, 2); // 2 of 2

// Ora andiamo a trovare un output di transazione non speso
var insight = new Insight('testnet');


// Devo recuperare l'indirizzo di destinazione per avere i utxos
var dest_pubkeys = [
	new bitcore.PublicKey(address_pippo) ,
	new bitcore.PublicKey(address_peppino),
	new bitcore.PublicKey(address_cappuccio),
];

dest_pubkeys.sort();

var dest_address = new bitcore.Address(dest_pubkeys, 2);


insight.getUnspentUtxos(dest_address, function(err, utxos){
	if(err){
		console.log(err);
	}else{
		console.log(utxos);

		// process.exit();

		var destinatario = new bitcore.PublicKey(
			new bitcore.PrivateKey('cVP9B7dy6czMRTQjc3StZj4omUW4Bncrg83R2CPuXv6nWr2aeZr3')
		);
		
		var tx = new bitcore.Transaction();
		tx.from(utxos[0], dest_pubkeys, 2);
		tx.to(destinatario, 450000);
		tx.sign(privateKeys);
		
		tx.serialize(); 

		var scriptIn = bitcore.Script(tx.toObject().inputs[0].script);
		console.log('input scripting: ', scriptIn);

		var scriptOut = bitcore.Script(tx.toObject().outputs[0].script);
		console.log('\noutput scripting 0 : ', scriptOut);

		// process.exit();

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



