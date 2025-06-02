import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../services/env.service';

@Injectable({ providedIn: 'root' })
export class ExportInvoiceService {
    private BASE_URL: string;
    constructor(private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    handleExportInvoice(data: any) {
        console.log(
            'data',
            this.BASE_URL +
                'gestion-facture/' +
                data.reference +
                '/download-invoice'
        );

        window.open(
            this.BASE_URL +
                'gestion-facture/' +
                data.reference +
                '/download-invoice',
            '_blank'
        );
        return true;
    }
}
