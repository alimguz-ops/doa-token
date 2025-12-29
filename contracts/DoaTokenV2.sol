// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract DoaTokenV2 is Initializable, ERC20Upgradeable, OwnableUpgradeable {
    uint8 private _customDecimals;
    bool private _distributed;

    /// @custom:oz-upgrades-validate-as-initializer
    /// @notice Inicializador del proxy V2
    /// @param name Nombre del token
    /// @param symbol Símbolo del token
    /// @param decimals_ Decimales
    /// @param initialOwner Dirección del owner inicial
    function initializeV2(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        address initialOwner
    ) public reinitializer(2) {
        __ERC20_init(name, symbol);
        __Ownable_init(initialOwner); // ✅ ahora con argumento obligatorio
        _customDecimals = decimals_;
    }

    /// @notice Mint controlado por el owner
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @notice Distribución inicial en un solo paso
    function distributeInitial(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(!_distributed, "Already distributed");
        require(recipients.length == amounts.length, "Length mismatch");
        _distributed = true;

        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
        }
    }

    /// @notice Override de decimales para personalizar
    function decimals() public view override returns (uint8) {
        return _customDecimals == 0 ? 18 : _customDecimals;
    }

    /// @notice Permite al owner ajustar los decimales
    function setDecimals(uint8 newDecimals) external onlyOwner {
        _customDecimals = newDecimals;
    }
}