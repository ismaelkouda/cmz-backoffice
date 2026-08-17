import { Component, inject, output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-password-change',
    templateUrl: './password-change.component.html',
    styleUrl: './password-change.component.scss',
})
export class PasswordChangeComponent {
    private readonly toastService = inject(ToastrService);
    public readonly submitPasswordChange = output();
    public readonly closePasswordChange = output();
}
