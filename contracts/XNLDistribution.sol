// SPDX-License-Identifier: MIT

pragma solidity 0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract XNLDistribution is Ownable, Pausable {
    address private _tokenAddress;

    constructor(address tokenAddress) {
        _tokenAddress = tokenAddress;
    }

    function distribute(address[] memory _accounts, uint256[] memory _amountsInXNL) public {
        require(_accounts.length == _amountsInXNL.length);
        IERC20 _token = IERC20(_tokenAddress);
        for (uint256 i = 0; i < _accounts.length; i++) {
            if (_accounts[i] != address(0x0)) {
                _token.transferFrom(msg.sender,_accounts[i], _amountsInXNL[i] * 10**18);
            }
        }
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function recoverERC20(address tokenAddress, uint256 tokenAmount)
        public
        virtual
        onlyOwner
        whenNotPaused
    {
        IERC20(tokenAddress).transfer(msg.sender, tokenAmount);
    }
}
