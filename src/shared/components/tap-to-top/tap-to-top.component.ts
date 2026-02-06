import { CommonModule, ViewportScroller } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    inject,
} from '@angular/core';

@Component({
    selector: 'app-tap-to-top',
    standalone: true,
    templateUrl: './tap-to-top.component.html',
    styleUrls: ['./tap-to-top.component.scss'],
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TapToTopComponent {
    private readonly viewScroller = inject(ViewportScroller);
    public show = false;

    @HostListener('window:scroll', [])
    onWindowScroll() {
        const number =
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
