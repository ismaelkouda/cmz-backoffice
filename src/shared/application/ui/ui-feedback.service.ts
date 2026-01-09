import { Injectable, inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ApiError } from "@shared/domain/errors/api.error";
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

    errorFromApi(error: unknown): void {
        if (error instanceof ApiError) {
            this.toastrService.error(this.translateService.instant(error.code));
            return;
        }
        this.toastrService.error(this.translateService.instant('COMMON.ERROR.GENERIC'));
    }

}
