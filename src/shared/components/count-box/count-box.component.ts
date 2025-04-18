import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-count-box',
    templateUrl: './count-box.component.html',
    styleUrls: ['./count-box.component.scss'],
})
export class CountBoxComponent implements OnInit {
    @Input() label: string;
    @Input() value: any;

    constructor() {}

    ngOnInit() {}
}
