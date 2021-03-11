require("dotenv").config();
const verify = require("../src/verify");

const BirdPlus = artifacts.require("BirdPlus");

// Address for transferring BirdPlus Token
const ADMIN_ADDRESS = "0x60b6a57b71f23a8c602eD71b60272FdA321D2666"

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