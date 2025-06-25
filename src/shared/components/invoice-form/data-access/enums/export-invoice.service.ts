import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../services/env.service';
import { StoreTokenService } from '../../../../services/store-token.service';

@Injectable({ providedIn: 'root' })
export class ExportInvoiceService {
    private BASE_URL: string;
    constructor(
        private envService: EnvService,
        private storeTokenService: StoreTokenService
    ) {
        this.BASE_URL = this.envService.apiUrl;
    }

    handleExportInvoice(data: any) {
        const token = this.storeTokenService.getToken;
        console.log('token', token);

        console.log(
            `${this.BASE_URL}gestion-facture/${data.reference}/download-invoice?token=${token?.value}`
        );

        window.open(
            `${this.BASE_URL}gestion-facture/${data.reference}/download-invoice?token=${token?.value}`,
            '_blank'
        );
        return true;
    }
}
