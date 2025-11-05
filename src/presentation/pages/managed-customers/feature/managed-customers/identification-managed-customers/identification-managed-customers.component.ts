import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { ManagedCustomersDetailsInterface } from '../../../data-access/managed-customers/interfaces/managed-customers-details.interface';

@Component({
    selector: 'app-identification-managed-customers',
    standalone: true,
    templateUrl: './identification-managed-customers.component.html',
    styleUrls: ['./identification-managed-customers.component.scss'],
    imports: [TranslateModule, ButtonModule],
})
export class IdentificationManagedCustomersComponent {
    @Input() customerDetails!: ManagedCustomersDetailsInterface;
    public indexTabPanelActive!: number;

    constructor(public toastService: ToastrService) {}

    public viewFile(field: keyof ManagedCustomersDetailsInterface) {
        const defaultFile: string = this.customerDetails?.[field] as string;
        if (!defaultFile) {
            this.toastService.info('Aucun fichier à afficher');
            return;
        }
        if (defaultFile) window.open(defaultFile, '_blank');
    }
}
