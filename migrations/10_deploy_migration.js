require("dotenv").config();
const verify = require("../src/verify");

const BEther = artifacts.require("BEther");
const BirdCore = artifacts.require("BirdCore");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying pEther
const ADMIN_ADDRESS = "0xEe9A3468b9c0e6027C096929A4B402Ac4B2FE636"

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