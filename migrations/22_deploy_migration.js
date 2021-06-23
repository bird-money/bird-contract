require("dotenv").config();
const verify = require("../src/verify");

const BErc20BIRDDelegate = artifacts.require("BErc20BIRDDelegate");
const BErc20BIRDDelegator = artifacts.require("BErc20BIRDDelegator");
const BirdCore = artifacts.require("BirdCore");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying bBIRD
const ADMIN_ADDRESS = "0x60b6a57b71f23a8c602eD71b60272FdA321D2666";

module.exports = async (deployer, network) => {
  let BIRD_TOKEN_ADDRESS = "0x2646fd659e961164bf9de7c7131a651c020b325c";

  /* Deploy Bird BIRD */
  /*await deployer.deploy(
    BErc20BIRDDelegator,
    BIRD_TOKEN_ADDRESS,
    BirdCore.address,
    JumpRateModel.address,
    "200000000000000000000000000",
    "Bird BIRD",
    "bBIRD",
    8,
    ADMIN_ADDRESS,
    BErc20BIRDDelegate.address,
    "0x0"
  );

  if (network !== "development")
    await verify.bscscanVerify(
      BErc20BIRDDelegator,
      network,
      process.env.BSCSCANAPIKEY,
      1
    ); */
};
