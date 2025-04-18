import { Injectable } from '@angular/core';
import { envConfig } from '../../../generate-env';

declare var window: any;

@Injectable({
    providedIn: 'root'
})

export class EnvService {

    // API url
    public apiUrl: string;
    public fileUrl: string;
    public environmentDeployment: string;
    public verifyIdentityDocumentUrl: string;

    public headerSettings = {
        appTypePS: '',
        appTypeSM: ''
    };
    public messageApp = {
        sourceStockTenantSim : '',
        sourceStockOrangeSim : '',
        sourceSoldeDotation : '',
        sourceSoldeDotationOrange : '',
    };

    // Whether or not to enable debug mode
    public enableDebug = true;

    constructor() {
        this.loadEnvironment();
    }

    public async loadEnvironment(): Promise<void> {
        const env = await fetch('/assets/env.json').then(res => res.json());
        this.apiUrl = env.API_URL;
        this.fileUrl = env.FILE_URL;
        this.verifyIdentityDocumentUrl = env.VERIFY_IDENTITY_URL;
        this.environmentDeployment = env.ENVIRONMENT;
        this.enableDebug = env.ENABLE_DEBUG;
      }
}
