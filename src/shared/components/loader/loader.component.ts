import { ORANGE } from './../../constants/logoOrange.constant';
import { Component, OnInit } from '@angular/core';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { MappingService } from 'src/shared/services/mapping.service';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
    public ORANGE = ORANGE;
    public show: boolean = true;
    public profil: any;
    public appName: string;

    constructor(
        private encodingService: EncodingDataService,
        private mappingService: MappingService
    ) {
        setTimeout(() => {
            this.show = false;
        }, 3000);
        this.appName = this.mappingService.appName;
    }

    ngOnInit() {
        this.profil = this.encodingService.getData('user_data');
    }

    ngOnDestroy() {}
}
