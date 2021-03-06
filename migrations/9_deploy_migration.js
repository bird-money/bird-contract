require("dotenv").config();
const verify = require("../src/verify");

const BErc20USDCDelegate = artifacts.require("BErc20USDCDelegate");
const BErc20USDCDelegator = artifacts.require("BErc20USDCDelegator");
const BirdCore = artifacts.require("BirdCore");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying bUSDC
const ADMIN_ADDRESS = "0xEe9A3468b9c0e6027C096929A4B402Ac4B2FE636"

module.exports = async (deployer, network) => {
    let USDC_TOKEN_ADDRESS;

    if (network === "kovan" || "development") {
        USDC_TOKEN_ADDRESS = "0xb7a4F3E9097C08dA09517b5aB877F7a917224ede"
    }

    /* Deploy Bird USDC */
    await deployer.deploy(
        BErc20USDCDelegator,
        USDC_TOKEN_ADDRESS,
        BirdCore.address,
        JumpRateModel.address,
        "200000000000000",
        "Bird USDC",
        "bUSDC",
        8,
        ADMIN_ADDRESS,
        BErc20USDCDelegate.address,
        '0x0'
    );

    if (network !== "development")
    await verify.etherscanVerify(
        BErc20USDCDelegator,
        network,
        process.env.ETHERSCAN_KEY,
        1
    );
};