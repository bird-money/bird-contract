require("dotenv").config();
const verify = require("../src/verify");

const Timelock = artifacts.require("Timelock");

// Admin address for Timelock
const ADMIN_ADDRESS = "0x6f20FEeECcd51783779Ca10431b60B15f83d06F1"

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