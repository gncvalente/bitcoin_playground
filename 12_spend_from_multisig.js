var explorers = require('bitcore-explorers'); delete global._bitcore;
var bitcore = require('bitcore-lib');
var Insight = explorers.Insight;

// Indirizzi destinazione multisig
// https://github.com/bitpay/bitcore-lib/blob/master/docs/examples.md#import-an-address-via-wif
// https://www.bitaddress.org/

var wif_private_keys = require('./WIF_private_keys.js');
var address_pippo = new bitcore.PrivateKey.fromWIF(wif_private_keys.pippo);
var address_peppino = new bitcore.PrivateKey.fromWIF(wif_private_keys.peppino);
var address_cappuccio = new bitcore.PrivateKey.fromWIF(wif_private_keys.cappuccio);

// Ora andiamo a trovare un output di transazione non speso
var insight = new Insight('testnet');

var dest_pubkeys = [
	new bitcore.PublicKey(address_pippo) ,
	new bitcore.PublicKey(address_peppino),
	new bitcore.PublicKey(address_cappuccio),
];

dest_pubkeys.sort();

// script multi sig
var threshold = 2;
var dest_address = new bitcore.Address(dest_pubkeys, threshold, bitcore.Networks.testnet);

console.log(dest_address);

// var dest_address = new bitcore.Address('2MsbGVmhXPV8PoQAamPJoX3Rk9pJXHVwpAU',  bitcore.Networks.testnet);
// console.log(dest_address);

insight.getUnspentUtxos(dest_address, function(err, utxos){
	if(err){
		console.log(err);
	}else{
		console.log(utxos);

		if (utxos.length == 0 ){
			console.log('non trovo l\'output non speso');
			process.exit();
		}

		// process.exit();

		var destinatario = new bitcore.PublicKey(
			new bitcore.PrivateKey('cVP9B7dy6czMRTQjc3StZj4omUW4Bncrg83R2CPuXv6nWr2aeZr3')
		);
		
		var tx = new bitcore.Transaction();
		tx.from(utxos[0], dest_pubkeys, 2);
		tx.to(destinatario, 450000);

		var privateKeys = [
			address_pippo,
			address_peppino,
			// address_cappuccio
		];
		
		// privateKeys.sort();

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



