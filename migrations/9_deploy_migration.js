require("dotenv").config();
const verify = require("../src/verify");

const BErc20USDCDelegate = artifacts.require("BErc20USDCDelegate");
const BErc20USDCDelegator = artifacts.require("BErc20USDCDelegator");
const BirdCore = artifacts.require("BirdCore");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying pUSDC
const ADMIN_ADDRESS = "0x6f20FEeECcd51783779Ca10431b60B15f83d06F1"

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
        "pUSDC",
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