require("dotenv").config();
const verify = require("../src/verify");

const BBNB = artifacts.require("BBNB");
const BirdCore = artifacts.require("BirdCore");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying bBNB
const ADMIN_ADDRESS = "0x60b6a57b71f23a8c602eD71b60272FdA321D2666"

module.exports = async (deployer, network) => {

    /* Deploy Bird BNB */
    await deployer.deploy(
        BBNB,
        BirdCore.address,
        JumpRateModel.address,
        "200000000000000000000000000",
        "Bird BNB",
        "bBNB",
        8,
        ADMIN_ADDRESS
    );

    if (network !== "development")
        await verify.bscscanVerify(
            BBNB,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};