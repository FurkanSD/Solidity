const Flashloan = artifacts.require("Flashloan.sol");
const IERC20 = artifacts.require("IERC20")
const BN = require("bn.js")
const Vault = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";
const Dai = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const amount = web3.utils.toBN(Math.pow(10,18));

contract("FlashLoan test", () => {

    it("test", async () => {
        const flash = await Flashloan.new(Vault);
        const ierc = await IERC20.at(Dai);

        let bal = await ierc.balanceOf(flash.address);
        console.log(`Dai balance before flashloan :${bal}`)

        const event = await flash.flashLoan([Dai],[amount]);
        
        const Event = event.logs[0].args;

        console.log(`Dai balance after flashloan :${Event.amount}`);

        
    })
})
