require("dotenv").config();
const verify = require("../src/verify");

const BEther = artifacts.require("BEther");
const BirdCore = artifacts.require("BirdCore");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying pEther
const ADMIN_ADDRESS = "0x60b6a57b71f23a8c602eD71b60272FdA321D2666"

module.exports = async (deployer, network) => {

    /* Deploy Bird ETH */
    await deployer.deploy(
        BEther,
        BirdCore.address,
        JumpRateModel.address,
        "200000000000000000000000000",
        "Bird Ether",
        "bETH",
        8,
        ADMIN_ADDRESS
    );

    if (network !== "development")
    await verify.etherscanVerify(
        BEther,
        network,
        process.env.ETHERSCAN_KEY,
        1
    );
};