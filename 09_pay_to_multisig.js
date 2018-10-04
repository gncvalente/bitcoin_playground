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
// https://www.bitaddress.org/   // ?testnet=true

var address_pippo = new bitcore.PrivateKey('cPWLZe8vFZDoNmWjE4Fz3WGKeGB2Pn681q1ixqLqJ7cB61VZ64sv');
var address_peppino = new bitcore.PrivateKey('cQXHJNtC9STmAuG6ttwjgmLyUjVWjibG7LPV1aJSbSUupAphgqQ8');
var address_cappuccio = new bitcore.PrivateKey('cPqgwLiLCk2yKW7Zr76ytkyHMLe2ABEApvs374y85qZxngMMnCy7');

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
