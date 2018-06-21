var bitcore = require('bitcore-lib');

// Simple new address
var privateKey = new bitcore.PrivateKey();
var address = privateKey.toAddress('testnet');

console.log('New Address 1: ', address);

// New address based on 5 words
var walletNumero = 1;
var value = new Buffer('casa cane gatto leone tigre' + '__' + walletNumero);

var hash = bitcore.crypto.Hash.sha256(value);
var bn = bitcore.crypto.BN.fromBuffer(hash);

var address = new bitcore.PrivateKey(bn).toAddress('testnet');
console.log('New Address 2: ', address);
