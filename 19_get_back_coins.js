var explorers = require('bitcore-explorers'); delete global._bitcore;
var bitcore = require('bitcore-lib');
var Insight = explorers.Insight;
var sleep = require('sleep');

bitcore.Networks.defaultNetwork = bitcore.Networks.livenet;

var wif_private_keys = require('./WIF_private_keys.js');
var address_jack = new bitcore.PrivateKey.fromWIF(wif_private_keys.jack);
var address_bob = new bitcore.PrivateKey.fromWIF(wif_private_keys.bob);
var address_jack_tresure = new bitcore.PrivateKey.fromWIF(wif_private_keys.jack_tresure);

var destination = '13pF2eXGGE1UC9rxMrcNK4JWKmjMfLnYGa';

// Ora andiamo a trovare un output di transazione non speso
var insight = new Insight();

function sendAllTo(fromPrivK, toPubKey){
	var fromPubKey = fromPrivK.toAddress();
	insight.getUnspentUtxos(fromPubKey, function(err, utxos){
		if(err){
			console.log(err);
		}else{
			console.log(utxos);
		}
	});
}

sendAllTo(address_jack, destination);
sendAllTo(address_bob, destination);
sendAllTo(address_jack_tresure, destination);
