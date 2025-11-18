import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-full',
    standalone: true,
    templateUrl: './full.component.html',
    styleUrls: ['./full.component.scss'],
    imports: [RouterOutlet],
})
export class FullComponent {}
