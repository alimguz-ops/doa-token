// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title DOA Token
 * @dev ERC20 token con soporte para proxy y upgradeability
 */
contract DoaToken is Initializable, ERC20Upgradeable, OwnableUpgradeable {
    uint8 private _decimals;

    function initialize(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        address owner_
    ) public initializer {
        __ERC20_init(name_, symbol_);
        __Ownable_init(owner_);
        _decimals = decimals_;
        _mint(owner_, initialSupply_);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}
