var explorers = require('bitcore-explorers'); delete global._bitcore;
var bitcore = require('bitcore-lib');
var Insight = explorers.Insight;

// Indirizzo destinazione 
var wif_private_keys = require('./WIF_private_keys.js');
var address_jack = new bitcore.PrivateKey.fromWIF(wif_private_keys.jack);

dest_public_key= address_jack.toAddress();

console.log('Indirizzo destinazione ', dest_public_key);

