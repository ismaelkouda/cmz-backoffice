import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { IStatisticsBox } from '../../../shared/interfaces/statistiquesBox.interface';
import { EncodingDataService } from '../../../shared/services/encoding-data.service';
import { Subject, takeUntil } from 'rxjs';
import { SimStatut } from '../../../shared/enum/SimStatut.enum';
import { PATRIMONY } from '../../../shared/routes/routes';
import { DashboardApiService } from './data-access/services/dashboard-api.service';
import { SIM_CARD } from '../patrimony/patrimony-routing.module';
import { AsFeatureService } from '../../../shared/services/as-feature.service';
import { OperationTransaction } from '../../../shared/enum/OperationTransaction.enum';
import { TranslateService } from '@ngx-translate/core';
import {
    NOM_APPLICATION,
    T_NOM_APPLICATION,
} from '../../../shared/constants/nom-aplication.contant';
import { DashboardLink } from '../../../shared/interfaces/dashboard-link.interface';
import { CurrentUser } from '../../../shared/interfaces/current-user.interface';
import { separatorThousands } from '../../../shared/functions/separator-thousands';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    public loading: boolean = true;
    public current_date: string;
    public nom_tenant: string;
    public nom_application: T_NOM_APPLICATION = NOM_APPLICATION.PATRIMOINE_SIM;
    public title =
        'Tableau de bord - Système de Gestion de Collecte Centralisée';
    public listStatisticsBox: IStatisticsBox[] = [];

    simIcon = 'assets/svg/sim-card.png';
    simNormale = 'assets/svg/normal_dark.png';
    simMineure = 'assets/svg/mineure.png';
    simMajeure = 'assets/svg/majeure_white.png';
    simCritique = 'assets/svg/critique_white.png';

    IconDemandWaiting = 'assets/svg/demand_waiting.png';
    IconDemandInTreatment = 'assets/svg/demand_in_treatment.png';
    IconDemandToDelivery = 'assets/svg/demand_to_delivery.png';
    IconDemandToClosure = 'assets/svg/demand_to_closure.png';

    public showIframe: boolean = false;
    public iframeLink: string | undefined;

    public asAccessFeatureDataBalance: boolean = false;
    public asAccessFeatureSmsBalance: boolean = false;

    private destroy$ = new Subject<void>();

    constructor(
        public router: Router,
        private titleService: Title,
        private asFeatureService: AsFeatureService,
        private dashboardApiService: DashboardApiService,
        private encodingService: EncodingDataService,
        private translate: TranslateService
    ) {
        this.titleService.setTitle(`${this.title}`);
    }

    ngOnInit() {
        this.initializeDashboard();
        this.loadDashboardData();
        this.setupFeature();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initializeDashboard(): void {
        const user = this.encodingService.getData(
            'user_data'
        ) as CurrentUser | null;
        this.nom_tenant = user?.tenant?.nom_tenant || '';
        this.nom_application =
            user?.tenant?.application || NOM_APPLICATION.PATRIMOINE_SIM;
        localStorage.setItem('layout', 'Paris');
    }

    private loadDashboardData(): void {
        this.dashboardApiService.fetchDashboardStatistic();
        this.dashboardApiService
            .getDashboardStatistic()
            .pipe(takeUntil(this.destroy$))
            .subscribe((statistic) => {
                this.handleDashboardData(statistic);
            });
    }

    private setupFeature(): void {
        this.asAccessFeatureDataBalance = this.asFeatureService.hasFeature(
            OperationTransaction.SOLDE_DATA
        );

        this.asAccessFeatureSmsBalance = this.asFeatureService.hasFeature(
            OperationTransaction.SOLDE_SMS
        );
    }

    private handleDashboardData(statistic: any): void {
        this.loading = false;
        this.current_date = statistic?.['date_derniere_maj'] || '';
        this.generateStatisticsBoxes(statistic);
    }

    private generateStatisticsBoxes(rapport: any = {}): void {
        this.listStatisticsBox = [
            // SIM Cards
            this.createStatBox(
                '#3498db',
                `${this.translate.instant('SIM_TOTAL')}`,
                separatorThousands(rapport?.['totalSim'] || '0'),
                this.simIcon,
                () => this.router.navigateByUrl(`${PATRIMONY}/${SIM_CARD}`)
            ),

            this.createStatBox(
                '#27ae60',
                `${this.translate.instant('SIM_ACTIVE')}`,
                separatorThousands(rapport?.['totalSimActives'] || '0'),
                this.simIcon,
                () =>
                    this.router.navigateByUrl(`${PATRIMONY}/${SIM_CARD}`, {
                        state: { statut: SimStatut.ACTIF },
                    })
            ),

            this.createStatBox(
                '#000000',
                `${this.translate.instant('SIM_SUSPENDED')}`,
                separatorThousands(rapport?.['totalSimSuspendues'] || '0'),
                this.simIcon,
                () =>
                    this.router.navigateByUrl(`${PATRIMONY}/${SIM_CARD}`, {
                        state: { statut: SimStatut.SUSPENDU },
                    }),
                '#ff7f50',
                '#ff7f50'
            ),

            this.createStatBox(
                '#e74c3c',
                `${this.translate.instant('SIM_TERMINATED')}`,
                separatorThousands(rapport?.['totalSimResiliees'] || '0'),
                this.simIcon,
                () =>
                    this.router.navigateByUrl(`${PATRIMONY}/${SIM_CARD}`, {
                        state: { statut: SimStatut.RESILIE },
                    })
            ),

            ...this.generateAlarmBoxes(
                'Data',
                rapport,
                this.asAccessFeatureDataBalance
            ),

            ...this.generateAlarmBoxes(
                'SMS',
                rapport,
                this.asAccessFeatureSmsBalance
            ),

            ...this.generateAdditionalBoxes(rapport),
        ];
    }

    private createStatBox(
        bgColor: string,
        legend: string,
        count: number | string,
        icon: string,
        routerFilter?: () => void,
        legendColor: string = '#FFF',
        countColor: string = '#FFF',
        borderColor: string = '#FFF'
    ): IStatisticsBox {
        return {
            cardBgColor: bgColor,
            cardBorderColor: borderColor,
            legendColor: legendColor,
            countColor: countColor,
            legend: legend,
            count: count || 0,
            icon: icon,
            routerFilter: routerFilter,
        };
    }

    private generateAlarmBoxes(
        type: 'Data' | 'SMS',
        rapport: any,
        isEnabled: boolean
    ): IStatisticsBox[] {
        if (!isEnabled) return [];

        const dashboardLinks = this.encodingService.getData(
            'dashboard_links'
        ) as DashboardLink | null;
        const suffix = type === 'Data' ? '' : 'Sms';

        return [
            this.createAlarmBox(
                '#FFF',
                `#27ae60`,
                `${this.translate.instant('SIM_NORMAL_ALARMS')} (${type})`,
                separatorThousands(
                    rapport?.[`totalAlarmesNormales${suffix}`] || '0'
                ),
                this.simNormale,
                dashboardLinks?.[`analyseAlarmeNormales${suffix}`] || '',
                '#27ae60',
                '#27ae60'
            ),
            this.createAlarmBox(
                '#FFFF00',
                '#FFF',
                `${this.translate.instant('SIM_MINOR_ALARMS')} (${type})`,
                separatorThousands(
                    rapport?.[`totalAlarmesMineures${suffix}`] || '0'
                ),
                this.simMineure,
                dashboardLinks?.[`analyseAlarmeMineures${suffix}`] || '',
                '#130f40',
                '#130f40'
            ),
            this.createAlarmBox(
                '#FE9A2E',
                '#FFF',
                `${this.translate.instant('SIM_MAJOR_ALARMS')} (${type})`,
                separatorThousands(
                    rapport?.[`totalAlarmesMajeures${suffix}`] || '0'
                ),
                this.simMajeure,
                dashboardLinks?.[`analyseAlarmeMajeures${suffix}`] || ''
            ),
            this.createAlarmBox(
                '#e74c3c',
                '#FFF',
                `${this.translate.instant('SIM_CRITICAL_ALARMS')} (${type})`,
                separatorThousands(
                    rapport?.[`totalAlarmesCritiques${suffix}`] || '0'
                ),
                this.simCritique,
                dashboardLinks?.[`analyseAlarmeCritiques${suffix}`] || ''
            ),
        ];
    }

    private createAlarmBox(
        bgColor: string,
        borderColor: string,
        legend: string,
        count: number | string,
        icon: string,
        iframeLink: string,
        legendColor: string = '#FFF',
        countColor: string = '#FFF'
    ): IStatisticsBox {
        return {
            cardBgColor: bgColor,
            cardBorderColor: borderColor,
            legendColor: legendColor,
            countColor: countColor,
            legend: legend,
            count: count,
            icon: icon,
            iframeLink: iframeLink,
        };
    }

    private generateAdditionalBoxes(rapport: any): IStatisticsBox[] {
        if (this.nom_application !== NOM_APPLICATION.PATRIMOINE_SIM) return [];

        return [
            this.createStatBox(
                '#ffA500',
                `${this.translate.instant('FOLDERS')} ${this.translate.instant(
                    'TO_APPROVE'
                )}`,
                separatorThousands(
                    rapport?.['total_dossiers_a_approuver'] || '0'
                ),
                this.IconDemandWaiting
            ),

            this.createStatBox(
                '#f39c12',
                `${this.translate.instant('FOLDERS')} ${this.translate.instant(
                    'IN_TREATMENT'
                )}`,
                separatorThousands(
                    rapport?.['total_dossiers_en_traitement'] || '0'
                ),
                this.IconDemandInTreatment
            ),

            this.createStatBox(
                '#28a745',
                `${this.translate.instant('FOLDERS')} ${this.translate.instant(
                    'TO_DELIVER'
                )}`,
                separatorThousands(rapport?.['total_dossiers_a_livrer'] || '0'),
                this.IconDemandToDelivery,
                undefined,
                '#fff',
                '#fff',
                '#28a745'
            ),

            this.createStatBox(
                'rgb(52, 73, 94)',
                `${this.translate.instant('CLOSURE')} ${this.translate.instant(
                    'WAITING'
                )}`,
                separatorThousands(
                    rapport?.['total_dossiers_clotures_ok'] || '0'
                ),
                this.IconDemandToClosure
            ),
        ];
    }

    public refreshStatic(): void {
        this.loading = true;
        this.dashboardApiService.fetchDashboardStatistic();
    }

    public showAlarms(statisticsBox: IStatisticsBox) {
        this.iframeLink = statisticsBox?.iframeLink;
        this.showIframe = true;
    }

    public hideDialog() {
        this.showIframe = false;
    }
}
