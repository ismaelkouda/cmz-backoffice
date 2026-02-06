import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    inject,
    Input,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-image-zoom',
    standalone: true,
    templateUrl: './image-zoom.component.html',
    styleUrls: ['./image-zoom.component.scss'],
    imports: [CommonModule, DialogModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageZoomComponent {
    private readonly el: ElementRef = inject(ElementRef);
    @Input() src!: string;
    @Input() label?: string;

    zoomVisible = false;
    lensPosition = { top: 0, left: 0 };
    backgroundPosition = '0% 0%';
    alignRight = false;
    private rect!: DOMRect;

    rotation = 0;
    modalVisible = false;

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

    @HostListener('mouseenter')
    onEnter() {
        const imageWrapper =
            this.el.nativeElement.querySelector('.image-wrapper');
        if (!imageWrapper) {
            return;
        }
        this.rect = imageWrapper.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const imageRight = this.rect.right;
        this.alignRight = imageRight + 450 > windowWidth;
        this.zoomVisible = true;
    }

    @HostListener('mousemove', ['$event'])
    onMove(event: MouseEvent) {
        if (!this.zoomVisible || this.modalVisible) {
            return;
        }

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
