import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, finalize, switchMap } from 'rxjs/operators';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { EnvService } from '../../../../../../shared/services/env.service';
import { claimsEndpointEnum } from '../enums/claims-endpoint.enum';
import { claimsFilterInterface } from '../interfaces/claims-filter.interface';
import {
    claimsApiResponseInterface,
    claimsInterface,
} from '../interfaces/claims.interface';

@Injectable()
export class ClaimsApiService {
    private claimsSubject = new BehaviorSubject<Array<claimsInterface>>([]);
    private claimsPagination = new BehaviorSubject<Paginate<claimsInterface>>(
        {} as Paginate<claimsInterface>
    );
    private claimsSelected = new BehaviorSubject<claimsInterface>(
        {} as claimsInterface
    );
    private loadingClaimsSubject = new BehaviorSubject<boolean>(false);
    private dataFilterClaimsSubject =
        new BehaviorSubject<claimsFilterInterface>({} as claimsFilterInterface);
    private dataNbrPageClaimsSubject = new BehaviorSubject<string>('1');
    private apiResponseClaimsSubject =
        new BehaviorSubject<claimsApiResponseInterface>(
            {} as claimsApiResponseInterface
        );

    private BASE_URL: string;
    constructor(
        private http: HttpClient,
        private envService: EnvService,
        private router: Router
    ) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste claims*************** */
    fetchClaims(data: claimsFilterInterface, nbrPage: string = '1'): void {
        if (this.loadingClaimsSubject.getValue()) return;
        this.loadingClaimsSubject.next(true);
        const url: string =
            claimsEndpointEnum.SUPERVISION_OPERATIONS_CONTENTIEUX_ALL.replace(
                '{page}',
                nbrPage
            );

        this.http
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const claims = response?.['data']?.data.data.map(
                        (demande: claimsInterface) => ({
                            ...demande,
                            demandeur: `${demande.demandeur_nom} ${demande.demandeur_prenoms}`,
                        })
                    );
                    this.claimsSubject.next(claims);
                    this.claimsPagination.next(response?.['data']?.data);
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

    getClaims(): Observable<Array<claimsInterface>> {
        return this.claimsSubject.asObservable();
    }
    getClaimsPagination(): Observable<Paginate<claimsInterface>> {
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
    getClaimsSelected(): Observable<claimsInterface> {
        return this.claimsSelected.asObservable();
    }
    setClaimsSelected(claims: claimsInterface): void {
        this.claimsSelected.next(claims);
    }

    /*********************Méthode pour creer une reclamation*************** */

    private createClaimSubject = new BehaviorSubject<any>({} as any);
    private loadingCreateClaimSubject = new BehaviorSubject<boolean>(false);

    fetchCreateClaim(
        data: any,
        toastService: ToastrService,
        claimsApiService: ClaimsApiService,
        routeLink: any[]
    ): void {
        if (this.loadingCreateClaimSubject.getValue()) return;
        this.loadingCreateClaimSubject.next(true);
        const url: string =
            claimsEndpointEnum.SUPERVISION_OPERATIONS_CONTENTIEUX_STORE;

        this.http
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    const createClaim = response;
                    this.createClaimSubject.next(createClaim);
                    this.displayToast(
                        response,
                        toastService,
                        claimsApiService,
                        routeLink
                    );
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching fetchCreateClaim', error);
                    return of([]);
                }),
                finalize(() => this.loadingCreateClaimSubject.next(false))
            )
            .subscribe();
    }

    getCreateClaim(): Observable<any> {
        return this.createClaimSubject.asObservable();
    }
    isLoadingCreateClaim(): Observable<boolean> {
        return this.loadingCreateClaimSubject.asObservable();
    }

    displayToast(
        response: any,
        toastService: ToastrService,
        claimsApiService: ClaimsApiService,
        routeLink: any[]
    ) {
        if (response?.error && response.error === false && toastService) {
            toastService.success(response.message);
            claimsApiService.fetchClaims({} as claimsFilterInterface);
            this.router.navigate(routeLink);
        } else if (response?.error && response.error === true) {
            toastService.error(response.message);
        }
    }
}
