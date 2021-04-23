require("dotenv").config();
const verify = require("../src/verify");

const BErc20BATDelegate = artifacts.require("BErc20BATDelegate");

module.exports = async (deployer, network) => {

    /* Deploy Bird BErc20BATDelegate */
    await deployer.deploy(BErc20BATDelegate);

    if (network !== "development")
        await verify.bscscanVerify(
            BErc20BATDelegate,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};