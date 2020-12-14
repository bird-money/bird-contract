pragma solidity ^0.5.16;

/**
  * @title Bird's BController Interface
  */
contract BControllerInterface {
    /// @notice Indicator that this is a BController contract (for inspection)
    bool public constant isBController = true;

    /*** Assets You Are In ***/

    function enterMarkets(address[] calldata bTokens) external returns (uint[] memory);
    function exitMarket(address bToken) external returns (uint);

    /*** Policy Hooks ***/

    function mintAllowed(address bToken, address minter, uint mintAmount) external returns (uint);
    function mintVerify(address bToken, address minter, uint mintAmount, uint mintTokens) external;

    function redeemAllowed(address bToken, address redeemer, uint redeemTokens) external returns (uint);
    function redeemVerify(address bToken, address redeemer, uint redeemAmount, uint redeemTokens) external;

    function borrowAllowed(address bToken, address borrower, uint borrowAmount) external returns (uint);
    function borrowVerify(address bToken, address borrower, uint borrowAmount) external;

    function repayBorrowAllowed(address bToken, address payer, address borrower, uint repayAmount) external returns (uint);
    function repayBorrowVerify(address bToken, address payer, address borrower, uint repayAmount, uint borrowerIndex) external;

    function liquidateBorrowAllowed(address bTokenBorrowed, address bTokenCollateral, address liquidator, address borrower, uint repayAmount) external returns (uint);
    function liquidateBorrowVerify(address bTokenBorrowed, address bTokenCollateral, address liquidator, address borrower, uint repayAmount, uint seizeTokens) external;

    function seizeAllowed(address bTokenCollateral, address bTokenBorrowed, address liquidator, address borrower, uint seizeTokens) external returns (uint);
    function seizeVerify(address bTokenCollateral, address bTokenBorrowed, address liquidator, address borrower, uint seizeTokens) external;

    function transferAllowed(address bToken, address src, address dst, uint transferTokens) external returns (uint);
    function transferVerify(address bToken, address src, address dst, uint transferTokens) external;

    /*** Liquidity/Liquidation Calculations ***/

    function liquidateCalculateSeizeTokens(address bTokenBorrowed, address bTokenCollateral, uint repayAmount) external view returns (uint, uint);
}