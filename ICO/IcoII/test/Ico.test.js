const Ico = artifacts.require("Ico");
const Dai = artifacts.require("Dai");
const TokenA = artifacts.require("TokenA");
const TokenB = artifacts.require("TokenB");
const { assert } = require("chai");
const {time} = require("@openzeppelin/test-helpers");
require("chai").use(require("chai-as-promised")).should();

contract("ico test", ([owner,tokenAOwner,tokenBOwner,person1,person2]) => {
    let ico,dai,tokenA,tokenB;
    beforeEach(async () => {
        dai = await Dai.deployed();
        ico = await Ico.deployed();
        tokenA = await TokenA.deployed();
        tokenB = await TokenB.deployed();
    })

    it("should whitelist address", async () => {
        await ico.whiteListAddress(tokenAOwner,{from:owner});
        await ico.whiteListAddress(tokenBOwner,{from:owner});
    })

    it("should not whitlist address from non-admin account", async () => {
        await ico.whiteListAddress(person1,{from: tokenAOwner}).should.rejected;
    })

    it("should add token", async () => {

        
        await tokenA.approve(ico.address,web3.utils.toWei("10","ether"),{from:tokenAOwner});
        
        await ico.addToken(
            tokenAOwner,
            tokenA.address,
            web3.utils.toWei("10","ether"),
            web3.utils.toWei("4","ether"),
            web3.utils.toWei("2","ether"),
            web3.utils.toWei("1","ether"),
            1627759842,
            86400,
            {from: tokenAOwner}
        )

        await tokenB.approve(ico.address,web3.utils.toWei("20","ether"),{from:tokenBOwner});

        await ico.addToken(
            tokenBOwner,
            tokenB.address,
            web3.utils.toWei("20","ether"),
            web3.utils.toWei("7","ether"),
            web3.utils.toWei("2","ether"),
            web3.utils.toWei("1","ether"),
            1627759842,
            86400,
            {from: tokenBOwner}
        )
    })

    it("should not add tokens twice from same account", async () => {
        await tokenA.approve(ico.address,web3.utils.toWei("10","ether"),{from:tokenAOwner});
        
        await ico.addToken(
            tokenAOwner,
            tokenA.address,
            web3.utils.toWei("10","ether"),
            web3.utils.toWei("4","ether"),
            web3.utils.toWei("2","ether"),
            web3.utils.toWei("1","ether"),
            1627648312,
            86400,
            {from: tokenAOwner}
        ).should.rejected

        await tokenB.approve(ico.address,web3.utils.toWei("20","ether"),{from:tokenBOwner});

        await ico.addToken(
            tokenBOwner,
            tokenB.address,
            web3.utils.toWei("20","ether"),
            web3.utils.toWei("7","ether"),
            web3.utils.toWei("2","ether"),
            web3.utils.toWei("1","ether"),
            1627490501,
            86400,
            {from: tokenBOwner}
        ).should.rejected;   

    })

    it("should not add tokens from non whitelisted address", async () => {
        await ico.addToken(
            tokenBOwner,
            tokenB.address,
            web3.utils.toWei("20","ether"),
            web3.utils.toWei("7","ether"),
            web3.utils.toWei("2","ether"),
            web3.utils.toWei("1","ether"),
            1627490501,
            86400,
            {from: person1}
        ).should.rejected;   
    })

    it("should not add token if token is not approved", async () => {
        await ico.whiteListAddress(person1,{from:owner})

        await ico.addToken(
            person1,
            tokenB.address,
            web3.utils.toWei("20","ether"),
            web3.utils.toWei("7","ether"),
            web3.utils.toWei("2","ether"),
            web3.utils.toWei("1","ether"),
            1627490501,
            86400,
            {from: person1}
        ).should.rejected;   
    })

    it("shoul not buy token before start time", async () => {
        await dai.approve(ico.address,web3.utils.toWei("3","ether"),{from: person2});

        await ico.buyToken(
            tokenA.address,
            web3.utils.toWei("3","ether"),
            {from: person2}
        ).should.rejected;

        await dai.approve(ico.address,web3.utils.toWei("3","ether"),{from: person1});

        await ico.buyToken(
            tokenB.address,
            web3.utils.toWei("3","ether"),
            {from: person1}
        ).should.rejected;
    })

    it("should buy token after end time", async () => {
        await time.increase(time.duration.days(1));

        await dai.approve(ico.address,web3.utils.toWei("6","ether"),{from: person1});

        await ico.buyToken(
            tokenA.address,
            web3.utils.toWei("3","ether"),
            {from: person1}
        ); 

        await ico.buyToken(
            tokenB.address,
            web3.utils.toWei("3","ether"),
            {from: person2}
        );

        await dai.approve(ico.address,web3.utils.toWei("6","ether"),{from: person2});

        await ico.buyToken(
            tokenB.address,
            web3.utils.toWei("3","ether"),
            {from: person2}
        );

        await ico.buyToken(
            tokenA.address,
            web3.utils.toWei("3","ether"),
            {from: person2}
        );
    })

    it("should not buy token if dai is not approved", async () => {
        await ico.buyToken(
            tokenB.address,
            web3.utils.toWei("3","ether"),
            {from: owner}
        ).should.rejected;
    })

    it("should not buy token less than minPurchase", async () => {
        await dai.approve(ico.address,web3.utils.toWei("1","ether"),{from: person2});

        await ico.buyToken(
            tokenB.address,
            web3.utils.toWei("1","ether"),
            {from: person2}
        ).should.rejected;
    })
    it("should not buy token more than maxPurchase", async () => {
        await dai.approve(ico.address,web3.utils.toWei("10","ether"),{from: person2});

        await ico.buyToken(
            tokenB.address,
            web3.utils.toWei("10","ether"),
            {from: person2}
        ).should.rejected;
    })

    it("should not buy token if total token less than purchase amount", async () => {
        await dai.approve(ico.address,web3.utils.toWei("13","ether"),{from: person1});
        await dai.approve(ico.address,web3.utils.toWei("14","ether"),{from: person2});

        await ico.buyToken(
            tokenA.address,
            web3.utils.toWei("4","ether"),
            {from: person1}
        )

        await ico.buyToken(
            tokenA.address,
            web3.utils.toWei("4","ether"),
            {from: person1}
        ).should.rejected;

        await ico.buyToken(
            tokenB.address,
            web3.utils.toWei("5","ether"),
            {from: person1}
        );

        await ico.buyToken(
            tokenB.address,
            web3.utils.toWei("7","ether"),
            {from: person2}
        );

        await ico.buyToken(
            tokenB.address,
            web3.utils.toWei("7","ether"),
            {from: person2}
        ).should.rejected;
    })

    it("should not withdraw dai before endTime", async () => {
        await ico.withdrawDai(tokenB.address,{from: tokenBOwner}).should.rejected;
    })

    it("should not possible buy token after endTime", async () => {
        await time.increase(time.duration.days(1));

        await dai.approve(ico.address,web3.utils.toWei("1","ether"),{from: person1});
        await dai.approve(ico.address,web3.utils.toWei("1","ether"),{from: person2});

        await ico.buyToken(
            tokenA.address,
            web3.utils.toWei("1","ether"),
            {from: person1}
        ).should.rejected;

        await ico.buyToken(
            tokenB.address,
            web3.utils.toWei("1","ether"),
            {from: person2}
        ).should.rejected;
    })

    it("it should possible withdraw token after endtime", async () => {
        await ico.withdrawToken(tokenA.address,{from: person2});
        await ico.withdrawToken(tokenA.address,{from: person1});

        const tokenAbalance1 = await tokenA.balanceOf(person1);
        const tokenAbalance2 = await tokenA.balanceOf(person2);

        await ico.withdrawToken(tokenB.address,{from: person1});
        await ico.withdrawToken(tokenB.address,{from: person2});

        const tokenBbalance1 = await tokenB.balanceOf(person1);
        const tokenBbalance2 = await tokenB.balanceOf(person2);

        assert.equal(tokenAbalance1,web3.utils.toWei("7","ether"));
        assert.equal(tokenAbalance2,web3.utils.toWei("3","ether"));

        assert.equal(tokenBbalance1,web3.utils.toWei("5","ether"));
        assert.equal(tokenBbalance2,web3.utils.toWei("13","ether"));
    })

    it("it should possible withdraw dai from token Owner", async () => {

        await ico.withdrawDai(tokenA.address,{from: tokenAOwner});
        await ico.withdrawDai(tokenB.address,{from: tokenBOwner});

        const daiBalanceAfter1 = await dai.balanceOf(tokenAOwner);
        const daiBalanceAfter2 = await dai.balanceOf(tokenBOwner);

        assert.equal(daiBalanceAfter1,web3.utils.toWei("10","ether"))
        assert.equal(daiBalanceAfter2,web3.utils.toWei("18","ether"))
    })

    it("it should not withdraw dai from non token Owner", async () => {
        await ico.withdrawDai(tokenB.address,{from: person1}).should.rejected;
    })

})
