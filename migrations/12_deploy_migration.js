require("dotenv").config();
const verify = require("../src/verify");

const BErc20Delegate = artifacts.require("BErc20Delegate");
const BErc20Delegator = artifacts.require("BErc20Delegator");
const BirdCore = artifacts.require("BirdCore");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying pUSDT
const ADMIN_ADDRESS = "0x6f20FEeECcd51783779Ca10431b60B15f83d06F1"

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
        "pUSDT",
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