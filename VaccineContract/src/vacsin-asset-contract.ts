/*
 * SPDX-License-Identifier: Apache-2.0
 */
import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { VaccineAsset } from './vaccine-asset';
import { uuid } from 'uuidv4';

@Info({ title: 'VaccineAssetContract', description: 'My Smart Contract' })
export class VaccineAssetContract extends Contract {

    //add sample transaction
    @Transaction()
    public async initLedger(ctx: Context) {
       const data : VaccineAsset [] =[
            {
                
                nama:'Fahmi',
                jenisKelamin: 'Pria',
                alamat:'Jl Jendral Sudirman no 1',
                status: '',
                cert :uuid(),
                tglvac:'',
                fac:'',
                remark:''
            },
            {
                nama:'Mifah',
                jenisKelamin: 'Pria',
                alamat:'Jl Jendral Sudirman no 2',
                status: '',
                cert :uuid(),
                tglvac:'',
                fac:'',
                remark:''
            },
            {
             
                nama: 'Imfha',
                jenisKelamin: 'Wanita',
                alamat:'Jl Jendral Sudirman no 3',
                status: '',
                cert :uuid(),
                tglvac:'',
                fac:'',
                remark:''
            },
            {

                nama: 'Ahmif',
                jenisKelamin: 'Wanita',
                alamat:'Jl Jendral Sudirman no 4',
                status: '',
                cert :uuid(),
                tglvac:'',
                fac:'',
                remark:''
            }
        ]

        for (let i = 0; i < data.length; i++) {
            await ctx.stub.putState('0'+ i, Buffer.from(JSON.stringify(data[i])));
            
        }
        
    }

    @Transaction(false)
    @Returns('boolean')
    public async vaccineAssetExists(ctx: Context, KTPID: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(KTPID);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createVaccineAsset(ctx: Context, KTPID: string, nama: string, jenisKelamin :string ,alamat:string ,status: string,cert:string, tglvac:string, fac:string): Promise<void> {
       const hasAccess = await this.hasRole(ctx, ['Gov']);
        if (!hasAccess) {
            throw new Error(`Only Gov can create vaccine asset`);
        }
        const exists = await this.vaccineAssetExists(ctx, KTPID);
        if (exists) {
            throw new Error(`The vaccine asset ${KTPID} already exists`);
        }
        const vaccineAsset = new VaccineAsset();
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

    @Transaction(false)
    @Returns('VaccineAsset')
    public async readVaccineAsset(ctx: Context, KTPID: string): Promise<VaccineAsset> {
        const exists = await this.vaccineAssetExists(ctx, KTPID);
        if (!exists) {
            throw new Error(`The vaccine asset ${KTPID} does not exist`);
        }
        const buffer = await ctx.stub.getState(KTPID);
        const vaccineAsset = JSON.parse(buffer.toString()) as VaccineAsset;

        try {
            const privBuffer = await ctx.stub.getPrivateData('productionRemark', KTPID);
            vaccineAsset.remark = privBuffer.toString();
            return vaccineAsset;
        } catch (error) {
            return vaccineAsset;
        }
    }
   
    @Transaction()
    public async updateVaccineAsset(ctx: Context, KTPID: string, nama: string, jenisKelamin :string ,alamat:string ,status: string,cert:string, tglvac:string, fac:string): Promise<void> {
        const hasAccess = await this.hasRole(ctx, ['Gov','Facilitator']);
        if (!hasAccess) {
            throw new Error(`Only Gov and Facilitator can update car asset`);
        }
        const exists = await this.vaccineAssetExists(ctx, KTPID);
        if (!exists) {
            throw new Error(`The vaccine asset ${KTPID} does not exist`);
        }
        const vaccineAsset = new VaccineAsset();
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

    @Transaction()
    public async deleteVaccineAsset(ctx: Context, KTPID: string): Promise<void> {
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

   

    @Transaction(false)
    public async queryAllAssets(ctx: Context): Promise<string> {
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
                } catch (err) {
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
   
    @Transaction(false)
    public async getHistoryByKey(ctx: Context, KTPID: string): Promise<string> {
        const iterator = await ctx.stub.getHistoryForKey(KTPID);
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString());

                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString());
                } catch (err) {
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
   
    @Transaction()
    public async changeStatus(ctx: Context,KTPID:string, newstatus:string, newcert:string, newtglvac:string, newfac:string) {
        const ktpAsBytes = await ctx.stub.getState(KTPID); 
        if (!ktpAsBytes || ktpAsBytes.length === 0) {
            throw new Error(`${KTPID} does not exist`);
        }
        const vaccineAsset: VaccineAsset = JSON.parse(ktpAsBytes.toString());
        vaccineAsset.status = newstatus; 
        vaccineAsset.cert = newcert;       
        vaccineAsset.tglvac = newtglvac;
        vaccineAsset.fac = newfac;
        await ctx.stub.putState(KTPID, Buffer.from(JSON.stringify(vaccineAsset)));
        
    }



    public async hasRole(ctx: Context, roles: string[]) {
        const clientID = ctx.clientIdentity;
        for (const roleName of roles) {
            if (clientID.assertAttributeValue('role', roleName)) {
                if (clientID.getMSPID() === 'Org1MSP' && clientID.getAttributeValue('role') === 'Gov') { return true; }
                if (clientID.getMSPID() === 'Org2MSP' && clientID.getAttributeValue('role') === 'Facilitator') { return true; }
            }
        }
        return false;
        }
}

    


