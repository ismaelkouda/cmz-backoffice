import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { EnvService } from '../../../../../../shared/services/env.service';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { claimsApiResponseInterface } from '../interfaces/claims.interface';
import { claimsEndpointEnum } from '../enums/claims-endpoint.enum';
import { claimsFilterInterface } from '../interfaces/claims-filter.interface';
import { Folder } from '../../../../../../shared/interfaces/folder';

@Injectable()

export class ClaimsApiService {
    private claimsSubject = new BehaviorSubject<Array<Folder>>([]);
    private claimsPagination = new BehaviorSubject<Paginate<Folder>>({} as Paginate<Folder>);
    private claimsSelected = new BehaviorSubject<Folder>({} as Folder);
    private loadingClaimsSubject = new BehaviorSubject<boolean>(false);
    private dataFilterClaimsSubject = new BehaviorSubject<claimsFilterInterface>({} as claimsFilterInterface);
    private dataNbrPageClaimsSubject = new BehaviorSubject<string>('1');
    private apiResponseClaimsSubject = new BehaviorSubject<claimsApiResponseInterface>({} as claimsApiResponseInterface);

    private BASE_URL: string;
    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

            /*********************Méthode pour récupérer la liste claims*************** */
    fetchClaims(data: claimsFilterInterface, nbrPage: string = '1'): void {
        if (this.loadingClaimsSubject.getValue()) return;
        this.loadingClaimsSubject.next(true);
        const url: string = claimsEndpointEnum.SUPERVISION_OPERATIONS_CONTENTIEUX_ALL.replace('{page}', nbrPage);

        this.http
            .post<Object>(this.BASE_URL+url, data)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const claims = response?.['data']?.data;
                    this.claimsSubject.next(claims);
                    this.claimsPagination.next(response?.['data']);
                    this.apiResponseClaimsSubject.next(response);
                    this.dataFilterClaimsSubject.next(data);
                    this.dataNbrPageClaimsSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching claims', error);
                    return of([]);
                }),
                finalize(() => this.loadingClaimsSubject.next(false))
            )
            .subscribe();
    }

    getClaims(): Observable<Array<Folder>> {
        return this.claimsSubject.asObservable();
    }
    getClaimsPagination(): Observable<Paginate<Folder>> {
        return this.claimsPagination.asObservable();
    }
    isLoadingClaims(): Observable<boolean> {
        return this.loadingClaimsSubject.asObservable();
    }
    getDataFilterClaims(): Observable<claimsFilterInterface> {
        return this.dataFilterClaimsSubject.asObservable();
    }
    getDataNbrPageClaims(): Observable<string> {
        return this.dataNbrPageClaimsSubject.asObservable();
    }
    getApiResponseClaims(): Observable<claimsApiResponseInterface> {
        return this.apiResponseClaimsSubject.asObservable();
    }
    getClaimsSelected(): Observable<Folder> {
        return this.claimsSelected.asObservable();
    }
    setClaimsSelected(claims: Folder): void {
        this.claimsSelected.next(claims);
    }
}
