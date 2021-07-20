const ethers = require('ethers');

const addresses = {
    WBNB : '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    factory : '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    router : '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    recipient : ''
}

const mnemonic = '';

const provider = new ethers.providers.WebSocketProvider('websocket url to mainnet here');
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const account = wallet.connect(provider);