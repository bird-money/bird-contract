const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

const providerFactory = network =>

  new HDWalletProvider(
    process.env.PRIVATE_KEY,
    network == "testnet" ? `https://data-seed-prebsc-1-s1.binance.org:8545` : `https://bsc-dataseed.binance.org`
  );

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    testnet: {
      provider: () => providerFactory("testnet"),
      network_id: 97,       // BSC Testnet
      gas: 8500000,        // testnet has a lower block limit than mainnet
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: false    // Skip dry run before migrations? (default: false for public nets )
    },
    mainnet: {
      provider: () => providerFactory("mainnet"),
      network_id: 1,       // BSC mainnet
      gas: 8500000,        // testnet has a lower block limit than mainnet
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: false    // Skip dry run before migrations? (default: false for public nets )
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    //timeout: 100000
  },

  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: process.env.BSCSCANAPIKEYY
  },

  // Configure your compilers
  // compilers: {
  //   solc: {
  //     version: "0.5.16",    // Fetch exact version from solc-bin (default: truffle's version)
  //     // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
  //     settings: {          // See the solidity docs for advice about optimization and evmVersion
  //       optimizer: {
  //         enabled: true,
  //         runs: 9999
  //       },
  //       // evmVersion: "byzantium"
  //     }
  //   }
  // }

  compilers: {
    solc: {
      version: "0.5.16",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: "istanbul"
      }
    }
  }
}
