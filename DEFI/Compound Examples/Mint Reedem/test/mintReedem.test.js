const { assert } = require("chai");
const MintReedem = artifacts.require("mintReedem");
const IERC20 = artifacts.require("IERC20");
const {time} = require("@openzeppelin/test-helpers")
const cDai = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643";
const Dai = "0x6b175474e89094c44da98b954eedeac495271d0f";
const Dai_Whale = "0xD624790fC3E318Ce86f509Ecf69DF440B3fc328D";

contract("cToken test", (accounts) => {

    it("should mint-redeem", async () => {
        const amount = web3.utils.toBN(Math.pow(10,18));

        const mintReedem = await MintReedem.new(Dai,cDai);
        const dai = await IERC20.at(Dai);

        await dai.transfer(mintReedem.address,amount,{from: Dai_Whale});

        let balance = await dai.balanceOf(mintReedem.address);
        console.log(`Dai balance before mint: ${balance}`);
        
        let cBalance = await mintReedem.balance(mintReedem.address); 
        console.log(`cDai balance before mint: ${cBalance}`); 
        console.log("-------------------------------------------");

        await mintReedem.mint(amount);

        balance = await dai.balanceOf(mintReedem.address);
        console.log(`Dai balance after mint: ${balance}`); 

        cBalance = await mintReedem.balance(mintReedem.address); 
        console.log(`cDai balance after mint: ${cBalance}`); 
        console.log("-------------------------------------------");

        await time.increase(time.duration.years(1)); 

        assert.notEqual(cBalance,0);

        await mintReedem.redeem(cBalance);

        balance = await dai.balanceOf(mintReedem.address);
        console.log(`Dai balance after redeem: ${balance}`); 

        cBalance = await mintReedem.balance(mintReedem.address); 
        console.log(`cDai balance after redeem: ${cBalance}`);

        assert.equal(cBalance,0);
        assert.notEqual(balance,0);
    })
    
})
