require("dotenv").config();
const verify = require("../src/verify");

const BErc20BATDelegate = artifacts.require("BErc20BATDelegate");
const BErc20BATDelegator = artifacts.require("BErc20BATDelegator");
const BirdCore = artifacts.require("BirdCore");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying bBAT
const ADMIN_ADDRESS = "0x60b6a57b71f23a8c602eD71b60272FdA321D2666";

module.exports = async (deployer, network) => {
  let BAT_TOKEN_ADDRESS = "0x9C222c2bBb317cAB4103dE8D7b0D273b5e949321";

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
    "0x0"
  );

  if (network !== "development")
    await verify.bscscanVerify(
      BErc20BATDelegator,
      network,
      process.env.BSCSCANAPIKEY,
      1
    );
};
