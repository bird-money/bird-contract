require("dotenv").config();
const verify = require("../src/verify");

const BirdCore = artifacts.require("BirdCore");

module.exports = async (deployer, network) => {

    /* Deploy Bird Core (Unitroller) */
    await deployer.deploy(BirdCore);

    if (network !== "development")
        await verify.etherscanVerify(
            BirdCore,
            network,
            process.env.ETHERSCAN_KEY,
            1
        );
};