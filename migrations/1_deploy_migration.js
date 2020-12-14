require("dotenv").config();
const verify = require("../src/verify");

const SimplePriceOracle = artifacts.require("SimplePriceOracle");

module.exports = async (deployer, network) => {

    // /* Deploy Simple Price Oracle */
    await deployer.deploy(SimplePriceOracle);

    if (network !== "development")
        await verify.etherscanVerify(
            SimplePriceOracle,
            network,
            process.env.ETHERSCAN_KEY,
            1
        );
};