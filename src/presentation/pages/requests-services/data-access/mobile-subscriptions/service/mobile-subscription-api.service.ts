import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EncodingDataService } from '../../../../../../shared/services/encoding-data.service';
import { EnvService } from '../../../../../../shared/services/env.service';

@Injectable()
export class MobileSubscriptionsService {
    public baseUrl: string;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.baseUrl = this.envService.apiUrl;
    }
}
