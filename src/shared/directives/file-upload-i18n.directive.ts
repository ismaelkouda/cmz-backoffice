import {
    AfterViewInit,
    Directive,
    ElementRef,
    Input,
    Renderer2,
    inject,
} from '@angular/core';

@Directive({
    selector: '[appFileUploadI18n]',
})
export class FileUploadI18nDirective implements AfterViewInit {
    private el = inject(ElementRef);
    private renderer = inject(Renderer2);

    @Input() emptyLabel = 'Aucun fichier sélectionné';

    ngAfterViewInit(): void {
        const host: HTMLElement = this.el.nativeElement;

        // input[type="file"]
        const input = host.querySelector('input[type="file"]');
        if (!input) {
            return;
        }

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
