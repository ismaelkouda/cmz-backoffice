import { Observable } from 'rxjs';
import { EnvService } from './env.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { EndPointUrl } from "src/shared/enum/api.enum";

@Injectable({ providedIn: "root" })

export class SharedService {
    private BASE_URL: string;
    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    PostForceVenteCommercialAll(data: Object): Observable<any> {
        const url: string = <string>EndPointUrl.FORCE_VENTE_COMMERCIAL_ALL;
        return this.http.post(`${this.BASE_URL}${url}`, data);
    }

    PostGestionTenantsPortefeuillesTenantAll(data: Object, nbrPage: string): Observable<any> {
        const url: string = <string>EndPointUrl.POST_GESTION_TENANTS_PORTEFEUILLES_TENANT_ALL.replace('${nbrPage}', nbrPage);
        return this.http.post(`${this.BASE_URL}${url}`, data);
    }
    
}