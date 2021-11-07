// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;

import "./Libraries/ERC20Permit.sol";

import "./Libraries/Policy.sol";

contract VaultOwned is Policy {
    
  address internal _vault;

  function setVault( address vault_ ) external onlyPolicy() returns ( bool ) {
    _vault = vault_;

    return true;
  }

  /**
   * @dev Returns the address of the current vault.
   */
  function vault() public view returns (address) {
    return _vault;
  }

  /**
   * @dev Throws if called by any account other than the vault.
   */
  modifier onlyVault() {
    require( _vault == msg.sender, "VaultOwned: caller is not the Vault" );
    _;
  }

}

contract Rome is ERC20Permit, VaultOwned {

  using SafeMath for uint256;

    constructor() ERC20("Rome", "ROME"){
        _setupDecimals(9);
    }

    function mint(address account_, uint256 amount_) external onlyVault() {
        _mint(account_, amount_);
    }

    /**
     * @dev Destroys `amount` tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 amount) public virtual {
        _burn(msg.sender, amount);
    }

    /*
     * @dev Destroys `amount` tokens from `account`, deducting from the caller's
     * allowance.
     *
     * See {ERC20-_burn} and {ERC20-allowance}.
     *
     * Requirements:
     *
     * - the caller must have allowance for ``accounts``'s tokens of at least
     * `amount`.
     */
     
    function burnFrom(address account_, uint256 amount_) public virtual {
        _burnFrom(account_, amount_);
    }

    function _burnFrom(address account_, uint256 amount_) public virtual {
        uint256 decreasedAllowance_ =
            allowance(account_, msg.sender).sub(
                amount_,
                "ERC20: burn amount exceeds allowance"
            );

        _approve(account_, msg.sender, decreasedAllowance_);
        _burn(account_, amount_);
    }
}
