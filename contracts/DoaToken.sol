// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract DoaToken is Initializable, ERC20Upgradeable, OwnableUpgradeable {
    uint8 private _customDecimals;

    /// @notice Inicializador del proxy
    /// @param name Nombre del token
    /// @param symbol Símbolo del token
    /// @param decimals_ Decimales
    /// @param initialSupply Supply inicial en unidades enteras (ej: 1_000_000)
    /// @param initialOwner Dirección del owner inicial
    function initialize(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        uint256 initialSupply,
        address initialOwner
    ) public initializer {
        __ERC20_init(name, symbol);
        __Ownable_init(initialOwner);

        // Guardar decimales personalizados
        _customDecimals = decimals_;

        // Mint supply inicial al owner
        _mint(initialOwner, initialSupply * (10 ** decimals_));
    }

    /// @notice Override de decimales para personalizar
    function decimals() public view override returns (uint8) {
        return _customDecimals == 0 ? 18 : _customDecimals;
    }

    function setDecimals(uint8 newDecimals) external onlyOwner {
        _customDecimals = newDecimals;
    }
}
