// SPDX-License-Identifier: MIT

pragma solidity 0.8.3;

import "@openzeppelin/contracts/security/Pausable.sol";
import "./ERC20Vestable.sol";

/**
 * @title XNLToken
 * @dev Implementation of ERC20Token using Standard token from OpenZeppelin library
 * with ability to pause transfers, approvals and set vesting period for owner until ownership is renounced. 
 * All token are assigned to owner.
 */
 
contract XNLToken is ERC20Vestable, Pausable {

    uint public INITIAL_SUPPLY = 100000000 * (uint(10) ** 18); // 100,000,000 XNL

    constructor() ERC20("Chronical","XNL") {
        _mint(_msgSender(), INITIAL_SUPPLY);
    }

    function pause() onlyOwner() external  {
        _pause();
    }

    function unpause() onlyOwner() external {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override whenNotPaused {
        require(to != address(this), "ERC20: transfer to the contract address");
        super._beforeTokenTransfer(from, to, amount);
    }

    function approve(address spender, uint256 amount) public virtual override whenNotPaused returns (bool) {
        return super.approve(spender, amount);
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual override whenNotPaused returns (bool)  {
        return super.increaseAllowance(spender, addedValue);
    }

    function decreaseAllowance(address spender, uint256 addedValue) public virtual override whenNotPaused returns (bool)  {
        return super.decreaseAllowance(spender, addedValue);
    }

}