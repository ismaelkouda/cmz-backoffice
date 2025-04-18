import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EncodingDataService } from '../../../../../../shared/services/encoding-data.service';

@Injectable()
export class MobileSubscriptionsService {
    public baseUrl: string;

    constructor(
        private http: HttpClient,
        private storage: EncodingDataService
    ) {
        const data = JSON.parse(this.storage.getData('user'));
        this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`;
    }
}
