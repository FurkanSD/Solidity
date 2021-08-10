const TimeLock = artifacts.require("TimeLock");
const TestToken = artifacts.require("TestToken");

module.exports = async function (deployer) {
  await deployer.deploy(TimeLock);
  await deployer.deploy(TestToken);
};
