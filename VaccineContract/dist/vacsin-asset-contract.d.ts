import { Context, Contract } from 'fabric-contract-api';
import { VaccineAsset } from './vaccine-asset';
export declare class VaccineAssetContract extends Contract {
    initLedger(ctx: Context): Promise<void>;
    vaccineAssetExists(ctx: Context, KTPID: string): Promise<boolean>;
    createVaccineAsset(ctx: Context, KTPID: string, nama: string, jenisKelamin: string, alamat: string, status: string, cert: string, tglvac: string, fac: string): Promise<void>;
    readVaccineAsset(ctx: Context, KTPID: string): Promise<VaccineAsset>;
    updateVaccineAsset(ctx: Context, KTPID: string, nama: string, jenisKelamin: string, alamat: string, status: string, cert: string, tglvac: string, fac: string): Promise<void>;
    deleteVaccineAsset(ctx: Context, KTPID: string): Promise<void>;
    queryAllAssets(ctx: Context): Promise<string>;
    getHistoryByKey(ctx: Context, KTPID: string): Promise<string>;
    changeStatus(ctx: Context, KTPID: string, newstatus: string, newcert: string, newtglvac: string, newfac: string): Promise<void>;
    hasRole(ctx: Context, roles: string[]): Promise<boolean>;
}
