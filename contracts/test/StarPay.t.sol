// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "../src/StarPay.sol";
import "../src/interfaces/IPancakeRouter01.sol";
//Lending Pool address: 0xFbBC96E9FfEC5b127876e9B4166598294b8B39f2
//Pancake Router address: 0xE915D2393a08a00c5A463053edD31bAe2199b9e7
//User address : 0xFa00D29d378EDC57AA1006946F0fc6230a5E3288
//tokenA (user debt Token) : 0x75364D4F779d0Bd0facD9a218c67f87dD9Aff3b4
//tokenB (user swap and pay token) : 0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720



contract StarPayTest is Test {
    StarPay public starpay;
    IPancakeRouter01 public router;

    function setUp() public {
        starpay = new StarPay(
            0xE915D2393a08a00c5A463053edD31bAe2199b9e7,
            0x90384334333f3356eFDD5b20016350843b90f182
        );
        router = IPancakeRouter01(0xE915D2393a08a00c5A463053edD31bAe2199b9e7);
    }

    function testSwap(address user) internal {
        address tokenB = 0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720;
        address tokenA = 0x75364D4F779d0Bd0facD9a218c67f87dD9Aff3b4;
        uint256 amount = 1.73e18;
        address[] memory path = new address[](2);
        path[0] = tokenB;
        path[1] = tokenA;
        uint256[] memory amountsIn = router.getAmountsIn(amount, path);
        console.log(amountsIn[0]);
        console.log(
            "Token A:",
            IERC20(tokenA).balanceOf(user),
            "Token B:",
            IERC20(tokenB).balanceOf(user)
        );
        IERC20(tokenB).approve(address(starpay), amountsIn[0]);
        starpay.swap(tokenA, tokenB, amount, amountsIn[0]);
        console.log(
            "Token A:",
            IERC20(tokenA).balanceOf(user),
            "Token B:",
            IERC20(tokenB).balanceOf(user)
        );
    }
    function testSwapAsDifferentUser() public {
        address differentUser = address(
            0xFa00D29d378EDC57AA1006946F0fc6230a5E3288
        );
        vm.startPrank(differentUser);
        testSwap(differentUser);

        vm.stopPrank();
    }

    function testPayDebt() public {
        address differentUser = address(
            0xFa00D29d378EDC57AA1006946F0fc6230a5E3288
        );
        vm.startPrank(differentUser);
        IERC20(0x75364D4F779d0Bd0facD9a218c67f87dD9Aff3b4).approve(
            address(starpay),
            1e18
        );
        starpay.payDebt(0x75364D4F779d0Bd0facD9a218c67f87dD9Aff3b4, 1e18,differentUser);
        vm.stopPrank();
    }

    function testSwapAndPayDebt() public {
        address user = address(
            0xFa00D29d378EDC57AA1006946F0fc6230a5E3288
        );
        vm.startPrank(user);
        address tokenB = 0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720;
        address tokenA = 0x75364D4F779d0Bd0facD9a218c67f87dD9Aff3b4;
        uint256 amount = 1e18;
        address[] memory path = new address[](2);
        path[0] = tokenB;
        path[1] = tokenA;
        uint256[] memory amountsIn = router.getAmountsIn(amount, path);
        console.log(amountsIn[0]);
        console.log(
            "Token A:",
            IERC20(tokenA).balanceOf(user),
            "Token B:",
            IERC20(tokenB).balanceOf(user)
        );
        IERC20(tokenB).approve(address(starpay), amountsIn[0]);
        IERC20(0x75364D4F779d0Bd0facD9a218c67f87dD9Aff3b4).approve(
            address(starpay),
            1e18
        );
        starpay.swapAndPayDebt(
            0x75364D4F779d0Bd0facD9a218c67f87dD9Aff3b4,
            0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720,
            1e18,
            amountsIn[0],
            user
        );
        console.log(
            "Token A:",
            IERC20(tokenA).balanceOf(user),
            "Token B:",
            IERC20(tokenB).balanceOf(user)
        );
        vm.stopPrank();
    }

}
