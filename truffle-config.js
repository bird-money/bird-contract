const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

const providerFactory = network =>

  new HDWalletProvider(
    process.env.PRIVATE_KEY,
    `https://${network}.infura.io/v3/${process.env.INFURA_KEY}`
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
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    // dev: {
    //   host: "127.0.0.1",
    //   port: 7545,
    //   network_id: "*" // Match any network id
    // },
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "999",       // Any network (default: none)
      gas: 2000000000,        // Gas
      gasPrice: 30000000
    },
    rinkeby: {
      provider: () => providerFactory("rinkeby"),
      network_id: 4,       // Ropsten's id
      gas: 8500000,        // Ropsten has a lower block limit than mainnet
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true,    // Skip dry run before migrations? (default: false for public nets )
      gasPrice: 30000000
    },
    kovan: {
      provider: () => providerFactory("kovan"),
      network_id: 42,       // Ropsten's id
      gas: 8500000,        // Ropsten has a lower block limit than mainnet
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true    // Skip dry run before migrations? (default: false for public nets )
    },
    mainnet: {
      provider: () => providerFactory("mainnet"),
      network_id: 1,       // Ropsten's id
      gas: 8500000,        // Ropsten has a lower block limit than mainnet
      gasPrice: 155000000000,
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true    // Skip dry run before migrations? (default: false for public nets )
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: process.env.ETHERSCAN_KEY
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
