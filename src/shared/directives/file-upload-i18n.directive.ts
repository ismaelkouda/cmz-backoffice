import {
    AfterViewInit,
    Directive,
    ElementRef,
    Input,
    Renderer2,
} from '@angular/core';

@Directive({
    selector: '[appFileUploadI18n]',
})
export class FileUploadI18nDirective implements AfterViewInit {
    @Input() emptyLabel = 'Aucun fichier sélectionné';

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) {}

    ngAfterViewInit(): void {
        const host: HTMLElement = this.el.nativeElement;

        // input[type="file"]
        const input = host.querySelector('input[type="file"]');
        if (!input) return;

        // span label affichant le nom du fichier
        const label = host.querySelector('.p-fileupload-filename');

        if (label) {
            this.renderer.setProperty(label, 'textContent', this.emptyLabel);
        }

        input.addEventListener('change', () => {
            const files = (input as HTMLInputElement).files;
            if (!files || files.length === 0) {
                this.renderer.setProperty(
                    label,
                    'textContent',
                    this.emptyLabel
                );
            } else {
                this.renderer.setProperty(label, 'textContent', files[0].name);
            }
        });
    }
}
