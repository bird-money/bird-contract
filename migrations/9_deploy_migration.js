require("dotenv").config();
const verify = require("../src/verify");

const BErc20USDCDelegate = artifacts.require("BErc20USDCDelegate");
const BErc20USDCDelegator = artifacts.require("BErc20USDCDelegator");
const BirdCore = artifacts.require("BirdCore");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying bUSDC
const ADMIN_ADDRESS = "0x60b6a57b71f23a8c602eD71b60272FdA321D2666";

module.exports = async (deployer, network) => {
  let USDC_TOKEN_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

  //   if (network === "kovan" || "development") {
  //     USDC_TOKEN_ADDRESS = "0xb7a4F3E9097C08dA09517b5aB877F7a917224ede";
  //   } else if (network === "mainnet") {
  //     USDC_TOKEN_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  //   }

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
    "0x0"
  );

  if (network !== "development")
    await verify.etherscanVerify(
      BErc20USDCDelegator,
      network,
      process.env.ETHERSCAN_KEY,
      1
    );
};
