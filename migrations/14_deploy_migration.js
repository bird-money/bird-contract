require("dotenv").config();
const verify = require("../src/verify");

const BErc20BATDelegate = artifacts.require("BErc20BATDelegate");
const BErc20BATDelegator = artifacts.require("BErc20BATDelegator");
const BirdCore = artifacts.require("BirdCore");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying bBAT
const ADMIN_ADDRESS = "0xEe9A3468b9c0e6027C096929A4B402Ac4B2FE636"

module.exports = async (deployer, network) => {
    let BAT_TOKEN_ADDRESS;

    if (network === "kovan" || "development") {
        BAT_TOKEN_ADDRESS = "0x4Ee3f6d2eb7Eb5BBCd6A45c3398802cb42931abd"
    }

    /* Deploy Bird BAT */
    await deployer.deploy(
        BErc20BATDelegator,
        BAT_TOKEN_ADDRESS,
        BirdCore.address,
        JumpRateModel.address,
        "200000000000000000000000000",
        "Bird BAT",
        "bBAT",
        8,
        ADMIN_ADDRESS,
        BErc20BATDelegate.address,
        '0x0'
    );

    if (network !== "development")
    await verify.etherscanVerify(
        BErc20BATDelegator,
        network,
        process.env.ETHERSCAN_KEY,
        1
    );
};