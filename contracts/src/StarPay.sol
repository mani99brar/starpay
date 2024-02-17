// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {ILendingPool} from "../node_modules/@starlay-finance/starlay-protocol/contracts/interfaces/ILendingPool.sol";
import {IPancakeRouter01} from "./interfaces/IPancakeRouter01.sol";
import {IERC20} from "./interfaces/IERC20.sol";
contract StarPay {
    IPancakeRouter01 public router;
    ILendingPool public lendingPool;

    constructor(address _router, address _lendingPool) {
        router = IPancakeRouter01(_router);
        lendingPool = ILendingPool(_lendingPool);
    }

    function swap(address _tokenA,address _tokenB,uint256 _amountA,uint256 _amountB) public {
        IERC20(_tokenB).transferFrom(msg.sender,address(this), _amountB);
        IERC20(_tokenB).approve(address(router), _amountB);
        address[] memory path = new address[](2);
        path[0] = _tokenB;
        path[1] = _tokenA;
        router.swapExactTokensForTokens(_amountB, _amountA, path, msg.sender, block.timestamp+5000);
    }

    function payDebt(address _token,uint256 _amount,address _onBehalfOf) public {
        IERC20(_token).transferFrom(msg.sender,address(this), _amount);
        IERC20(_token).approve(address(lendingPool), _amount);
        lendingPool.repay(_token, _amount, 2, _onBehalfOf);
    }

    function swapAndPayDebt(address _tokenA,address _tokenB,uint256 _amountA,uint256 _amountB,address _onBehalfOf) public {
        swap(_tokenA, _tokenB, _amountA, _amountB);
        payDebt(_tokenA, _amountA,_onBehalfOf);
    }
}
