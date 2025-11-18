import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import moment from 'moment';

@Component({
    selector: 'app-page-title',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './page-title.component.html',
    styleUrls: ['./page-title.component.scss'],
})
export class PageTitleComponent {
    currentDate: string;
    @Input() title!: string;
    @Input() displayDate = true;
    @Input() displayList = true;

    constructor() {
        const dateActuelle = moment();
        this.currentDate = dateActuelle.format('DD/MM/YYYY HH:mm:ss');
    }
}
