"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaccineAssetContract = void 0;
/*
 * SPDX-License-Identifier: Apache-2.0
 */
const fabric_contract_api_1 = require("fabric-contract-api");
const vaccine_asset_1 = require("./vaccine-asset");
const uuidv4_1 = require("uuidv4");
let VaccineAssetContract = class VaccineAssetContract extends fabric_contract_api_1.Contract {
    //add sample transaction
    async initLedger(ctx) {
        const data = [
            {
                nama: 'Fahmi',
                jenisKelamin: 'Pria',
                alamat: 'Jl Jendral Sudirman no 1',
                status: '',
                cert: uuidv4_1.uuid(),
                tglvac: '',
                fac: '',
                remark: ''
            },
            {
                nama: 'Mifah',
                jenisKelamin: 'Pria',
                alamat: 'Jl Jendral Sudirman no 2',
                status: '',
                cert: uuidv4_1.uuid(),
                tglvac: '',
                fac: '',
                remark: ''
            },
            {
                nama: 'Imfha',
                jenisKelamin: 'Wanita',
                alamat: 'Jl Jendral Sudirman no 3',
                status: '',
                cert: uuidv4_1.uuid(),
                tglvac: '',
                fac: '',
                remark: ''
            },
            {
                nama: 'Ahmif',
                jenisKelamin: 'Wanita',
                alamat: 'Jl Jendral Sudirman no 4',
                status: '',
                cert: uuidv4_1.uuid(),
                tglvac: '',
                fac: '',
                remark: ''
            }
        ];
        for (let i = 0; i < data.length; i++) {
            await ctx.stub.putState('0' + i, Buffer.from(JSON.stringify(data[i])));
        }
    }
    async vaccineAssetExists(ctx, KTPID) {
        const buffer = await ctx.stub.getState(KTPID);
        return (!!buffer && buffer.length > 0);
    }
    async createVaccineAsset(ctx, KTPID, nama, jenisKelamin, alamat, status, cert, tglvac, fac) {
        const hasAccess = await this.hasRole(ctx, ['Gov']);
        if (!hasAccess) {
            throw new Error(`Only Gov can create vaccine asset`);
        }
        const exists = await this.vaccineAssetExists(ctx, KTPID);
        if (exists) {
            throw new Error(`The vaccine asset ${KTPID} already exists`);
        }
        const vaccineAsset = new vaccine_asset_1.VaccineAsset();
        vaccineAsset.nama = nama;
        vaccineAsset.jenisKelamin = jenisKelamin;
        vaccineAsset.alamat = alamat;
        vaccineAsset.status = status;
        vaccineAsset.cert = cert;
        vaccineAsset.tglvac = tglvac;
        vaccineAsset.fac = fac;
        const buffer = Buffer.from(JSON.stringify(vaccineAsset));
        await ctx.stub.putState(KTPID, buffer);
        const transientMap = ctx.stub.getTransient();
        if (transientMap.get('remark')) {
            await ctx.stub.putPrivateData('productionRemark', KTPID, transientMap.get('remark'));
        }
    }
    async readVaccineAsset(ctx, KTPID) {
        const exists = await this.vaccineAssetExists(ctx, KTPID);
        if (!exists) {
            throw new Error(`The vaccine asset ${KTPID} does not exist`);
        }
        const buffer = await ctx.stub.getState(KTPID);
        const vaccineAsset = JSON.parse(buffer.toString());
        try {
            const privBuffer = await ctx.stub.getPrivateData('productionRemark', KTPID);
            vaccineAsset.remark = privBuffer.toString();
            return vaccineAsset;
        }
        catch (error) {
            return vaccineAsset;
        }
    }
    async updateVaccineAsset(ctx, KTPID, nama, jenisKelamin, alamat, status, cert, tglvac, fac) {
        const hasAccess = await this.hasRole(ctx, ['Gov', 'Facilitator']);
        if (!hasAccess) {
            throw new Error(`Only Gov and Facilitator can update car asset`);
        }
        const exists = await this.vaccineAssetExists(ctx, KTPID);
        if (!exists) {
            throw new Error(`The vaccine asset ${KTPID} does not exist`);
        }
        const vaccineAsset = new vaccine_asset_1.VaccineAsset();
        vaccineAsset.nama = nama;
        vaccineAsset.jenisKelamin = jenisKelamin;
        vaccineAsset.alamat = alamat;
        vaccineAsset.status = status;
        vaccineAsset.cert = cert;
        vaccineAsset.tglvac = tglvac;
        vaccineAsset.fac = fac;
        const buffer = Buffer.from(JSON.stringify(vaccineAsset));
        await ctx.stub.putState(KTPID, buffer);
    }
    async deleteVaccineAsset(ctx, KTPID) {
        const hasAccess = await this.hasRole(ctx, ['Gov']);
        if (!hasAccess) {
            throw new Error(`Only dealer can delete car asset`);
        }
        const exists = await this.vaccineAssetExists(ctx, KTPID);
        if (!exists) {
            throw new Error(`The vaccine asset ${KTPID} does not exist`);
        }
        await ctx.stub.deleteState(KTPID);
    }
    async queryAllAssets(ctx) {
        const startKey = '000';
        const endKey = '999';
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString());
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString());
                }
                catch (err) {
                    console.log(err);
                    Record = res.value.value.toString();
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
    async getHistoryByKey(ctx, KTPID) {
        const iterator = await ctx.stub.getHistoryForKey(KTPID);
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString());
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString());
                }
                catch (err) {
                    console.log(err);
                    Record = res.value.value.toString();
                }
                allResults.push({ Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
    async changeStatus(ctx, KTPID, newstatus, newcert, newtglvac, newfac) {
        const ktpAsBytes = await ctx.stub.getState(KTPID);
        if (!ktpAsBytes || ktpAsBytes.length === 0) {
            throw new Error(`${KTPID} does not exist`);
        }
        const vaccineAsset = JSON.parse(ktpAsBytes.toString());
        vaccineAsset.status = newstatus;
        vaccineAsset.cert = newcert;
        vaccineAsset.tglvac = newtglvac;
        vaccineAsset.fac = newfac;
        await ctx.stub.putState(KTPID, Buffer.from(JSON.stringify(vaccineAsset)));
    }
    async hasRole(ctx, roles) {
        const clientID = ctx.clientIdentity;
        for (const roleName of roles) {
            if (clientID.assertAttributeValue('role', roleName)) {
                if (clientID.getMSPID() === 'Org1MSP' && clientID.getAttributeValue('role') === 'Gov') {
                    return true;
                }
                if (clientID.getMSPID() === 'Org2MSP' && clientID.getAttributeValue('role') === 'Facilitator') {
                    return true;
                }
            }
        }
        return false;
    }
};
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], VaccineAssetContract.prototype, "initLedger", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], VaccineAssetContract.prototype, "vaccineAssetExists", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], VaccineAssetContract.prototype, "createVaccineAsset", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('VaccineAsset'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], VaccineAssetContract.prototype, "readVaccineAsset", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], VaccineAssetContract.prototype, "updateVaccineAsset", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], VaccineAssetContract.prototype, "deleteVaccineAsset", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], VaccineAssetContract.prototype, "queryAllAssets", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], VaccineAssetContract.prototype, "getHistoryByKey", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], VaccineAssetContract.prototype, "changeStatus", null);
VaccineAssetContract = __decorate([
    fabric_contract_api_1.Info({ title: 'VaccineAssetContract', description: 'My Smart Contract' })
], VaccineAssetContract);
exports.VaccineAssetContract = VaccineAssetContract;
//# sourceMappingURL=vacsin-asset-contract.js.map