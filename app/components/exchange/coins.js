// Wallet = true : Local
//        = false : Remote 

module.exports = [
	{ value: 'LUX', label: 'Luxcoin', image: require('../../assets/crypto/LUX.png'), active: 'active', wallet: true, IsOnlyLocal : true },
	{ value: 'BTC', label: 'Bitcoin', image: require('../../assets/crypto/BTC.png'), active: 'inactive', wallet: false, IsOnlyLocal : false },
	{ value: 'ETH', label: 'Ethereum', image: require('../../assets/crypto/ETH.png'), active: 'inactive', wallet: true, IsOnlyLocal : true },
];
