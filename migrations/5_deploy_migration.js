require("dotenv").config();
const verify = require("../src/verify");

const BirdPlus = artifacts.require("BirdPlus");

// Address for transferring BirdPlus Token
const ADMIN_ADDRESS = "0x6f20FEeECcd51783779Ca10431b60B15f83d06F1"

module.exports = async (deployer, network) => {

    /* Deploy BirdPlus Contract */
    /*await deployer.deploy(BirdPlus, ADMIN_ADDRESS);

    if (network !== "development")
        await verify.etherscanVerify(
            BirdPlus,
            network,
            process.env.ETHERSCAN_KEY,
            1
        ); */
}; 