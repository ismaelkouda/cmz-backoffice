import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class EnvService {
    public apiUrl!: string;
    public fileUrl!: string;
    public environmentDeployment!: string;
    public verifyIdentityDocumentUrl!: string;
    public enableDebug = false;

    public headerSettings: any = {};
    public messageApp: any = {};

    public load(): void {
        const env = (window as any).__env;

        this.apiUrl = env.apiUrl;
        this.fileUrl = env.fileUrl;
        this.verifyIdentityDocumentUrl = env.verifyIdentityDocumentUrl;
        this.environmentDeployment = env.environmentDeployment;
        this.enableDebug = env.enableDebug;

        this.headerSettings = env.headerSettings;
        this.messageApp = env.messageApp;
    }
}
