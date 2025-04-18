import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../../../shared/services/env.service';
import { CommandWhiteSim } from '../interfaces/white-sim.interface';
import { CommandWhiteSimEndpointEnum } from '../enums/white-sim-endpoint.enum';
import { Paginate } from '../../../../../../shared/interfaces/paginate';

@Injectable()
export class CommandWhiteSimApiService {
    private commandWhiteSimSubject = new BehaviorSubject<CommandWhiteSim[]>([]);
    private commandWhiteSimPagination = new BehaviorSubject<
        Paginate<CommandWhiteSim>
    >({} as Paginate<CommandWhiteSim>);
    private commandWhiteSimSelected = new BehaviorSubject<CommandWhiteSim>(
        {} as CommandWhiteSim
    );
    private loadingCommandWhiteSimSubject = new BehaviorSubject<boolean>(false);
    private dataFilterCommandWhiteSimSubject = new BehaviorSubject<Object>({});
    private apiResponseCommandWhiteSimSubject = new BehaviorSubject<any>(null);

    private BASE_URL: string;
    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste CommandWhiteSim*************** */
    fetchCommandWhiteSim(data: Object, nbrPage: string = '1'): void {
        if (this.loadingCommandWhiteSimSubject.getValue()) return; // Évite les doublons pendant que l'api est en cours
        this.loadingCommandWhiteSimSubject.next(true);
        const url: string =
            CommandWhiteSimEndpointEnum.DEMANDE_SERVICE_ALL.replace(
                '{page}',
                nbrPage
            );

        this.http
            .post<Object>(`${this.BASE_URL}${url}`, data)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const CommandWhiteSim = response?.['data']?.data.map(
                        (demand) => ({
                            ...demand,
                            demandeur: demand.demandeur_nom,
                        })
                    );
                    this.commandWhiteSimSubject.next(CommandWhiteSim);
                    this.commandWhiteSimPagination.next(response?.['data']);
                    this.apiResponseCommandWhiteSimSubject.next(response);
                    this.dataFilterCommandWhiteSimSubject.next(data);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching CommandWhiteSim', error);
                    return of([]);
                }),
                finalize(() => this.loadingCommandWhiteSimSubject.next(false))
            )
            .subscribe();
    }

    getCommandWhiteSim(): Observable<any[]> {
        return this.commandWhiteSimSubject.asObservable();
    }
    getCommandWhiteSimPagination(): any {
        return this.commandWhiteSimPagination.asObservable();
    }
    isLoadingCommandWhiteSim(): Observable<boolean> {
        return this.loadingCommandWhiteSimSubject.asObservable();
    }
    getDataFilterCommandWhiteSim(): Observable<Object> {
        return this.dataFilterCommandWhiteSimSubject.asObservable();
    }
    getApiResponseCommandWhiteSim(): Observable<Object> {
        return this.apiResponseCommandWhiteSimSubject.asObservable();
    }
    getCommandWhiteSimSelected(): Observable<CommandWhiteSim> {
        return this.commandWhiteSimSelected.asObservable();
    }
    setCommandWhiteSimSelected(demand: CommandWhiteSim): void {
        this.commandWhiteSimSelected.next(demand);
    }
}
