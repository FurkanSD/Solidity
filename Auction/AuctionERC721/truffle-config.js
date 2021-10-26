const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {


  networks: {

    rinkeby : {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, `https://rinkeby.infura.io/v3/${process.env.RINKEBY}`,0)
      },
      network_id: 4,
      timeoutBlocks: 2000,
      skipDryRun: true,
      networkCheckTimeout: 1200000
    },
    binance_test : {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, `https://speedy-nodes-nyc.moralis.io/${process.env.BINANCE}/bsc/testnet`,0)
      },
      network_id: 97,
      timeoutBlocks: 2000,
      skipDryRun: true,
      networkCheckTimeout: 1200000
    },
    
    mainnet_fork: {
      host:"127.0.0.1",
      port:8545,
      network_id:"*"
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: `${process.env.ETHERSCAN}`,
    bscscan: `${process.env.BSCSCAN}`
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    reporter: 'eth-gas-reporter',
    
  },

  // Configure your compilers
  compilers: {
    solc: {
       version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },


  db: {
    enabled: false
  }
};
