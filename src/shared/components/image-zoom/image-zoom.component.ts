import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    Renderer2,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-image-zoom',
    standalone: true,
    templateUrl: './image-zoom.component.html',
    styleUrls: ['./image-zoom.component.scss'],
    imports: [CommonModule, DialogModule],
})
export class ImageZoomComponent implements OnInit {
    @Input() src!: string;
    @Input() label?: string;

    zoomVisible = false;
    lensPosition = { top: 0, left: 0 };
    backgroundPosition = '0% 0%';
    alignRight = false;
    private rect!: DOMRect;

    rotation = 0;
    modalVisible = false;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) {}

    ngOnInit() {}

    rotateLeft() {
        this.rotation = (this.rotation - 90) % 360;
    }

    rotateRight() {
        this.rotation = (this.rotation + 90) % 360;
    }

    openModal() {
        this.modalVisible = true;
        this.onLeave();
    }

    @HostListener('mouseenter', ['$event'])
    onEnter(event: MouseEvent) {
        this.rect = (this.el.nativeElement as HTMLElement)
            .querySelector('.image-wrapper')!
            .getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const imageRight = this.rect.right;
        this.alignRight = imageRight + 450 > windowWidth;
        this.zoomVisible = true;
    }

    @HostListener('mousemove', ['$event'])
    onMove(event: MouseEvent) {
        if (!this.zoomVisible || this.modalVisible) return;

        const x = event.clientX - this.rect.left;
        const y = event.clientY - this.rect.top;
        const lensSize = 120;

        this.lensPosition = {
            top: Math.max(
                0,
                Math.min(y - lensSize / 2, this.rect.height - lensSize)
            ),
            left: Math.max(
                0,
                Math.min(x - lensSize / 2, this.rect.width - lensSize)
            ),
        };

        const xPercent = (x / this.rect.width) * 100;
        const yPercent = (y / this.rect.height) * 100;
        this.backgroundPosition = `${xPercent}% ${yPercent}%`;
    }

    @HostListener('mouseleave')
    onLeave() {
        this.zoomVisible = false;
    }
}
