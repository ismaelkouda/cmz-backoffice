import { EnvService } from './env.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { EndPointUrl } from '../enum/api.enum';

@Injectable({
    providedIn: 'root',
})
export class SettingService {
    public statutSubject = new BehaviorSubject(false);
    public statutSubject$ = this.statutSubject.asObservable();
    public baseUrl: string;
    public httpOptions: any;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.baseUrl = this.envService.apiUrl;
    }

    getAllUsers(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_USERS;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    postParametresSecuriteFormeJuridiqueAll(data): Observable<any> {
        const url: string = <string>(
            EndPointUrl.PARAMETRES_SECURITE_FORME_JURIDIQUES_ALL
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    postParametresSecuriteRegimesEntrepriseAll(data): Observable<any> {
        const url: string = <string>(
            EndPointUrl.PARAMETRES_SECURITE_REGIMES_ENTREPRISE_ALL
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OnSaveUser(data): Observable<any> {
        const url: string = <string>EndPointUrl.SAVE_USER;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OnUpdateUser(data): Observable<any> {
        const url: string = <string>EndPointUrl.UPDATE_USER;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OnDeleteUser(data): Observable<any> {
        const url: string = <string>EndPointUrl.DELETE_USER;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    getHistoriques(data, nbrPage: string = '1'): Observable<any> {
        const url: string = <string>(
            EndPointUrl.GET_ALL_HISTORIQUE.replace('{page}', nbrPage)
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    getDetailsHistoriques(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_DETAILS_HISTORIQUE;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    getAllJournal(data, typeJournal): Observable<any> {
        const url: string = <string>(
            EndPointUrl.GET_ALL_JOURNAL.replace('{typeJournal}', typeJournal)
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    getAllSimBlancheJournal(data, page): Observable<any> {
        const url: string = <string>(
            EndPointUrl.GET_ALL_SIM_BLANCHE_JOURNAL.replace('{page}', page)
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    getAllYears(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_YEAR;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    //First Level
    getAllDirectionRegionales(data, page): Observable<any> {
        const url: string = (<string>EndPointUrl.GET_ALL_FIRSTLEVEL).replace(
            '{page}',
            page
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    GetAllFirstLevelHabilitation(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_FIRSTLEVEL_HABILITATION;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    GetAllSecondLevelHabilitation(data): Observable<any> {
        const url: string = <string>(
            EndPointUrl.GET_ALL_SECOND_LEVEL_HABILITATION
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OnSaveDirectionRegionale(data): Observable<any> {
        const url: string = <string>EndPointUrl.SAVE_DIRECTION_REGIONALE;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OnUpdateDirectionRegionale(data): Observable<any> {
        const url: string = <string>EndPointUrl.UPDATE_DIRECTION_REGIONALE;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    //Second Level
    getAllExploiatations(data, page): Observable<any> {
        const url: string = (<string>EndPointUrl.GET_ALL_EXPLOITATION).replace(
            '{page}',
            page
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OnSaveExploitation(data): Observable<any> {
        const url: string = <string>EndPointUrl.SAVE_EXPLOITATION;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OnUpdateEploitation(data): Observable<any> {
        const url: string = <string>EndPointUrl.UPDATE_EXPLOITATION;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OngetAllExploiatationsNoAffecte(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_EXPLOIATATION_NO_AFFECTE;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    // Third Level
    getAllZones(data, page): Observable<any> {
        const url: string = (<string>EndPointUrl.GET_ALL_NIVEAUX_3).replace(
            '{page}',
            page
        );
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    GetAllThirdLevelHabilitation(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_NIVEAUX_3_HABILITATION;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OnSaveZone(data): Observable<any> {
        const url: string = <string>EndPointUrl.SAVE_NIVEAUX_3;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OnUpdateZone(data): Observable<any> {
        const url: string = <string>EndPointUrl.UPDATE_NIVEAUX_3;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OnChangeStatutZone(data): Observable<any> {
        const url: string = <string>EndPointUrl.UPDATE_STATUT_USAGE;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    HandleDeleteZone(data): Observable<any> {
        const url: string = (<string>EndPointUrl.DELETE_NIVEAUX_3).replace(
            '{id}',
            data
        );
        return this.http.delete(`${this.baseUrl}${url}`);
    }
    handleActivateZone(data): Observable<any> {
        const url: string = (<string>EndPointUrl.ACTIVATE_NIVEAUX_3).replace(
            '{id}',
            data
        );
        return this.http.put(`${this.baseUrl}${url}`, {});
    }
    handleDisableZone(data): Observable<any> {
        const url: string = (<string>EndPointUrl.DISABLE_NIVEAUX_3).replace(
            '{id}',
            data
        );
        return this.http.put(`${this.baseUrl}${url}`, {});
    }

    // Security
    HandleUpdatePassword(data): Observable<any> {
        const url: string = <string>EndPointUrl.HANDLE_UPDATE_PASSWORD;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    getAllSites(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_SITES;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    // USAGES
    getAllUsages(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_USAGES;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OnSaveUsage(data): Observable<any> {
        const url: string = <string>EndPointUrl.SAVE_USAGE;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OnUpdateUsage(data): Observable<any> {
        const url: string = <string>EndPointUrl.UPDATE_USAGE;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    OnDeleteUsage(id): Observable<any> {
        const url: string = (<string>EndPointUrl.DELETE_USAGE).replace(
            '{id}',
            id
        );
        return this.http.delete(`${this.baseUrl}${url}`);
    }
    HandleActiveUsage(id): Observable<any> {
        const url: string = (<string>EndPointUrl.ACTIVATE_USAGE).replace(
            '{id}',
            id
        );
        return this.http.put(`${this.baseUrl}${url}`, {});
    }
    HandleDisableUsage(id): Observable<any> {
        const url: string = (<string>EndPointUrl.DISABLE_USAGE).replace(
            '{id}',
            id
        );
        return this.http.put(`${this.baseUrl}${url}`, {});
    }
    Logout(data): Observable<any> {
        const url: string = <string>EndPointUrl.LOGOUT;
        return this.http.put(`${this.baseUrl}${url}`, data);
    }

    //NIVEAUX SIMPLE

    GetAllFirstLevelSimple(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_NIVEAUX_1_SIMPLE;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    GetAllSecondLevelSimple(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_NIVEAUX_2_SIMPLE;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
    GetAllThirdSimple(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_NIVEAUX_3_SIMPLE;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    GetAllFormules(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_FORMULES;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    GetCoutUnitaireOperation(typeOperation: string): Observable<any> {
        const url: string = <string>(
            EndPointUrl.GET_CONTRATS_SLA_ENGAGEMENTS_SLA.replace(
                '{typeOperation}',
                typeOperation
            )
        );
        return this.http.post(`${this.baseUrl}${url}`, {});
    }

    GetAllAPN(data): Observable<any> {
        const url: string = <string>EndPointUrl.GET_ALL_APN;
        return this.http.get(`${this.baseUrl}${url}`, data);
    }
}
