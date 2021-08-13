const Auction = artifacts.require("Auction");

module.exports = function (deployer,networks_id,accounts) {
  deployer.deploy(
      Auction,
      80000,
      {from:accounts[0], value: web3.utils.toWei("10","ether")});
};
