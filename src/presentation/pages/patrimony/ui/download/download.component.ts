import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { Observable, Subject, takeUntil } from 'rxjs';
import { downloadInterface } from '../../data-access/download/interfaces/download.interface';
import { downloadApiService } from '../../data-access/download/services/download-api.service';

@Component({
    selector: 'app-download',
    templateUrl: './download.component.html',
})
export class DownloadComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<downloadInterface>>;
    public listDownload$: Observable<Array<downloadInterface>>;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private downloadApiService: downloadApiService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[4];
        });
        this.listDownload$ = this.downloadApiService.getDownload();
        this.pagination$ = this.downloadApiService.getDownloadPagination();
        this.downloadApiService
            .getDataNbrPageDownload()
            .pipe(takeUntil(this.destroy$))
            .subscribe((nbrPageData) => {
                this.downloadApiService.fetchDownload(nbrPageData);
            });
        this.downloadApiService.isLoadingDownload().subscribe((spinner) => {
            this.spinner = spinner;
        });
    }

    public onPageChange(event: number): void {
        this.downloadApiService.fetchDownload(JSON.stringify(event + 1));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
