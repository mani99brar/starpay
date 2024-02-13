export type UserReserveData = {
    currentLTokenBalance: BigInt;
    currentStableDebt: BigInt;
    currentVariableDebt: BigInt;
    liquidityRate: BigInt;
    principalStableDebt: BigInt;
    scaledVariableDebt: BigInt;
    stableBorrowRate: BigInt;
    stableRateLastUpdated: number;
    usageAsCollateralEnabled: boolean;
}