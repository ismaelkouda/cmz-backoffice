import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CurrentUser } from 'shared/interfaces/current-user.interface';
import { EncodingDataService } from '../../../shared/services/encoding-data.service';
import { LOGO_ANSUT } from './../../constants/logoAnsut.constant';

@Component({
    selector: 'app-loader',
    standalone: true,
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    imports: [TranslateModule],
})
export class LoaderComponent implements OnInit {
    public LOGO_ANSUT = LOGO_ANSUT;
    public show: boolean = true;
    public profil: any;
    public appName: string | undefined;

    constructor(private encodingService: EncodingDataService) {
        setTimeout(() => {
            this.show = false;
        }, 3000);
    }

    ngOnInit() {
        const user = this.encodingService.getData(
            'user_data'
        ) as CurrentUser | null;
        //this.appName = user?.nom;
        this.profil = this.encodingService.getData('user_data');
    }
}
