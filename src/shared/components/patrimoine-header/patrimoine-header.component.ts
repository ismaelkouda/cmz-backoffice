import { Component, Input } from '@angular/core';
import moment from 'moment';

@Component({
    selector: 'app-patrimoine-header',
    templateUrl: './patrimoine-header.component.html',
    styleUrls: ['./patrimoine-header.component.scss'],
})
export class PatrimoineHeaderComponent {
    @Input() count: [];
    @Input() legende: string;
    @Input() total: number;
    currentDate: string;
    @Input() showDate: boolean = false;
    @Input() showListe: boolean = true;
    @Input() showTotal: boolean = true;

    @Input() legendeSingulier: string;
    @Input() legendePluriel: string;
    @Input() displayDate: boolean = true;
    @Input() displayList: boolean = true;

    constructor() {
        const dateActuelle = moment();
        this.currentDate = dateActuelle.format('DD/MM/YYYY HH:mm:ss');
    }
}
