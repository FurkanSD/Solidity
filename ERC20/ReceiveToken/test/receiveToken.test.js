const { assert } = require("chai");
const ReceiveToken = artifacts.require("ReceiveToken");
const TestContract = artifacts.require("testContract");

require("chai").use(require("chai-as-promised")).should();

contract("Test", (accounts) => {

    let receiveToken, testContract;
    beforeEach(async () => {
        receiveToken = await ReceiveToken.new();
        testContract = await TestContract.new();
    })
    it("should mint", async () => {
        await receiveToken.mint(accounts[0], 53, { from: accounts[0] });
        const balance = await receiveToken.balanceOf(accounts[0]);
        assert.equal(balance, 53);
    })
    it("should not mint from non admin accounts", async () => {
        await receiveToken.mint(accounts[1], 100, { from: accounts[1] }).should.rejected;
    })
    it("Receive function should work", async () => {
        await receiveToken.mint(accounts[0],53,{from: accounts[0]});
        await receiveToken.transfer(testContract.address, 50, { from: accounts[0] });
        const receivedToken = await testContract.receivedToken(accounts[0]);
        assert.equal(receivedToken, 50);
    })
})
