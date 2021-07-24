const BorrowRepay = artifacts.require("BorrowRepay");
const IERC20 = artifacts.require("IERC20");
const { assert } = require("chai");
const {time} = require("@openzeppelin/test-helpers")
const Whale = "0x1C17622cfa9B6fD2043A76DfC39A5B5a109aa708";
const cBat = "0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e";
const Bat = "0x0d8775f648430679a709e98d2b0cb6250d2887ef";

contract("borrowRepay test", () => {
    
    it("borrow-repay", async () => {
      
        const AmountMint = web3.utils.toBN(Math.pow(10,20));
        const AmountBorrow = web3.utils.toBN(Math.pow(10,19));
        
        const borrowRepay = await BorrowRepay.new(Bat,cBat);
        const ierc = await IERC20.at(Bat);

        await ierc.transfer(borrowRepay.address,AmountMint,{from: Whale});

        await borrowRepay.mint(AmountMint);

        let balance = await ierc.balanceOf(borrowRepay.address);
        console.log(`Bat balance before borrow: ${balance}`);
        console.log("-------------------------------------");
        assert.equal(balance,0);

        await borrowRepay.borrow(AmountBorrow);
   
        balance = await ierc.balanceOf(borrowRepay.address);
        console.log(`Bat balance after borrow: ${balance}`);
        console.log("-------------------------------------");
        assert.equal(balance,AmountBorrow.toString());

        await time.increase(time.duration.years(2));

        await borrowRepay.repayBorrow(AmountBorrow);

        balance = await ierc.balanceOf(borrowRepay.address);
        console.log(`Bat balance after repay: ${balance}`);
        assert.equal(balance,0);

    })
    
})
