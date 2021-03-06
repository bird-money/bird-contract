require("dotenv").config();
const verify = require("../src/verify");

const Timelock = artifacts.require("Timelock");

// Admin address for Timelock
const ADMIN_ADDRESS = "0xEe9A3468b9c0e6027C096929A4B402Ac4B2FE636"

module.exports = async (deployer, network) => {

    /* Deploy Timelock Contract */
    await deployer.deploy(
        Timelock,
        ADMIN_ADDRESS,
        172800
    );

    if (network !== "development")
        await verify.etherscanVerify(
            Timelock,
            network,
            process.env.ETHERSCAN_KEY,
            1
        );
};