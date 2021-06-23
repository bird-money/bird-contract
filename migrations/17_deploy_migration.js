require("dotenv").config();
const verify = require("../src/verify");

const BErc20ZRXDelegate = artifacts.require("BErc20ZRXDelegate");

module.exports = async (deployer, network) => {

    /* Deploy Bird BErc20ZRXDelegate */
    /*await deployer.deploy(BErc20ZRXDelegate);

    if (network !== "development")
        await verify.bscscanVerify(
            BErc20ZRXDelegate,
            network,
            process.env.BSCSCANAPIKEY,
            1
        ); */
};