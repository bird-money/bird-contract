require("dotenv").config();
const verify = require("../src/verify");

const BErc20USDCDelegate = artifacts.require("BErc20USDCDelegate");

module.exports = async (deployer, network) => {

    /* Deploy Bird Erc20USDCDelegate */
    await deployer.deploy(BErc20USDCDelegate);

    if (network !== "development")
        await verify.bscscanVerify(
            BErc20USDCDelegate,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};