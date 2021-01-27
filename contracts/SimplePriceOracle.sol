pragma solidity ^0.5.16;

import "./PriceOracle.sol";
import "./BErc20.sol";

contract SimplePriceOracle is PriceOracle {
    address public admin;
    address public pendingAdmin;
    mapping(address => uint) prices;
    event PricePosted(address asset, uint previousPriceMantissa, uint requestedPriceMantissa, uint newPriceMantissa);

    constructor() public {
        admin = msg.sender;
    }

    function getUnderlyingPrice(BToken bToken) public view returns (uint) {
        if (compareStrings(bToken.symbol(), "bETH")) {
            return 1e18;
        } else {
            return prices[address(BErc20(address(bToken)).underlying())];
        }
    }

    function setUnderlyingPrice(BToken bToken, uint underlyingPriceMantissa) public {
        // Check caller = admin
        require(msg.sender == admin);

        address asset = address(BErc20(address(bToken)).underlying());
        emit PricePosted(asset, prices[asset], underlyingPriceMantissa, underlyingPriceMantissa);
        prices[asset] = underlyingPriceMantissa;
    }

    function setDirectPrice(address asset, uint price) public {
        // Check caller = admin
        require(msg.sender == admin);

        emit PricePosted(asset, prices[asset], price, price);
        prices[asset] = price;
    }

    // v1 price oracle interface for use as backing of proxy
    function assetPrices(address asset) external view returns (uint) {
        return prices[asset];
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function _setPendingAdmin(address newPendingAdmin) public {
        // Check caller = admin
        require(msg.sender == admin);

        // Store pendingAdmin with value newPendingAdmin
        pendingAdmin = newPendingAdmin;
    }

    function _acceptAdmin() public {
        // Check caller is pendingAdmin and pendingAdmin ≠ address(0)
        require(msg.sender == pendingAdmin && msg.sender != address(0));

        // Store admin with value pendingAdmin
        admin = pendingAdmin;

        // Clear the pending value
        pendingAdmin = address(0);
    }
}