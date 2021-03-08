require("dotenv").config();
const verify = require("../src/verify");

const BErc20WBTCDelegate = artifacts.require("BErc20WBTCDelegate");
const BErc20WBTCDelegator = artifacts.require("BErc20WBTCDelegator");
const BirdCore = artifacts.require("BirdCore");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying bWBTC
const ADMIN_ADDRESS = "0x60b6a57b71f23a8c602eD71b60272FdA321D2666"

module.exports = async (deployer, network) => {
    let WBTC_TOKEN_ADDRESS = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";

    // if (network === "kovan" || "development") {
    //     WBTC_TOKEN_ADDRESS = "0xd3A691C852CDB01E281545A27064741F0B7f6825"
    // }else if (network === "mainnet") {
    //     WBTC_TOKEN_ADDRESS = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";
    // }

    /* Deploy Bird WBTC */
    await deployer.deploy(
        BErc20WBTCDelegator,
        WBTC_TOKEN_ADDRESS,
        BirdCore.address,
        JumpRateModel.address,
        "20000000000000000",
        "Bird WBTC",
        "bWBTC",
        8,
        ADMIN_ADDRESS,
        BErc20WBTCDelegate.address,
        '0x0'
    );

    if (network !== "development")
    await verify.etherscanVerify(
        BErc20WBTCDelegator,
        network,
        process.env.ETHERSCAN_KEY,
        1
    );
};