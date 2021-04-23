require("dotenv").config();
const verify = require("../src/verify");

const JumpRateModel = artifacts.require("JumpRateModel");

module.exports = async (deployer, network) => {

    /* Deploy Jump Rate Model */
    await deployer.deploy(
        JumpRateModel,
        "20000000000000000",
        "200000000000000000",
        "2000000000000000000",
        "900000000000000000"
    );

    if (network !== "development")
        await verify.bscscanVerify(
            JumpRateModel,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};