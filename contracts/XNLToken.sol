// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "../node_modules/@openzeppelin/contracts/security/Pausable.sol";
import "./ERC20Vestable.sol";

/**
 * @title XNLToken
 * @dev Implementation of ERC20Token using Standard token from OpenZeppelin library
 * with ability to pause transfers, approvals and set vesting period for owner until ownership is renounced. 
 * All token are assigned to owner.
 */
 
contract XNLToken is ERC20Vestable, Pausable {

    string public constant SYMBOL = "XNL";
    string public constant NAME = "Chronicals";
    uint8 public constant DECIMALS = 18;
    uint public INITIAL_SUPPLY = 100000000 * (uint(10) ** DECIMALS); // 350,000,000 SKYM

    constructor() ERC20(NAME, SYMBOL) {
        _mint(_msgSender(), INITIAL_SUPPLY);
    }

        /**
     * @dev Allow only the owner to burn tokens from the owner's wallet, also decreasing the total
     * supply. There is no reason for a token holder to EVER call this method directly. It will be
     * used by the future CPUcoin ecosystem token contract to implement IEO token redemption.
     */
    // function burn(uint256 value) onlyIfFundsAvailableNow(msg.sender, value) public override {
    //     // This is the only place where we ever burn tokens.
    //     _burn(msg.sender, value);
    // }

    function pause() onlyOwner() external  {
        _pause();
    }

    function unpause() onlyOwner() external {
        _unpause();
    }

    
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        require(!paused(), "ERC20Pausable: token transfer while paused");
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


    // function mint(address to, uint256 amount) public {
    //     _mint(to, amount);
    // }

}