// Wallet = true : Local
//        = false : Remote 

module.exports = [
	{ value: 'LUX', label: 'Luxcoin', image: require('../../assets/crypto/LUX.png'), active: true, wallet: true, IsOnlyLocal : true },
	{ value: 'BTC', label: 'Bitcoin', image: require('../../assets/crypto/BTC.png'), active: false, wallet: false, IsOnlyLocal : false },
	{ value: 'ETH', label: 'Ethereum', image: require('../../assets/crypto/ETH.png'), active: false, wallet: true, IsOnlyLocal : true },
];
