import { UserReserveData } from "./userReserveData";
import { Token } from "./token";
export type UserAllReserveData = {
    [symbol: string]: UserReserveData;
}