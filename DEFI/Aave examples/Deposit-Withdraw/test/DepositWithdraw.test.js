// use ganache-cli mainnet_fork
const DepositWithdraw = artifacts.require("DepositWithdraw");
const IERC20 = artifacts.require("IERC20");
const {time} = require("@openzeppelin/test-helpers");
const LendingPool = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";
const ENJ = "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c";
const aENJ = "0xaC6Df26a590F08dcC95D5a4705ae8abbc88509Ef";
const ENJ_Whale = "0x91d05F4004F5008eA7C54930c4D315723B325187";
const amount = web3.utils.toBN(Math.pow(10,18));


contract("DepositBorrow test", () => {    

    it("deposite borrow", async () => {

        const depositWithdraw  = await DepositWithdraw.new(LendingPool,ENJ);

        const Ierc = await IERC20.at(ENJ);

        const aIerc = await IERC20.at(aENJ);

        await Ierc.transfer(depositWithdraw.address,amount,{from: ENJ_Whale}); // first send token to contract

        let balanceAToken = await aIerc.balanceOf(depositWithdraw.address);  

        let balanceToken = await Ierc.balanceOf(depositWithdraw.address);

        console.log(`ENJ balance before deposit: ${balanceToken}`);

        console.log(`aENJ balance before deposit: ${balanceAToken}`);

        console.log("----------------------------------")

        await depositWithdraw.deposit(ENJ,amount);

        balanceToken = await Ierc.balanceOf(depositWithdraw.address);

        balanceAToken = await aIerc.balanceOf(depositWithdraw.address);

        console.log(`ENJ balance after deposit: ${balanceToken}`); 

        console.log(`aENJ balance after deposit: ${balanceAToken}`);

        await time.increase(time.duration.years(1));

        await depositWithdraw.withdraw(ENJ);

        balanceToken = await Ierc.balanceOf(depositWithdraw.address);

        balanceAToken = await aIerc.balanceOf(depositWithdraw.address);

        console.log("----------1 year later------------")

        console.log(`ENJ balance after withdraw: ${balanceToken}`);

        console.log(`aENJ balance after withdraw: ${balanceAToken}`);
    })
})
