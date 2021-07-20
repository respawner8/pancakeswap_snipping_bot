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

const factory = new ethers.Contract(
    addresses.factory,
    ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
    account 
);

const router = new ethers.Contract(
    addresses.router,
    [
        'function getAmountsOut(unit amountIn, address[] memory path) public views returns (unit[] memory amounts)',
        'function swapExactTokensForTokens(unit amountIn, unit amountOutMin, address calldata path, address to, uint deadline)'
        
    ],
    account
);

const wbnb = new ethers.Contract(
    addresses.WBNB,
    [
      'function approve(address spender, uint amount) public returns(bool)',
    ],
    account
  );
  
  const init = async () => {
    const tx = await wbnb.approve(
      router.address, 
      'replace by amount covering several trades'
    );
    const receipt = await tx.wait(); 
    console.log('Transaction receipt');
    console.log(receipt);
  }

factory.on('PairCreated' , async (token0, token1, pairAddress) => {
    console.log(`
        New Pair Listed :
        token0 : ${token0}
        token1 : ${token1}
        pairAddress : ${pairAddress}
    `);

    if(token0 === addresses.WBNB) {
        tokenIn = token0;
        tokenOut = token1;
    } else if(token1 === addresses.WBNB){
        tokenIn = token1;
        tokenOut = token0;
    } else {
        return;
    }

    const amountIn = ethers.utils.parseUnits('0.1', 'ether');
    const amounts = await router.getAmountsOut(amountIn, [tokenIn , tokenOut]);

    const amountOutMin = amounts[1].sub(amounts[1].div(15));
    console.log(`
        Transaction :
        tokenIn : ${amountIn.toString()} ${tokenIn} (WBNB)
        tokenOut : ${amountOutMin.toString()} ${tokenOut}
    `);

    const tranction = await router.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        [tokenIn , tokenOut],
        addresses.recipient,
        Date.now() + 1000 * 60 * 10
    );

    const receipt = await Text.wait();
    console.log('Transaction receipt');
    console.log(receipt);

});