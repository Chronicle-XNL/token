// SPDX-License-Identifier: MIT

pragma solidity 0.8.3;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract VerifiedAccount is ERC20, Ownable {

    mapping(address => bool) private _isRegistered;

    constructor () {
        // The smart contract starts off registering itself, since address is known.
        registerAccount();
    }

    event AccountRegistered(address indexed account);

    /**
     * This registers the calling wallet address as a known address. Operations that transfer responsibility
     * may require the target account to be a registered account, to protect the system from getting into a
     * state where administration or a large amount of funds can become forever inaccessible.
     */
    function registerAccount() public {
        _isRegistered[msg.sender] = true;
        emit AccountRegistered(msg.sender);
    }

    function isRegistered(address account) public view returns (bool ok) {
        return _isRegistered[account];
    }

    function _accountExists(address account) internal view returns (bool exists) {
        return account == msg.sender || _isRegistered[account];
    }

    modifier onlyExistingAccount(address account) {
        require(_accountExists(account), "account not registered");
        _;
    }
    
    modifier onlyOwnerOrSelf(address account) {
        require(owner() == _msgSender() || msg.sender == account, "onlyOwnerOrSelf");
        _;
    }

    // =========================================================================
    // === Safe ERC20 methods
    // =========================================================================

    function safeTransfer(address to, uint256 value) public onlyExistingAccount(to) returns (bool ok) {
        require(transfer(to, value), "error in transfer");
        return true;
    }

    function safeApprove(address spender, uint256 value) public onlyExistingAccount(spender) returns (bool ok) {
        require(approve(spender, value), "error in approve");
        return true;
    }

    function safeTransferFrom(address from, address to, uint256 value) public onlyExistingAccount(to) returns (bool ok) {
        require(transferFrom(from, to, value), "error in transferFrom");
        return true;
    }


    // =========================================================================
    // === Safe ownership transfer
    // =========================================================================

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public override onlyExistingAccount(newOwner) onlyOwner {
        super.transferOwnership(newOwner);
    }
}
