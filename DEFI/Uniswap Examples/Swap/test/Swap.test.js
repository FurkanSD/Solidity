const Swap = artifacts.require("Swap");
const IERC20 = artifacts.require("IERC20");

const Dai = "0x6b175474e89094c44da98b954eedeac495271d0f";
const Weth = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const DaiWhale = "0xF39d30Fa570db7940e5b3A3e42694665A1449E4B";

const Amount = web3.utils.toBN(Math.pow(10,18));

contract("Swap test", (accounts) => {
    let swap,daiToken,wethToken

    beforeEach(async () => {
        swap =  await Swap.new();
        daiToken = await IERC20.at(Dai);
        wethToken = await IERC20.at(Weth);
        await web3.eth.sendTransaction({from: accounts[0],to:swap.address,value: web3.utils.toWei("1","ether")});
    })
    it("swap token for token", async () => {
    
        await daiToken.transfer(swap.address,Amount,{from:DaiWhale});

        let wethBalance = await wethToken.balanceOf(swap.address);
        let daiBalance = await daiToken.balanceOf(swap.address);
        
        console.log(`Dai balance before swap :${daiBalance}`);
        console.log(`Weth balance before swap : ${wethBalance}`);

        await swap.swapTokenForToken(
            Amount,
            0,
            [Dai,Weth]
        );

        wethBalance = await wethToken.balanceOf(swap.address);
        daiBalance = await daiToken.balanceOf(swap.address);
        
        console.log(`Dai balance after swap ${daiBalance}`);
        console.log(`Weth balance after swap : ${wethBalance}`);
    })

    it("swap eth for token", async () => {

        let daiBalance = await daiToken.balanceOf(swap.address);
        let ethBalance = await web3.eth.getBalance(swap.address);

        console.log(`Dai balance before swap : ${daiBalance}`);
        console.log(`Eth balance before swap : ${ethBalance}`);

        await swap.swapEthForToken(Amount,0,[Weth,Dai]);

        daiBalance = await daiToken.balanceOf(swap.address);
        ethBalance = await web3.eth.getBalance(swap.address);

        console.log(`Dai balance after swap : ${daiBalance}`);
        console.log(`Eth balance before swap : ${ethBalance}`);

    })

    it("swap token for Eth", async () => {
        await daiToken.transfer(swap.address,Amount,{from:DaiWhale});

        let daiBalance = await daiToken.balanceOf(swap.address);
        let ethBalance = await web3.eth.getBalance(swap.address);

        console.log(`Dai balance before swap : ${daiBalance}`);
        console.log(`Eth balance before swap : ${ethBalance}`);

        await swap.swapTokenForEth(daiBalance,0,[Dai,Weth]);

        daiBalance = await daiToken.balanceOf(swap.address);
        ethBalance = await web3.eth.getBalance(swap.address);

        console.log(`Dai balance after swap : ${daiBalance}`);
        console.log(`Eth balance after swap : ${ethBalance}`);


    })
})
