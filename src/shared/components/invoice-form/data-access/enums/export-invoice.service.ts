import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../services/env.service';
import { EncodingDataService } from '../../../../services/encoding-data.service';
import { TokenInterface } from '../../../../interfaces/token.interface';

@Injectable({ providedIn: 'root' })
export class ExportInvoiceService {
    private BASE_URL: string;
    constructor(
        private envService: EnvService,
        private encodingService: EncodingDataService
    ) {
        this.BASE_URL = this.envService.apiUrl;
    }

    handleExportInvoice(data: any) {
        const token = this.encodingService.getData(
            'token_data'
        ) as TokenInterface | null;
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
