// use ganache-cli mainnet_fork
const Flashloan = artifacts.require("Flashloan.sol");
const IERC20 = artifacts.require("IERC20")
const ENJ = "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c";
const LendingPool = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";
const ENJ_Whale = "0x91d05F4004F5008eA7C54930c4D315723B325187";
const amount = web3.utils.toWei("1","ether");
const amount2 = web3.utils.toWei("1000","ether");

contract("FlashLoanTest", () => {

    it("test", async () => {
        const flash = await Flashloan.new(LendingPool);
        const ierc = await IERC20.at(ENJ);

        // transfer token to contract to repay fee
        await ierc.transfer(flash.address,amount,{from: ENJ_Whale});

        const asset = [ENJ]
        const amoun = [amount2]
        await flash.flashLoan(asset,amoun);   
        
    })
})
