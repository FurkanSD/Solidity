const MultiSig = artifacts.require("MultiSig");

module.exports = function (deployer,networkId, addresses) {
    let [address1,address2,address3,] = [addresses[0],addresses[1],addresses[2]];
    
    const power = [1,2,1]
    deployer.deploy(MultiSig,
      [address1,address2,address3],
      [1,2,1]);
     
};
