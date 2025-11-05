import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'app-tap-to-top',
    standalone: true,
    templateUrl: './tap-to-top.component.html',
    styleUrls: ['./tap-to-top.component.scss'],
    imports: [CommonModule]
})
export class TapToTopComponent {
    public show: boolean = false;

    constructor(private viewScroller: ViewportScroller) {}

    // @HostListener Decorator
    @HostListener('window:scroll', [])
    onWindowScroll() {
        let number =
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;
        if (number > 600) {
            this.show = true;
        } else {
            this.show = false;
        }
    }

    tapToTop() {
        this.viewScroller.scrollToPosition([0, 0]);
    }
}
