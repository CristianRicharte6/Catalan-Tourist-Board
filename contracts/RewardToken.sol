// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RewardToken
 * @dev ERC20 token allowing rewards, enabling minting and burning tokens.
 */
contract RewardToken is ERC20, Ownable {
    event Minted(address indexed from, address indexed to, uint256 amount);
    event Burned(address indexed from, address indexed to, uint256 amount);

    /**
     * @dev Initializes the token with a name and symbol.
     * @param _name The name of the token.
     * @param _symbol The symbol of the token.
     */
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) Ownable(msg.sender) {}

    /**
     * @dev Mints a specific amount of tokens to an address.
     * @param _to The address receiving the minted tokens.
     * @param _amount The amount of tokens to mint.
     */
    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
        emit Minted(address(0x0), _to, _amount);
    }

    /**
     * @dev Burns a specific amount of tokens.
     * @param _amount The amount of tokens to burn.
     */
    function burn(uint256 _amount) external onlyOwner {
        _burn(msg.sender, _amount);
        emit Burned(msg.sender, address(0x0), _amount);
    }
}
