var explorers = require('bitcore-explorers'); delete global._bitcore;
var bitcore = require('bitcore-lib');

// Indirizzi destinazione multisig
// https://github.com/bitpay/bitcore-lib/blob/master/docs/examples.md#import-an-address-via-wif
// https://www.bitaddress.org/   // ?testnet=true

var wif_private_keys = require('./WIF_private_keys.js');
var address_pippo = new bitcore.PrivateKey(wif_private_keys.pippo);
var address_peppino = new bitcore.PrivateKey(wif_private_keys.peppino);
var address_cappuccio = new bitcore.PrivateKey(wif_private_keys.cappuccio);

var dest_pubkeys = [
	new bitcore.PublicKey(address_pippo) ,
	new bitcore.PublicKey(address_peppino),
	new bitcore.PublicKey(address_cappuccio),
];

console.log('Indirizzi destinazione ');
console.log(dest_pubkeys[0]);
console.log(dest_pubkeys[1]);
console.log(dest_pubkeys[2]);
console.log('');

// script multi sig
var threshold = 2;
var script = new bitcore.Script.buildMultisigOut(dest_pubkeys, threshold);

console.log('Script Multisig ');
console.log(script.toString(), '\n');
