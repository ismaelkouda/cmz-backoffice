import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../../../shared/services/env.service';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import {
    downloadApiResponseInterface,
    downloadInterface,
} from '../interfaces/download.interface';
import { downloadEndpointEnum } from '../enums/download-endpoint.enum';

@Injectable()
export class downloadApiService {
    private BASE_URL: string;

    constructor(
        private httpClient: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste download*************** */

    private downloadSubject = new BehaviorSubject<Array<downloadInterface>>([]);
    private downloadPagination = new BehaviorSubject<
        Paginate<downloadInterface>
    >({} as Paginate<downloadInterface>);
    private downloadSelected = new BehaviorSubject<downloadInterface>(
        {} as downloadInterface
    );
    private loadingDownloadSubject = new BehaviorSubject<boolean>(false);
    private dataNbrPageDownloadSubject = new BehaviorSubject<string>('1');
    private apiResponseDownloadSubject =
        new BehaviorSubject<downloadApiResponseInterface>(
            {} as downloadApiResponseInterface
        );

    fetchDownload(nbrPage: string = '1'): void {
        if (this.loadingDownloadSubject.getValue()) return;
        this.loadingDownloadSubject.next(true);
        const url: string =
            downloadEndpointEnum.GET_PATRIMOINE_SIM_DOWNLOAD_FILE_ALL_PAGE.replace(
                '{page}',
                nbrPage
            );

        this.httpClient
            .get<Object>(this.BASE_URL + url)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const download = response?.['data']?.data;
                    this.downloadSubject.next(download);
                    this.downloadPagination.next(response?.['data']);
                    this.apiResponseDownloadSubject.next(response);
                    this.dataNbrPageDownloadSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching download', error);
                    return of([]);
                }),
                finalize(() => this.loadingDownloadSubject.next(false))
            )
            .subscribe();
    }

    getDownload(): Observable<Array<downloadInterface>> {
        return this.downloadSubject.asObservable();
    }
    getDownloadPagination(): Observable<Paginate<downloadInterface>> {
        return this.downloadPagination.asObservable();
    }
    isLoadingDownload(): Observable<boolean> {
        return this.loadingDownloadSubject.asObservable();
    }
    getDataNbrPageDownload(): Observable<string> {
        return this.dataNbrPageDownloadSubject.asObservable();
    }
    getApiResponseDownload(): Observable<downloadApiResponseInterface> {
        return this.apiResponseDownloadSubject.asObservable();
    }
    getDownloadSelected(): Observable<downloadInterface> {
        return this.downloadSelected.asObservable();
    }
    setDownloadSelected(download: downloadInterface): void {
        this.downloadSelected.next(download);
    }
}
