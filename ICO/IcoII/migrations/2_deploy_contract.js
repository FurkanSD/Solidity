const Ico = artifacts.require("Ico");
const Dai = artifacts.require("Dai");
const TokenA = artifacts.require("TokenA");
const TokenB = artifacts.require("TokenB");

module.exports = async function (deployer) {
  await deployer.deploy(Dai);
  const dai =  await Dai.deployed();

  await deployer.deploy(Ico,dai.address);
  await deployer.deploy(TokenA);
  await deployer.deploy(TokenB);
};
