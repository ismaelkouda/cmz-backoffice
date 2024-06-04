import { Injectable } from '@angular/core';

declare var window: any;

@Injectable({
    providedIn: 'root'
})

export class EnvService {

    // API url
    public apiUrl: string;
    public fileUrl: string;
    public environmentDeployment: string;

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

    private loadEnvironment(): void {
        const env = window.__env.currentEnv;
        this.apiUrl = env.apiUrl;
        this.fileUrl = env.fileUrl;
        this.environmentDeployment = env.environmentDeployment;
        this.enableDebug = env.enableDebug;
    }
}
