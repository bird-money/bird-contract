require("dotenv").config();
const verify = require("../src/verify");

const BErc20LINKDelegate = artifacts.require("BErc20LINKDelegate");

module.exports = async (deployer, network) => {

    /* Deploy Bird BErc20LINKDelegate */
    await deployer.deploy(BErc20LINKDelegate);

    if (network !== "development")
        await verify.bscscanVerify(
            BErc20LINKDelegate,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};