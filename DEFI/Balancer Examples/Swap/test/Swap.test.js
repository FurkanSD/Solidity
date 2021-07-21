// use ganache-cli for mainnet_fork
const Swap = artifacts.require("Swap");
const IERC = artifacts.require("IERC20");
const BN = require("bn.js");
const Amount = new BN(Math.pow(20,10))
const id = "0x0b09dea16768f0799065c475be02919503cb2a3500020000000000000000001a"
const vault = "0xBA12222222228d8Ba445958a75a0704d566BF2C8"
const Whale = "0x61a6B1EdA7E514d4d6259AA11Fd227118386eD84"
const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
const Dai = "0x6b175474e89094c44da98b954eedeac495271d0f"

const SwapKind = { GIVEN_IN : 0, GIVEN_OUT:1 }

contract("Swap test",  () => {

    it("Swap test", async () => {
        const swap = await Swap.new(vault);
        const weth = await IERC.at(WETH);
        const dai = await IERC.at(Dai);

        await dai.transfer(swap.address,Amount,{from: Whale});
        
        let daiBalance = await dai.balanceOf(swap.address);
        let wethBalance = await weth.balanceOf(swap.address);

        console.log(`Dai balance before swap :${daiBalance}`);
        console.log(`WETH balance before swap :${wethBalance}`);

        await swap.swap(id,SwapKind.GIVEN_IN,Dai,WETH,Amount,0);

        daiBalance = await dai.balanceOf(swap.address);
        wethBalance = await weth.balanceOf(swap.address);

        console.log(`Dai balance after swap :${daiBalance}`);
        console.log(`WETH balance after swap :${wethBalance}`);

 
    })
})
