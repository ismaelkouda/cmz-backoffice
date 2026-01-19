import { Injectable, inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

@Injectable({ providedIn: 'root' })
export class UiFeedbackService {
    private readonly toastrService = inject(ToastrService);
    private readonly translateService = inject(TranslateService);

    success(key: string): void {
        this.toastrService.success(this.translateService.instant(key));
    }

    error(key: string): void {
        this.toastrService.error(this.translateService.instant(key));
    }

    errorFromApi(error: any): void {
        this.toastrService.error(this.translateService.instant(error?.error?.message));
    }

}
