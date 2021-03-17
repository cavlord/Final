/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class VaccineAsset {

    @Property()
    
    
    public nama: string;
    public jenisKelamin: string;
    public alamat : string;
    public status: string;
    public cert:string   
    public remark: string;
    public tglvac:string;
    public fac:string;
}
