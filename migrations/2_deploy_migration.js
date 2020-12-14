require("dotenv").config();
const verify = require("../src/verify");

const BirdInterestRateModel = artifacts.require("BirdInterestRateModel");

module.exports = async (deployer, network) => {

    /* Deploy Bird Interest Model */
    await deployer.deploy(
        BirdInterestRateModel,
        "20000000000000000",
        "100000000000000000"
    );

    if (network !== "development")
        await verify.etherscanVerify(
            BirdInterestRateModel,
            network,
            process.env.ETHERSCAN_KEY,
            1
        );
};