import { Component, OnInit, OnDestroy } from '@angular/core';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { MappingService } from 'src/shared/services/mapping.service';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
    public show: boolean = true;
    public profil: any;
    public appName: string;

    constructor(
        private storage: EncodingDataService,
        private mappingService: MappingService
    ) {
        setTimeout(() => {
            this.show = false;
        }, 3000);
        this.appName = this.mappingService.appName;
    }

    ngOnInit() {
        this.profil = JSON.parse(this.storage.getData('user') || null);
    }

    ngOnDestroy() {}
}
