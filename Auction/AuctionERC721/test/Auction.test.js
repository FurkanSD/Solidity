const { assert } = require("chai");
require("chai").use(require("chai-as-promised")).should();
const Auction = artifacts.require("Auction");
const NftA = artifacts.require("NftA");
const NftB = artifacts.require("NftB");
const BN = require("bn.js");
const { time } = require("@openzeppelin/test-helpers");
const addressZero = "0x0000000000000000000000000000000000000000";

contract("Auction test", ([admin, seller1, seller2, customer1, customer2, customer3]) => {

    let auction, nftA, nftB, currentTime;
    beforeEach(async () => {
        auction = await Auction.deployed();
        nftA = await NftA.deployed();
        nftB = await NftB.deployed();
    })

    it("should be depolyed", async () => {
        assert.notEqual(auction.address, 0x00);
        assert.notEqual(auction.address, undefined);
        assert.notEqual(auction.address, null);
        assert.notEqual(auction.address, "");
        assert.notEqual(nftA.address, 0x00);
        assert.notEqual(nftA.address, undefined);
        assert.notEqual(nftA.address, null);
        assert.notEqual(nftA.address, "");
        assert.notEqual(nftB.address, 0x00);
        assert.notEqual(nftB.address, undefined);
        assert.notEqual(nftB.address, null);
        assert.notEqual(nftB.address, "");
    })
    it("should whitelist account", async () => {
        const Event = await auction.whitelistAccount(seller1, { from: admin });
        const event = Event.logs[0].args;
        const whiteListed = await auction.whiteListedAccounts(seller1);


        assert.equal(whiteListed.whiteListed, true);
        assert.equal(event.account, seller1);
    })
    it("should not whitelist account from non-admin account", async () => {
        await auction.whitelistAccount(customer2, { from: customer3 }).should.rejected;
        const whiteListed = await auction.whiteListedAccounts(customer2);

        assert.equal(whiteListed.whiteListed, false);
    })
    it("should add new auction", async () => {
        currentTime = await time.latest();
        await auction.whitelistAccount(seller2, { from: admin });
        await nftA.safeMint(seller1, { from: seller1 });
        await nftB.safeMint(seller2, { from: seller2 });

        await nftA.approve(auction.address, 0, { from: seller1 });
        await nftB.approve(auction.address, 0, { from: seller2 });

        const seller1Event = await auction.addNewAuction(
            nftA.address,
            0,
            currentTime,
            86400,
            { from: seller1 }
        );

        let startTime = currentTime.add(new BN(86400));

        const seller2Event = await auction.addNewAuction(
            nftB.address,
            0,
            startTime,
            86400,
            { from: seller2 }
        );

        const eventSeller1 = seller1Event.logs[0].args;
        const eventSeller2 = seller2Event.logs[0].args;

        assert.equal(eventSeller1.tokenAddress, nftA.address)
        assert.equal(eventSeller1.tokenOwner, seller1)
        assert.equal(eventSeller1.tokenId, 0)
        assert.equal(eventSeller1.auctionId, 0)
        assert.equal(eventSeller1.startTime.toString(), currentTime.toString());
        assert.equal(eventSeller1.endTime.toString(), startTime.toString())


        assert.equal(eventSeller2.tokenAddress, nftB.address)
        assert.equal(eventSeller2.tokenOwner, seller2)
        assert.equal(eventSeller2.tokenId, 0)
        assert.equal(eventSeller2.auctionId, 1)
        assert.equal(eventSeller2.startTime.toString(), startTime.toString())
        assert.equal(eventSeller2.endTime.toString(), startTime.add(new BN(86400)).toString())

        const auctionId = await auction.auctionId();
        assert.equal(auctionId, 2);
    })

    it("should not add auction if token is not approved", async () => {
        await nftA.safeMint(seller1, { from: seller1 });

        await auction.addNewAuction(
            nftA.address,
            1,
            currentTime,
            86400,
            { from: seller1 }
        ).should.rejected;
    })

    it("should not add auction from non whitelisted account", async () => {
        await auction.addNewAuction(
            nftA.address,
            0,
            currentTime,
            86400,
            { from: customer2 }
        ).should.rejected;
    })

    it("should be possible see auction", async () => {
        const firstAuction = await auction.auctions(0);
        const secondAuction = await auction.auctions(1);

        let startTime = currentTime.add(new BN(86400));

        assert.equal(firstAuction.tokenAddress, nftA.address);
        assert.equal(firstAuction.tokenOwner, seller1);
        assert.equal(firstAuction.highestBidder, addressZero);
        assert.equal(firstAuction.tokenId, 0);
        assert.equal(firstAuction.highestBid, 0);
        assert.equal(firstAuction.startTime.toString(), currentTime.toString());
        assert.equal(firstAuction.endTime.toString(), startTime.toString());

        assert.equal(secondAuction.tokenAddress, nftB.address);
        assert.equal(secondAuction.tokenOwner, seller2);
        assert.equal(secondAuction.highestBidder, addressZero);
        assert.equal(secondAuction.tokenId, 0);
        assert.equal(secondAuction.highestBid, 0);
        assert.equal(secondAuction.startTime.toString(), startTime.toString());
        assert.equal(secondAuction.endTime.toString(), startTime.add(new BN(86400)).toString());
    })

    it("shoud be possible bid", async () => {

        const customer1Event = await auction.bid(
            0,
            0,
            { from: customer1, value: web3.utils.toWei("1", "ether") }
        );

        const eventCustomer1 = customer1Event.logs[0].args;
        const auctions = await auction.auctions(0);

        assert.equal(eventCustomer1.token, nftA.address);
        assert.equal(eventCustomer1.bidder, customer1);
        assert.equal(eventCustomer1.tokenId, 0);
        assert.equal(eventCustomer1.bid.toString(), web3.utils.toWei("1", "ether").toString());

        assert.equal(auctions.highestBidder, customer1);
        assert.equal(auctions.highestBid.toString(), web3.utils.toWei("1", "ether").toString());
    })

    it("should not bid before startTime", async () => {
        await auction.bid(
            1,
            0,
            { from: customer1, value: web3.utils.toWei("1", "ether") }
        ).should.rejected;
    })

    it("should not use more than withdrawableBalance", async () => {
        await auction.bid(
            1,
            1,
            { from: customer1, value: web3.utils.toWei("2", "ether") }
        ).should.rejected;
    })

    it("should not bid less than highestBid", async () => {
        await auction.bid(
            1,
            0,
            { from: customer1, value: web3.utils.toWei("1", "ether") }
        ).should.rejected;
    })

    it("should not withdraw token before endTime", async () => {
        await auction.endAuction(0, {
            from: customer1
        }).should.rejected;
    })

    it("should not withdraw token from non highestbidder account", async () => {
        await auction.endAuction(0, {
            from: customer2
        }).should.rejected;
    })

    it("should show URI", async () => {
        const URI = await auction.URI(1);

        assert.equal(URI, "https://www.auctionExample.com/token0");
    })

    it("should delete account", async () => {
        await nftA.safeMint(seller2, { from: seller2 });

        await nftA.approve(auction.address, 2, { from: seller2 });

        await auction.addNewAuction(
            nftA.address,
            2,
            currentTime,
            86400,
            { from: seller2 }
        )

        const deletedAccount = await auction.deletewhitelistedAccount(seller2, { from: admin });

        const event = deletedAccount.logs[0].args

        await nftA.safeMint(seller2, { from: seller2 });

        await nftA.approve(auction.address, 3, { from: seller2 });

        await auction.addNewAuction(
            nftA.address,
            3,
            currentTime,
            86400,
            { from: seller2 }
        ).should.rejected;

        const aucions = await auction.auctions(1);
        const aucions2 = await auction.auctions(2);

        assert.equal(aucions.tokenOwner, addressZero);
        assert.equal(aucions2.tokenOwner, addressZero)

        assert.equal(event.account, seller2);
        assert.equal(event.deletedAuctions[0], 1);
        assert.equal(event.deletedAuctions[1], 2);

    })

    it("should withdraw token after endTime", async () => {
        await time.increase(time.duration.days(1));

        const Event = await auction.endAuction(0, { from: customer1 });

        const event = Event.logs[0].args;

        assert.equal(event.token, nftA.address)
        assert.equal(event.buyer, customer1)
        assert.equal(event.highestBid, web3.utils.toWei("1", "ether"))
        assert.equal(event.tokenId, 0)

        await nftA.safeTransferFrom(auction.address, customer1, 0, { from: customer1 });
        const tokenOwner = await nftA.ownerOf(0);
        const sellerBalance = await auction.withdrawableBalance(seller1);
        const feeBalance = await auction.withdrawableBalance(admin);


        assert.equal(sellerBalance.toString(), "990000000000000000");
        assert.equal(feeBalance.toString(), "10000000000000000");
        assert.equal(tokenOwner, customer1);
    })
    it("should not withdraw more than withdrawable balance", async () => {
        await auction.withdraw(web3.utils.toWei("1", "ether"), { from: seller1 }).should.rejected;
    })
    it("should withdraw eth", async () => {
        await auction.withdraw(web3.utils.toBN(990000000000000000), { from: seller1 });
    })
    it("should change fee", async () => {
        await auction.changeFee(1, { from: admin });
        const fee = await auction.fee();

        assert.equal(fee, 1);
    })
    it("should not change fee from non admin account", async () => {
        await auction.changeFee(2, { from: seller1 }).should.rejected;
    })
    it("should not change fee more than 500", async () => {
        await auction.changeFee(503, { from: admin }).should.rejected;
    })
    it("should change admin", async () => {
        await auction.changeAdmin(customer3, { from: admin });
        const adminAccount = await auction.admin();

        assert.equal(adminAccount, customer3);
    })
    it("should not change admin from non-admin account", async () => {
        await auction.changeAdmin(customer3, { from: seller1 }).should.rejected;
    })


})
