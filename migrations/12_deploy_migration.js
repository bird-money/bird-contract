require("dotenv").config();
const verify = require("../src/verify");

const BErc20Delegate = artifacts.require("BErc20Delegate");
const BErc20Delegator = artifacts.require("BErc20Delegator");
const BirdCore = artifacts.require("BirdCore");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying bUSDT
const ADMIN_ADDRESS = "0xEe9A3468b9c0e6027C096929A4B402Ac4B2FE636"

module.exports = async (deployer, network) => {
    let USDT_TOKEN_ADDRESS;

    if (network === "kovan" || "development") {
        USDT_TOKEN_ADDRESS = "0x327b9f578ff5801f37b4f0f9a36e196caf415113"
    }

    /* Deploy Bird USDT */
    await deployer.deploy(
        BErc20Delegator,
        USDT_TOKEN_ADDRESS,
        BirdCore.address,
        JumpRateModel.address,
        "200000000000000",
        "Bird USDT",
        "bUSDT",
        8,
        ADMIN_ADDRESS,
        BErc20Delegate.address,
        '0x0'
    );

    if (network !== "development")
        await verify.etherscanVerify(
            BErc20Delegator,
            network,
            process.env.ETHERSCAN_KEY,
            1
        );
};