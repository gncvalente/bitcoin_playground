var bitcore = require('bitcore-lib');

// bitcore.Networks.livenet | bitcore.Networks.testnet
bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;

// Simple new address
var privateKey = new bitcore.PrivateKey();
var address = privateKey.toAddress('testnet');

console.log('New Address 1: ', address);

