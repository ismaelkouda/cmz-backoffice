import { inject, Injectable } from '@angular/core';
import { EncodingDataService } from './encoding-data.service';

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private readonly encodingDataService = inject(EncodingDataService);

    clear(): void {
        const appKeys = [
            'language',
            'mode',
            'auth.forgot-password',
            'token_data',
            'user_data',
        ];

        appKeys.forEach((key) => this.encodingDataService.removeData(key));
        this.encodingDataService.clearEncryptedData();

        globalThis.location.reload();
    }
}
