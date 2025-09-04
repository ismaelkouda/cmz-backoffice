import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import {
    NOM_APPLICATION,
    T_NOM_APPLICATION,
} from '../../constants/nom-aplication.contant';
import { CurrentUser } from '../../interfaces/current-user.interface';
import { EncodingDataService } from '../../services/encoding-data.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
    public today: number = Date.now();
    public appName: T_NOM_APPLICATION = NOM_APPLICATION.PATRIMOINE_SIM;

    private destroy$ = new Subject<void>();

    constructor(private encodingService: EncodingDataService) {}

    ngOnInit() {
        const user = this.encodingService.getData(
            'user_data'
        ) as CurrentUser | null;
        this.appName = user?.tenant.application as T_NOM_APPLICATION;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
