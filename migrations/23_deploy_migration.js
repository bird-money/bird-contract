require("dotenv").config();
const verify = require("../src/verify");

const BirdLens = artifacts.require("BirdLens");

module.exports = async (deployer, network) => {

    // /* Deploy BirdLens contract */
    await deployer.deploy(BirdLens);

    if (network !== "development")
        await verify.etherscanVerify(
            BirdLens,
            network,
            process.env.ETHERSCAN_KEY,
            1
        );
};