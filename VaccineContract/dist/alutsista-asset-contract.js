"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */
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
exports.AlutsistaAssetContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const alutsista_asset_1 = require("./alutsista-asset");
let AlutsistaAssetContract = class AlutsistaAssetContract extends fabric_contract_api_1.Contract {
    async alutsistaAssetExists(ctx, alutsistaAssetId) {
        const buffer = await ctx.stub.getState(alutsistaAssetId);
        return (!!buffer && buffer.length > 0);
    }
    async createAlutsistaAsset(ctx, alutsistaAssetId, name, model, year) {
        const hasAccess = await this.hasRole(ctx, ['Manufacturer']);
        if (!hasAccess) {
            throw new Error(`Only manufacturer can create car asset`);
        }
        const exists = await this.alutsistaAssetExists(ctx, alutsistaAssetId);
        if (exists) {
            throw new Error(`The alutsista asset ${alutsistaAssetId} already exists`);
        }
        const alutsistaAsset = new alutsista_asset_1.AlutsistaAsset();
        alutsistaAsset.name = name;
        alutsistaAsset.model = model;
        alutsistaAsset.year = year;
        const buffer = Buffer.from(JSON.stringify(alutsistaAsset));
        await ctx.stub.putState(alutsistaAssetId, buffer);
        const transientMap = ctx.stub.getTransient();
        if (transientMap.get('remark')) {
            await ctx.stub.putPrivateData('productionRemark', alutsistaAssetId, transientMap.get('remark'));
        }
    }
    async readAlutsistaAsset(ctx, alutsistaAssetId) {
        const exists = await this.alutsistaAssetExists(ctx, alutsistaAssetId);
        if (!exists) {
            throw new Error(`The alutsista asset ${alutsistaAssetId} does not exist`);
        }
        const buffer = await ctx.stub.getState(alutsistaAssetId);
        const alutsistaAsset = JSON.parse(buffer.toString());
        try {
            const privBuffer = await ctx.stub.getPrivateData('productionRemark', alutsistaAssetId);
            alutsistaAsset.remark = privBuffer.toString();
            return alutsistaAsset;
        }
        catch (error) {
            return alutsistaAsset;
        }
    }
    async updateAlutsistaAsset(ctx, alutsistaAssetId, name, model, year) {
        const hasAccess = await this.hasRole(ctx, ['Manufacturer', 'Dealer']);
        if (!hasAccess) {
            throw new Error(`Only manufacturer or dealer can update car asset`);
        }
        const exists = await this.alutsistaAssetExists(ctx, alutsistaAssetId);
        if (!exists) {
            throw new Error(`The alutsista asset ${alutsistaAssetId} does not exist`);
        }
        const alutsistaAsset = new alutsista_asset_1.AlutsistaAsset();
        alutsistaAsset.name = name;
        alutsistaAsset.model = model;
        alutsistaAsset.year = year;
        const buffer = Buffer.from(JSON.stringify(alutsistaAsset));
        await ctx.stub.putState(alutsistaAssetId, buffer);
    }
    async deleteAlutsistaAsset(ctx, alutsistaAssetId) {
        const hasAccess = await this.hasRole(ctx, ['Dealer']);
        if (!hasAccess) {
            throw new Error(`Only dealer can delete car asset`);
        }
        const exists = await this.alutsistaAssetExists(ctx, alutsistaAssetId);
        if (!exists) {
            throw new Error(`The alutsista asset ${alutsistaAssetId} does not exist`);
        }
        await ctx.stub.deleteState(alutsistaAssetId);
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
    async queryByMaker(ctx, maker) {
        const query = { selector: { maker } };
        const queryString = JSON.stringify(query);
        const iterator = await ctx.stub.getQueryResult(queryString);
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
    async queryByMinYear(ctx, min, size, bookmark) {
        const query = { selector: { year: { $gte: min } } };
        const queryString = JSON.stringify(query);
        const { iterator, metadata } = await ctx.stub.getQueryResultWithPagination(queryString, size, bookmark);
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
                const result = {
                    results: allResults,
                    metadata
                };
                console.log('end of data');
                await iterator.close();
                console.info(result);
                return JSON.stringify(result);
            }
        }
    }
    async getHistoryByKey(ctx, alutsistaAssetId) {
        const iterator = await ctx.stub.getHistoryForKey(alutsistaAssetId);
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
    async hasRole(ctx, roles) {
        const clientID = ctx.clientIdentity;
        for (const roleName of roles) {
            if (clientID.assertAttributeValue('role', roleName)) {
                if (clientID.getMSPID() === 'Org1MSP' && clientID.getAttributeValue('role') === 'Manufacturer') {
                    return true;
                }
                if (clientID.getMSPID() === 'Org2MSP' && clientID.getAttributeValue('role') === 'Dealer') {
                    return true;
                }
            }
        }
        return false;
    }
};
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AlutsistaAssetContract.prototype, "alutsistaAssetExists", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], AlutsistaAssetContract.prototype, "createAlutsistaAsset", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('AlutsistaAsset'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AlutsistaAssetContract.prototype, "readAlutsistaAsset", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], AlutsistaAssetContract.prototype, "updateAlutsistaAsset", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AlutsistaAssetContract.prototype, "deleteAlutsistaAsset", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], AlutsistaAssetContract.prototype, "queryAllAssets", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AlutsistaAssetContract.prototype, "queryByMaker", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, Number, Number, String]),
    __metadata("design:returntype", Promise)
], AlutsistaAssetContract.prototype, "queryByMinYear", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AlutsistaAssetContract.prototype, "getHistoryByKey", null);
AlutsistaAssetContract = __decorate([
    fabric_contract_api_1.Info({ title: 'AlutsistaAssetContract', description: 'My Smart Contract' })
], AlutsistaAssetContract);
exports.AlutsistaAssetContract = AlutsistaAssetContract;
//# sourceMappingURL=alutsista-asset-contract.js.map