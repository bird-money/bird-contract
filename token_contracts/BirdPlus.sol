// SPDX-License-Identifier: MIT

pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/TokenTimelock.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol";

contract BirdPlus {
    
    using SafeMath for uint256;

    /// @notice EIP-20 token name for this token
    string public constant name = "Bird+";

    /// @notice EIP-20 token symbol for this token
    string public constant symbol = "BIRD+";

    /// @notice EIP-20 token decimals for this token
    uint8 public constant decimals = 18;

    /// @notice Total number of tokens in circulation
    uint256 public constant totalSupply = 10000000e18; // 10 million BirdPlus

    uint256 public constant marketDistributionPercentage = 50; // Tokens % to suppliers and borrowers: 2.5M each (Total: 5M)
    uint256 public constant foundersPercentage = 10; // Token % to Founders: 1M (2 years vesting)
    uint256 public constant investorsPercentage = 10; // Token % to Investors: 1M (2 years vesting)
    uint256 public constant advisorsPercentage = 10; // Token % to Advisors: 1M (2 years vesting)
    uint256 public constant employeesPercentage = 10; // Token % to employees: 1M (2 years vesting)
    uint256 public constant reservedPercentage = 10; // Token % reserved on Protocol
    
    TokenTimelock public founderTimelock;   // Founder timelock contract
    TokenTimelock public investorTimelock;  // Investor timelock contract
    TokenTimelock public advisorTimelock;   // Advisor timelock contract
    TokenTimelock public employeeTimelock;  // Employee timelock contract
    
    address public foundersFund;    // Founder escrow address
    address public investorsFund;   // Investor escrow address
    address public advisorsFund;    // Advisor escrow address
    address public employeesFund;   // Employee escrow address
    
    address public marketDistributionFund;  // BirdCore address: distributed the tokens on the market's user
    
    address public protocolAddress;         // Protocol account that holds the reserved tokens
    
    // Vesting schedules: Releases the tokens to respective group after this releaseTime
    uint256 public releaseTime;
    
    /// @dev Allowance amounts on behalf of others
    mapping (address => mapping (address => uint256)) internal allowances;

    /// @dev Official record of token balances for each account
    mapping (address => uint256) internal balances;

    /// @notice The standard EIP-20 transfer event
    event Transfer(address indexed from, address indexed to, uint256 amount);

    /// @notice The standard EIP-20 approval event
    event Approval(address indexed owner, address indexed spender, uint256 amount);

    /**
     * @notice Construct a new BirdPlus token
     * @param account The initial Protocol account that hold the reserved tokens
     * @param marketDistributionFund_ The BirdCore address that hold the market distribution tokens
     * @param foundersFund_ The founder escrow address that hold the founders tokens
     * @param investorsFund_ The investor escrow address that hold the investors tokens
     * @param advisorsFund_ The advisor escrow address that hold the advisors tokens
     * @param employeesFund_ The employee escrow address that hold the employees tokens
     * @param releaseTime_ The locktime for founders, investors, advisors and employees tokens
     */
    constructor(address account, address marketDistributionFund_, address foundersFund_, address investorsFund_, address advisorsFund_, address employeesFund_, uint256 releaseTime_) public {
        protocolAddress = account;

        marketDistributionFund = marketDistributionFund_;
        foundersFund = foundersFund_;
        investorsFund = investorsFund_;
        advisorsFund = advisorsFund_;
        employeesFund = employeesFund_;
        releaseTime = releaseTime_;

        founderTimelock = new TokenTimelock(IERC20(address(this)), foundersFund, releaseTime);
        investorTimelock = new TokenTimelock(IERC20(address(this)), investorsFund, releaseTime);
        advisorTimelock = new TokenTimelock(IERC20(address(this)), advisorsFund, releaseTime);
        employeeTimelock = new TokenTimelock(IERC20(address(this)), employeesFund, releaseTime);
        
        balances[address(founderTimelock)] = totalSupply.mul(foundersPercentage).div(100);           // allocating 1M tokens
        balances[address(investorTimelock)] = totalSupply.mul(investorsPercentage).div(100);         // allocating 1M tokens
        balances[address(advisorTimelock)] = totalSupply.mul(advisorsPercentage).div(100);           // allocating 1M tokens
        balances[address(employeeTimelock)] = totalSupply.mul(employeesPercentage).div(100);         // allocating 1M tokens
        
        balances[marketDistributionFund] = totalSupply.mul(marketDistributionPercentage).div(100);   // allocating 5M tokens (2.5M each for suppliers and borrowers)
        balances[protocolAddress] = totalSupply.mul(reservedPercentage).div(100);                    // allocating 1M tokens
    }

    /**
     * @notice Get the number of tokens `spender` is approved to spend on behalf of `account`
     * @param account The address of the account holding the funds
     * @param spender The address of the account spending the funds
     * @return The number of tokens approved
     */
    function allowance(address account, address spender) external view returns (uint) {
        return allowances[account][spender];
    }

    /**
     * @notice Approve `spender` to transfer up to `amount` from `src`
     * @dev This will overwrite the approval amount for `spender`
     *  and is subject to issues noted [here](https://eips.ethereum.org/EIPS/eip-20#approve)
     * @param spender The address of the account which may transfer tokens
     * @param amount The number of tokens that are approved (2^256-1 means infinite)
     * @return Whether or not the approval succeeded
     */
    function approve(address spender,  uint256 amount) external returns (bool) {
        allowances[msg.sender][spender] = amount;

        emit Approval(msg.sender, spender, amount);
        return true;
    }

    /**
     * @notice Get the number of tokens held by the `account`
     * @param account The address of the account to get the balance of
     * @return The number of tokens held
     */
    function balanceOf(address account) external view returns (uint) {
        return balances[account];
    }

    /**
     * @notice Transfer `amount` tokens from `msg.sender` to `dst`
     * @param dst The address of the destination account
     * @return Whether or not the transfer succeeded
     */
    function transfer(address dst, uint256 amount) external returns (bool) {
        _transferTokens(msg.sender, dst, amount);
        return true;
    }

    /**
     * @notice Transfer `amount` tokens from `src` to `dst`
     * @param src The address of the source account
     * @param dst The address of the destination account
     * @param amount The number of tokens to transfer
     * @return Whether or not the transfer succeeded
     */
    function transferFrom(address src, address dst, uint256 amount) external returns (bool) {
        address spender = msg.sender;
        uint256 spenderAllowance = allowances[src][spender];

        if (spender != src && spenderAllowance != uint256(-1)) {
            uint256 newAllowance = spenderAllowance.sub(amount);
            allowances[src][spender] = newAllowance;

            emit Approval(src, spender, newAllowance);
        }

        _transferTokens(src, dst, amount);
        return true;
    }

    function _transferTokens(address src, address dst, uint256 amount) internal {
        require(src != address(0), "BirdPlus::_transferTokens: cannot transfer from the zero address");
        require(dst != address(0), "BirdPlus::_transferTokens: cannot transfer to the zero address");

        balances[src] = balances[src].sub(amount);
        balances[dst] = balances[dst].add(amount);
        emit Transfer(src, dst, amount);
    }
    
    /**
     * @notice Transfers tokens held by timelock to founder address.
     */
    function releaseFounderFund() external returns (bool) {
        founderTimelock.release();
        return true;
    }
    
    /**
     * @notice Transfers tokens held by timelock to investor address.
     */
    function releaseInvestorFund() external returns (bool) {
        investorTimelock.release();
        return true;
    }
    
    /**
     * @notice Transfers tokens held by timelock to advisor address.
     */
    function releaseAdvisorFund() external returns (bool) {
        advisorTimelock.release();
        return true;
    }
    
    /**
     * @notice Transfers tokens held by timelock to employees address.
     */
    function releaseEmployeeFund() external returns (bool) {
        employeeTimelock.release();
        return true;
    }
}