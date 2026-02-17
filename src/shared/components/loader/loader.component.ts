import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { LOGO_ANSUT } from '../../constants/logoAnsut.constant';
import { EncodingDataService } from '../../domain/services/encoding-data.service';

@Component({
    selector: 'app-loader',
    standalone: true,
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    imports: [TranslateModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent implements OnInit {
    public LOGO_ANSUT = LOGO_ANSUT;
    public show = true;
    public profil: any;
    public appName: string | undefined;

    constructor(private encodingService: EncodingDataService) {
        setTimeout(() => {
            this.show = false;
        }, 3000);
    }

    ngOnInit() {
        // const user = this.encodingService.getData(
        //     'user_data'
        // ) as CurrentUser | null;
        //this.appName = user?.nom;
        this.profil = this.encodingService.getData('user_data');
    }
}
