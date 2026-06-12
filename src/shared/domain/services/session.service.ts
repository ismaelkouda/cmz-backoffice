import { inject, Injectable } from '@angular/core';
import { EncodingDataService } from './encoding-data.service';

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private readonly encodingDataService = inject(EncodingDataService);

    clear(): void {
        this.encodingDataService.removeKeysWithPrefix('token_data');
        this.encodingDataService.removeKeysWithPrefix('user_data');
        this.encodingDataService.clearEncryptedData();

        localStorage.clear();
        sessionStorage.clear();
    }
}
