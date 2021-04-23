require("dotenv").config();
const verify = require("../src/verify");

const BErc20Delegate = artifacts.require("BErc20Delegate");

module.exports = async (deployer, network) => {

    /* Deploy Bird Erc20Delegate */
    await deployer.deploy(BErc20Delegate);

    if (network !== "development")
        await verify.bscscanVerify(
            BErc20Delegate,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};