require("dotenv").config();
const verify = require("../src/verify");

const BirdPlus = artifacts.require("BirdPlus");

// Address for transferring BirdPlus Token
const ADMIN_ADDRESS = "0xEe9A3468b9c0e6027C096929A4B402Ac4B2FE636"

module.exports = async (deployer, network) => {

    /* Deploy BirdPlus Contract */
    /*await deployer.deploy(BirdPlus, ADMIN_ADDRESS);

    if (network !== "development")
        await verify.etherscanVerify(
            BirdPlus,
            network,
            process.env.ETHERSCAN_KEY,
            1
        ); */
}; 