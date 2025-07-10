import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EnvService {
    public apiUrl!: string;
    public fileUrl!: string;
    public importationApiUrl!: string;
    public verifyIdentityDocumentUrl!: string;
    public environmentDeployment!: string;
    public enableDebug!: boolean;

    public headerSettings: any = {};
    public messageApp: any = {};

    constructor() {
        this.load();
    }

    public load(): void {
        const env = (window as any).__env;

        // if (!env) throw new Error('❌ Environment config not found.');

        Object.assign(this, env);
    }
}
