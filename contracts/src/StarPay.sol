// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {ILendingPool} from "../node_modules/@starlay-finance/starlay-protocol/contracts/interfaces/ILendingPool.sol";
import {IPancakeRouter01} from "./interfaces/IPancakeRouter01.sol";
import {IERC20} from "./interfaces/IERC20.sol";

/**
 * @dev Contract which provides the functionality to swap and pay debt
 * for the user with debt on Starlay Finance Protocol with any supported tokens
 * on ArthSwap which is a fork of PancakeSwap on Astar Network.
 *
 * The contract is deployed on Astar Network(0xaA5d4E34ba6D8079DCB6982Ef09b1175DE6b3414) and the user can swap and pay debt,
 * currently the user can only pay his variable debt.
 */

contract StarPay {
    IPancakeRouter01 public router;
    ILendingPool public lendingPool;

    event RepayDebt(
        address _tokenA,
        address _tokenB,
        uint256 _amount,
        address indexed _onBehalfOf
    );

    /**
     * @dev Initializes the contract setting the address provided by the deployer for the
     * PancakeSwap Router and Starlay Finance Protocol Lending Pool.
     */
    constructor(address _router, address _lendingPool) {
        router = IPancakeRouter01(_router);
        lendingPool = ILendingPool(_lendingPool);
    }

    /**
     * @dev Swaps the tokenB for tokenA and transfers the tokenA to the user.
     *
     * @param _tokenA The address of the token to be received by the user.
    * @param _tokenB The address of the token to be swapped for tokenA.
    * @param _amountA The amount of tokenA to be received by the user.
    * @param _amountB The amount of tokenB to be swapped for tokenA.
     */

    function swap(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB
    ) public {
        IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);
        IERC20(_tokenB).approve(address(router), _amountB);
        address[] memory path = new address[](2);
        path[0] = _tokenB;
        path[1] = _tokenA;
        router.swapExactTokensForTokens(
            _amountB,
            _amountA,
            path,
            msg.sender,
            block.timestamp + 5000
        );
    }

    /**
     * @dev Pays the debt of the user with the token provided by the user.
     *
     * @param _token The address of the token to be used to pay the debt.
     * @param _amount The amount of token to be used to pay the debt.
     * @param _onBehalfOf The address of the user who wants to pay the debt.
     */

    function payDebt(
        address _token,
        uint256 _amount,
        address _onBehalfOf
    ) public {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        IERC20(_token).approve(address(lendingPool), _amount);
        lendingPool.repay(_token, _amount, 2, _onBehalfOf);
    }

    /**
     * @dev Swaps the tokenB for tokenA and transfers the tokenA to the user and
     * pays the debt of the user with the token provided by the user.
     *
     * @param _tokenA The address of the token to be received by the user.
     * @param _tokenB The address of the token to be swapped for tokenA.
     * @param _amountA The amount of tokenA to be received by the user.
     * @param _amountB The amount of tokenB to be swapped for tokenA.
     * @param _onBehalfOf The address of the user who wants to pay the debt.
     */
    function swapAndPayDebt(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB,
        address _onBehalfOf
    ) public {
        swap(_tokenA, _tokenB, _amountA, _amountB);
        payDebt(_tokenA, _amountA, _onBehalfOf);
        emit RepayDebt(_tokenA, _tokenB, _amountA, _onBehalfOf);
    }
}
