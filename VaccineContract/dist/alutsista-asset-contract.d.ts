import { Context, Contract } from 'fabric-contract-api';
import { AlutsistaAsset } from './alutsista-asset';
export declare class AlutsistaAssetContract extends Contract {
    alutsistaAssetExists(ctx: Context, alutsistaAssetId: string): Promise<boolean>;
    createAlutsistaAsset(ctx: Context, alutsistaAssetId: string, name: string, model: string, year: number): Promise<void>;
    readAlutsistaAsset(ctx: Context, alutsistaAssetId: string): Promise<AlutsistaAsset>;
    updateAlutsistaAsset(ctx: Context, alutsistaAssetId: string, name: string, model: string, year: number): Promise<void>;
    deleteAlutsistaAsset(ctx: Context, alutsistaAssetId: string): Promise<void>;
    queryAllAssets(ctx: Context): Promise<string>;
    queryByMaker(ctx: Context, maker: string): Promise<string>;
    queryByMinYear(ctx: Context, min: number, size: number, bookmark?: string): Promise<string>;
    getHistoryByKey(ctx: Context, alutsistaAssetId: string): Promise<string>;
    hasRole(ctx: Context, roles: string[]): Promise<boolean>;
}
