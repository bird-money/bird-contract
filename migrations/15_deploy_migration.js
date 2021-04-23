require("dotenv").config();
const verify = require("../src/verify");

const BErc20WBTCDelegate = artifacts.require("BErc20WBTCDelegate");

module.exports = async (deployer, network) => {

    /* Deploy Bird BErc20WBTCDelegate */
    await deployer.deploy(BErc20WBTCDelegate);

    if (network !== "development")
        await verify.bscscanVerify(
            BErc20WBTCDelegate,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};