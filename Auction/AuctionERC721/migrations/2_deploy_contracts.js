const Auction = artifacts.require("Auction");
const NftA = artifacts.require("NftA");
const NftB = artifacts.require("NftB");

module.exports =  function (deployer,netwokId,addresses) {
 
   deployer.deploy(Auction,
    100,
    {from:addresses[0]});

   deployer.deploy(NftA);

   deployer.deploy(NftB);
};
