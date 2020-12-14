pragma solidity ^0.5.16;

import "./BErc20.sol";
import "./BToken.sol";
import "./PriceOracle.sol";

interface V1PriceOracleInterface {
    function assetPrices(address asset) external view returns (uint);
}

contract PriceOracleProxy is PriceOracle {
    /// @notice Indicator that this is a PriceOracle contract (for inspection)
    bool public constant isPriceOracle = true;

    /// @notice The v1 price oracle, which will continue to serve prices for v1 assets
    V1PriceOracleInterface public v1PriceOracle;

    /// @notice Address of the guardian, which may set the SAI price once
    address public guardian;

    /// @notice Address of the pUSDC contract, which we hand pick a key for
    address public pUsdcAddress;

    /// @notice Address of the pUSDT contract, which uses the pUSDC price
    address public pUsdtAddress;

    /// @notice Address of the pDAI contract, which we hand pick a key for
    address public pDaiAddress;

    /// @notice Handpicked key for USDC
    address public constant usdcOracleKey = address(1);

    /// @notice Handpicked key for DAI
    address public constant daiOracleKey = address(2);

    /**
     * @param guardian_ The address of the guardian, which may set the SAI price once
     * @param v1PriceOracle_ The address of the v1 price oracle, which will continue to operate and hold prices for collateral assets
     * @param pUsdcAddress_ The address of pUSDC, which will be read from a special oracle key
     * @param pDaiAddress_ The address of pDAI, which will be read from a special oracle key
     * @param pUsdtAddress_ The address of pUSDT, which uses the pUSDC price
     */
    constructor(address guardian_,
                address v1PriceOracle_,
                address pUsdcAddress_,
                address pDaiAddress_,
                address pUsdtAddress_) public {
        guardian = guardian_;
        v1PriceOracle = V1PriceOracleInterface(v1PriceOracle_);

        pUsdcAddress = pUsdcAddress_;
        pDaiAddress = pDaiAddress_;
        pUsdtAddress = pUsdtAddress_;
    }

    /**
     * @notice Get the underlying price of a listed bToken asset
     * @param bToken The bToken to get the underlying price of
     * @return The underlying asset price mantissa (scaled by 1e18)
     */
    function getUnderlyingPrice(BToken bToken) public view returns (uint) {
        address bTokenAddress = address(bToken);

        if (bTokenAddress == pUsdcAddress || bTokenAddress == pUsdtAddress) {
            return v1PriceOracle.assetPrices(usdcOracleKey);
        }

        if (bTokenAddress == pDaiAddress) {
            return v1PriceOracle.assetPrices(daiOracleKey);
        }

        // otherwise just read from v1 oracle
        address underlying = BErc20(bTokenAddress).underlying();
        return v1PriceOracle.assetPrices(underlying);
    }
}