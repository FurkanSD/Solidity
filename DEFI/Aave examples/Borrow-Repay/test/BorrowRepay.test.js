// use ganache-cli mainnet_fork
const BorrowRepay = artifacts.require("BorrowRepay");
const IERC20 = artifacts.require("IERC20");
const {time} = require("@openzeppelin/test-helpers");
const LendingPool = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";
const aENJ = "0xaC6Df26a590F08dcC95D5a4705ae8abbc88509Ef";
const ENJ = "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c";
const ENJ_Whale = "0x91d05F4004F5008eA7C54930c4D315723B325187";
const amount = web3.utils.toBN(Math.pow(10,18));
const amount2 = web3.utils.toBN(Math.pow(10,19));

contract("BorrowRepay test", () => {    

    it("borrow repay", async () => {

        const borrowRepay  = await BorrowRepay.new(LendingPool);

        const ierc = await IERC20.at(ENJ);

        const aIerc = await IERC20.at(aENJ);

        await ierc.transfer(borrowRepay.address,amount2,{from: ENJ_Whale});

        await borrowRepay.deposit(ENJ,amount2); 

        let aTokenBalance = await aIerc.balanceOf(borrowRepay.address);

        let tokenBalance = await ierc.balanceOf(borrowRepay.address);

        console.log(`aENJ balance before borrow :${aTokenBalance}`);


        console.log(`ENJ balance before borrow :${tokenBalance}`)

        console.log("-------------------------------------")

        await borrowRepay.borrow(ENJ,amount,2,0);

        tokenBalance = await ierc.balanceOf(borrowRepay.address);

        aTokenBalance = await aIerc.balanceOf(borrowRepay.address);

        console.log(`aENJ balance after borrow :${aTokenBalance}`);

        console.log(`ENJ balance before borrow :${tokenBalance}`)

        await time.increase(time.duration.years(1));

        console.log("-------------------------------------")

        await borrowRepay.repay(ENJ,amount,2);

        tokenBalance = await ierc.balanceOf(borrowRepay.address);

        aTokenBalance = await aIerc.balanceOf(borrowRepay.address);

        console.log(`aENJ balance after repay :${aTokenBalance}`);

        console.log(`ENJ balance after repay :${tokenBalance}`)
    })
})
