pragma solidity ^0.5.16;

import "./BToken.sol";
import "./PriceOracle.sol";

contract BirdAdminStorage {
    /**
    * @notice Administrator for this contract
    */
    address public admin;

    /**
    * @notice Pending administrator for this contract
    */
    address public pendingAdmin;

    /**
    * @notice Active brains of Bird
    */
    address public implementation;

    /**
    * @notice Pending brains of Bird
    */
    address public pendingImplementation;
}

contract BControllerV1Storage is BirdAdminStorage {

    /**
     * @notice Oracle which gives the price of any given asset
     */
    PriceOracle public oracle;

    /**
     * @notice Multiplier used to calculate the maximum repayAmount when liquidating a borrow
     */
    uint public closeFactorMantissa;

    /**
     * @notice Multiplier representing the discount on collateral that a liquidator receives
     */
    uint public liquidationIncentiveMantissa;

    /**
     * @notice Max number of assets a single account can participate in (borrow or use as collateral)
     */
    uint public maxAssets;

    /**
     * @notice Per-account mapping of "assets you are in", capped by maxAssets
     */
    mapping(address => BToken[]) public accountAssets;

}

contract BControllerV2Storage is BControllerV1Storage {
    struct Market {
        /// @notice Whether or not this market is listed
        bool isListed;

        /**
         * @notice Multiplier representing the most one can borrow against their collateral in this market.
         *  For instance, 0.9 to allow borrowing 90% of collateral value.
         *  Must be between 0 and 1, and stored as a mantissa.
         */
        uint collateralFactorMantissa;

        /// @notice Per-market mapping of "accounts in this asset"
        mapping(address => bool) accountMembership;

        /// @notice Whether or not this market receives BRID+
        bool isBird;
    }

    /**
     * @notice Official mapping of bTokens -> Market metadata
     * @dev Used e.g. to determine if a market is supported
     */
    mapping(address => Market) public markets;


    /**
     * @notice The Pause Guardian can pause certain actions as a safety mechanism.
     *  Actions which allow users to remove their own assets cannot be paused.
     *  Liquidation / seizing / transfer can only be paused globally, not by market.
     */
    address public pauseGuardian;
    bool public _mintGuardianPaused;
    bool public _borrowGuardianPaused;
    bool public transferGuardianPaused;
    bool public seizeGuardianPaused;
    mapping(address => bool) public mintGuardianPaused;
    mapping(address => bool) public borrowGuardianPaused;
}

contract BControllerV3Storage is BControllerV2Storage {
    struct BirdMarketState {
        /// @notice The market's last updated birdBorrowIndex or birdSupplyIndex
        uint224 index;

        /// @notice The block number the index was last updated at
        uint32 block;
    }

    address birdAddress;

    /// @notice A list of all markets
    BToken[] public allMarkets;

    /// @notice The rate at which the flywheel distributes COMP, per block
    uint public birdRate;

    /// @notice The portion of birdRate that each market currently receives
    mapping(address => uint) public birdSpeeds;

    /// @notice The COMP market supply state for each market
    mapping(address => BirdMarketState) public birdSupplyState;

    /// @notice The COMP market borrow state for each market
    mapping(address => BirdMarketState) public birdBorrowState;

    /// @notice The COMP borrow index for each market for each supplier as of the last time they accrued COMP
    mapping(address => mapping(address => uint)) public birdSupplierIndex;

    /// @notice The COMP borrow index for each market for each borrower as of the last time they accrued COMP
    mapping(address => mapping(address => uint)) public birdBorrowerIndex;

    /// @notice The COMP accrued but not yet transferred to each user
    mapping(address => uint) public birdAccrued;
}