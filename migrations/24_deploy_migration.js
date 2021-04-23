require("dotenv").config();
const verify = require("../src/verify");

const BirdOracle = artifacts.require("BirdOracle");

module.exports = async (deployer, network) => {

    // /* Deploy BirdOracle contract */
    await deployer.deploy(BirdOracle);

    if (network !== "development")
        await verify.bscscanVerify(
            BirdOracle,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};