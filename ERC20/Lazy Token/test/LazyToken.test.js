const { assert } = require("chai");
const Lazy = artifacts.require("LazyToken");
const { pow } = require("../util")
const BN = require("bn.js")
require("chai")
.use(require("chai-as-promised")).should();

contract("LazyToken test",  ([windu, yoda, obi]) => {
    let lazy;
    beforeEach(async () => {
        lazy = await Lazy.deployed({from: windu});
    })

    it("deploys successfully", async () => {
        assert.notEqual(lazy.address,"")
        assert.notEqual(lazy.address,0x00)
        assert.notEqual(lazy.address,null)
        assert.notEqual(lazy.address,undefined);
    })

    it("shoul mint token from admin", async () => {
        await lazy.mint(windu,new BN(1000),{from: windu});
        const balance = await lazy.balanceOf(windu);
        assert.equal(balance,"1000");
    })
    it("should NOT mint token from other accounts", async () => {
        await lazy.mint(yoda,new BN(1000),{from:obi}).should.rejected;
    })

    it("should whitelist account", async () => {
        await lazy.addWhiteList(yoda,{from: windu});  
    })
    it("should send request", async () => {
       const event = await lazy.sendRequest(windu,new BN(100),"give me purple lightsaber",{from: yoda});
       const List = await lazy.showRequestList({from: windu});

       assert.equal(List[0],0);
        
    })
    it("should return request properties", async ()=> {
        const list = await lazy.showRequest(0,{from: windu});
        
        assert.equal(list.id,0)
        assert.equal(list.amount,100)
        assert.equal(list.from,yoda)
        assert.equal(list.describe,"give me purple lightsaber")
    })
    it("should transfer token with id", async () => {
        await lazy.idTransfer(0,{from:windu});
        const balance = await lazy.balanceOf(yoda);
        const list = await lazy.showRequestList({from: windu});

        assert.equal(list[0],undefined);
        assert.equal(balance,"100");
    })
    
    it("should delete request", async () => {
        await lazy.sendRequest(windu,new BN(100),"anakin is the chosen one",{from: yoda}); 
        await lazy.deleteRequest(1,{from: windu});
        const list = await lazy.showRequestList({from :windu});

        assert.equal(list[0], undefined);
    })

    it("should delete whitelisted account", async () => {
        await lazy.deleteWhiteList(yoda,{from: windu});

        await lazy.sendRequest(windu,new BN(100),{from: yoda}).should.rejected;
    })
    it("should NOT transfer token when contract paused", async () => {
        await lazy.pause({from: windu});

        await lazy.transfer(obi,new BN(10),{from:windu}).should.rejected;
    })
    it("should NOT unpaused from other accounts", async () => {
        await lazy.pause({from:obi}).should.rejected;
    })
    it("should unpause contract", async () => {
        await lazy.pause({from: windu});

        await lazy.transfer(obi,new BN(10),{from:windu});
    })
    it("should NOT mint more than max supply", async ()=> {
        const AMOUNT = pow(10, 18).mul(new BN(10000000000000))

        await lazy.mint(windu,AMOUNT,{from:windu}).should.rejected;
    })
    
})
