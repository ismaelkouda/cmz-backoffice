import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { BreadcrumbComponent } from '../../../../../shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { SlaAgreementsInterface } from '../../data-access/sla-agreements/interfaces/sla-agreements.interface';
import { SlaAgreementsApiService } from '../../data-access/sla-agreements/services/sla-agreements-api.service';
import { TableSlaAgreementsComponent } from '../../feature/sla-agreements/table-sla-agreements/table-sla-agreements.component';

@Component({
    selector: 'app-sla-agreements',
    standalone: true,
    templateUrl: './sla-agreements.component.html',
    imports: [
        CommonModule,
        BreadcrumbComponent,
        TableSlaAgreementsComponent,
        PageTitleComponent,
        TranslateModule,
    ],
})
export class SlaAgreementsComponent implements OnInit, OnDestroy {
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<SlaAgreementsInterface>>;
    public listSlaAgreements$!: Observable<SlaAgreementsInterface[]>;
    public spinner = true;
    private destroy$ = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private slaAgreementsApiService: SlaAgreementsApiService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data['module'];
            this.subModule = data['subModule'][0];
        });
        this.listSlaAgreements$ =
            this.slaAgreementsApiService.getSlaAgreements();
        this.slaAgreementsApiService.fetchSlaAgreements();
        this.slaAgreementsApiService
            .isLoadingSlaAgreements()
            .subscribe((spinner) => {
                this.spinner = spinner;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
