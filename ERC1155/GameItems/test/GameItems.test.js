const { BN } = require("bn.js");
const { assert } = require("chai");

const GameItems = artifacts.require("GameItems");
require("chai").use(require("chai-as-promised")).should();

[COIN,SHIELD,SWORD] = ["COIN","SHIELD","SWORD"]
.map(item => web3.utils.fromAscii(item));

contract("GameItems test", (accounts) => {

    let gameItems;
    beforeEach(async ()=>{
        gameItems = await GameItems.deployed();
    })

    it("deploys successfully", async () => {
        assert.notEqual(gameItems.address,"")
        assert.notEqual(gameItems.address,null)
        assert.notEqual(gameItems.address,undefined)
        assert.notEqual(gameItems.address,0x00)
    })

    it("should add new item", async () =>  {
        const Event = await gameItems.addNewItem(COIN,{from: accounts[0]});
        const event = Event.logs[0].args;
        assert.equal(event.id,0);
        assert.equal(event.name,COIN); 

        const items = await gameItems.items(0);
        assert.equal(items.id,0);
        assert.equal(items.name,COIN);
    })

    it("should not add new item from non-admin account", async () => {
        await gameItems.addNewItem(SWORD,{from: accounts[1]}).should.rejected;
    })

    it("should mint", async () => {
        await gameItems.mint(
            accounts[0],
            0,
            new BN(1000000),
            0x00,
            {from:accounts[0]}
        );
        const balance = await gameItems.balanceOf(accounts[0],0);
        assert.equal(balance,"1000000");
    })

    it("should not mint from non-admin account", async () => {
        await gameItems.mint(
            accounts[0],
            0,
            new BN(1000000),
            0x00,
            {from: accounts[1]}
        ).should.rejected;
    })

    it("should not mint non exist item", async () => {
         await gameItems.mint(
            accounts[0],
            1,
            new BN(1000000),
            0x00,
            accounts[0]
        ).should.rejected;
    })

    it("should mintBatch", async () => {
        await gameItems.addNewItem(SWORD,{from: accounts[0]});

        await gameItems.mintBatch(
            accounts[1],
            [0,1],
            [new BN(1000000),new BN(530000)],
            0x00,
            {from:accounts[0]}
        )

        const coinBalance= await gameItems.balanceOf(accounts[1],0);
        const shieldBalance= await gameItems.balanceOf(accounts[1],1);
        assert.equal(coinBalance,"1000000");
        assert.equal(shieldBalance,"530000");
    })
    it("should not mintBatch from non admin accounts", async () => {
        await gameItems.mintBatch(
            accounts[0],
            [0,1],
            [new BN(1000000),new BN(1000000)],
            0x00,
            {from:accounts[2]}
        ).should.rejected;
    })
    it("should not mintBatch non exist items", async () => {
        await gameItems.mintBatch(
            accounts[0],
            [0,2],
            [new BN(1000000),new BN(1000000)],
            0x00,
            {from:accounts[0]}
        ).should.rejected;
    })
    

})
