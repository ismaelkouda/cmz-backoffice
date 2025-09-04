import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ManagedCustomersDetailsInterface } from '../../../data-access/managed-customers/interfaces/managed-customers-details.interface';

@Component({
    selector: 'app-identification-managed-customers',
    templateUrl: './identification-managed-customers.component.html',
    styleUrls: ['./identification-managed-customers.component.scss'],
})
export class IdentificationManagedCustomersComponent {
    @Input() customerDetails: ManagedCustomersDetailsInterface;
    public indexTabPanelActive: number;

    constructor(public toastService: ToastrService) {}

    public viewFile(field: string) {
        const defaultFile = this.customerDetails?.[field];
        if (!defaultFile) {
            this.toastService.info('Aucun fichier à afficher');
            return;
        }
        if (defaultFile) window.open(defaultFile, '_blank');
    }
}
