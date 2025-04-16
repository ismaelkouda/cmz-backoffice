import { IndicatorsAlarmsApiService } from './../../data-access/indicators-alarms/services/indicators-alarms-api.service';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { indicatorsAlarmsInterface } from '../../data-access/indicators-alarms/interfaces/indicators-alarms.interface';

@Component({
    selector: 'app-indicators-alarms',
    templateUrl: './indicators-alarms.component.html'
})

export class IndicatorsAlarmsComponent implements OnInit {
    public module: string;
    public subModule: string;
    public listIndicatorsAlarms$: Observable<Array<indicatorsAlarmsInterface>>;
    public detailsCurrentTabPanelIndex: number = 0;
    
    constructor(private activatedRoute: ActivatedRoute,
        private indicatorsAlarmsApiService: IndicatorsAlarmsApiService) {
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[1];
        });
        this.listIndicatorsAlarms$ = this.indicatorsAlarmsApiService.getIndicatorsAlarms();
        this.indicatorsAlarmsApiService.fetchIndicatorsAlarms();
    }

}
