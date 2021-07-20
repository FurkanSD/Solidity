const { BN } = require("bn.js");
const { assert } = require("chai");
const MultiSig = artifacts.require("MultiSig");
const IERC20 = artifacts.require("IERC20");
const EmptyAccount ="0xE5c96ebaD04955b879Cd436AF06049FE3ab9E1D1";
const SXP = "0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9";
const SXP_WHALE = "0x885cd46eB8205b0EDD288E7d297751734f1a9e73";

require("chai").use(require("chai-as-promised")).should();
const VOTE = {APPROVE:0,REJECT:1}

contract("MultiSig Test",  ([windu,yoda,obi,qui]) => {
    let multi, tokenIn
    beforeEach(async () => {
        multi = await MultiSig.deployed();
         tokenIn = await IERC20.at(SXP);
    })

    it("deploys successfully", async () => {
        assert.notEqual(multi.address,"")
        assert.notEqual(multi.address,null)
        assert.notEqual(multi.address,0x00)
        assert.notEqual(multi.address,undefined)

        await web3.eth.sendTransaction({to:multi.address,from:qui,value: web3.utils.toWei("1","ether")});  
    })
    describe("createEthTransfer", () => {
        it("should create ETH transactions", async () => {
            const even = await multi.createEthTransfer(EmptyAccount,3000000000,"May the Force be with you",{from: yoda});
            const event = even.logs[0].args
            assert.equal(event.id,11)
            assert.equal(event.to,EmptyAccount);
            assert.equal(event.amount,3000000000);
            assert.equal(event.creater,yoda);
            
        })

        it("should not create transaction", async () => {
            await multi.createEthTransfer(windu,new BN(100),"May the Force be with you",{from: qui}).should.rejected;
        })

        it("should return transfer properties", async () => {
            const array = await multi.showEthTransfer(11);
            const enable = await multi.showEnableTransactions();
            assert.equal(array[0],11)
            assert.equal(array[1],EmptyAccount)
            assert.equal(array[2],3000000000)
            assert.equal(array[3],yoda)
            assert.equal(array[4],"May the Force be with you")
            assert.equal(array[5],0)
            assert.equal(array[6],0)
            assert.equal(enable[0],11);
        })

        it("should approve", async () => {
            await multi.vote(11,VOTE.APPROVE,{from: obi});
            await multi.vote(11,VOTE.APPROVE,{from: windu});

            const balance = await web3.eth.getBalance(EmptyAccount);
            assert.equal(balance,"3000000000")
        })

        it("should only except accounts vote", async () => {
            await multi.vote(11, VOTE.APPROVE,{from: qui}).should.rejected;
        })

        it("should create ETH transaction", async () => {
            const even = await multi.createEthTransfer(EmptyAccount,3000000000,"May the Force be with you",{from: yoda});
            const event = even.logs[0].args
            assert.equal(event.id,21)
            assert.equal(event.to,EmptyAccount);
            assert.equal(event.amount,3000000000);
            assert.equal(event.creater,yoda);
            
        })

        it("should possible vote from exist accounts", async () => {
            await multi.vote(21,VOTE.REJECT,{from: obi});
            await multi.vote(21,VOTE.REJECT,{from: windu});

            const balance = await web3.eth.getBalance(EmptyAccount);
            assert.equal(balance,"3000000000")
        })

    })

    describe("createTokenTransfer", () => {
        it("should create token transfer", async () => {
            await tokenIn.transfer(multi.address,web3.utils.toWei("10000","wei"),{from: SXP_WHALE });

           const even = await multi.createTokenTransfer(yoda,SXP,web3.utils.toWei("10000","wei"),"May the Force be with you",{from: windu})
           const event = even.logs[0].args
           assert.equal(event.id,32)
           assert.equal(event.to,yoda)
           assert.equal(event.amount,"10000")
           assert.equal(event.creater,windu)
        })
        it("should show transfer properties", async () => {
            let array = await multi.showTokenTransfer(32);
            const enable = await multi.showEnableTransactions();



            assert.equal(array.id,32)
            assert.equal(array[1],yoda)
            assert.equal(array[2],SXP)
            assert.equal(array[3],"10000")
            assert.equal(array[4],windu)
            assert.notEqual(array[5],"")
            assert.equal(array[6],"May the Force be with you")
            assert.equal(array[7],0)
            assert.equal(array[8],0) 
            assert.equal(enable[0],32);         
        })

        it("should not create transaction", async () => {
            await multi.createTokenTransfer(windu,SXP,web3.utils.toWei("10000","wei"),"May the Force be with you",{from: qui}).should.rejected;
        })

        it("should approve", async () => {
            await multi.vote(32,VOTE.APPROVE,{from: windu});
            await multi.vote(32,VOTE.APPROVE,{from: yoda});


            const enable = await multi.showEnableTransactions();

            const balance = await tokenIn.balanceOf(yoda);
            assert.equal(balance,"10000");
            assert.equal(enable[0],undefined);
        })

        it("should not approve", async () => {
            await multi.vote(32, VOTE.APPROVE,{from: qui}).should.rejected;
        })

        it("should create createTokenTransfer", async () => {

           const even = await multi.createTokenTransfer(yoda,SXP,web3.utils.toWei("10000","wei"),"May the Force be with you",{from: windu})
           const event = even.logs[0].args
           assert.equal(event.id,42)
           assert.equal(event.to,yoda)
           assert.equal(event.amount,"10000")
           assert.equal(event.creater,windu)
        })

        it("shoul vote ", async () => {
            await multi.vote(42,VOTE.REJECT,{from: windu});
            await multi.vote(42,VOTE.REJECT,{from: yoda});

            const balance = await tokenIn.balanceOf(yoda);
            assert.equal(balance,"10000");
        })

    })
    

    describe("createrApproverEvent test", () => {
        it("should creat approve event", async () => {
            const even = await multi.createrApproverEvent(obi,1,1,{from: windu});
            const event = even.logs[0].args
            assert.equal(event.id,53);
            assert.equal(event.who,obi);
            assert.equal(event.creater,windu);
            assert.equal(event.approve,"1");
            assert.equal(event.amount,"1");

            const enable = await multi.showEnableTransactions();
            assert.equal(enable[0],53);
            
          })
        
        it("should show transfer details", async () => {
            let array = await multi.showApproverEvent(53);
            const enable = await multi.showEnableTransactions();


            assert.equal(array[0],"53")
            assert.equal(array[1],obi)
            assert.equal(array[2],VOTE.REJECT)
            assert.equal(array[3],windu)
            assert.equal(array[4],"1")
            assert.equal(array[5],"0")
            assert.equal(array[6],"0")
            assert.equal(enable[0],"53");

        })

        it("should not create event ", async () => {
            await multi.createrApproverEvent(windu,0,1,{from: qui}).should.rejected;
        })

        it("shoul vote", async () => {
            await multi.vote(53,VOTE.APPROVE,{from: windu});
            await multi.vote(53,VOTE.APPROVE,{from: yoda});
            

            await multi.createrApproverEvent(obi,0,1,{from: obi}).should.rejected;     
        })

        it("should not vote", async () => {
            await multi.vote(53,VOTE.APPROVE,{from: qui}).should.rejected;
            await multi.vote(53,VOTE.APPROVE,{from: windu}).should.rejected;
        })

        it("should creat approver event", async () => {
            const even = await multi.createrApproverEvent(obi,0,1,{from: windu});
            const event = even.logs[0].args
            assert.equal(event.id,63);
            assert.equal(event.who,obi);
            assert.equal(event.creater,windu);
            assert.equal(event.approve,"0");
            assert.equal(event.amount,"1");
            
          })

        it("should approve", async () => {
            await multi.vote(63,VOTE.APPROVE,{from: windu});
            await multi.vote(63,VOTE.APPROVE,{from: yoda});
            

            await multi.createrApproverEvent(obi,0,1,{from: obi});  
        })
    })
        it("should not approve if vote number is not exist", async () => {
             await multi.vote(83,VOTE.APPROVE,{from: windu}).should.rejected;
         }) 
    
})
