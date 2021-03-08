require("dotenv").config();
const verify = require("../src/verify");

const Timelock = artifacts.require("Timelock");

// Admin address for Timelock
const ADMIN_ADDRESS = "0x60b6a57b71f23a8c602eD71b60272FdA321D2666"

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