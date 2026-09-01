import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { ForgotPasswordFacade } from '@presentation/pages/authentication/application/services/forgot-password/forgot-password.facade';
import { LOGIN_ROUTE } from '@presentation/pages/authentication/presentation/features/login/login-paths.constants';
import { AUTH } from '@presentation/app.routes';

const RESEND_COOLDOWN_SECONDS = 60;

@Component({
    selector: 'app-check-email',
    standalone: true,
    templateUrl: './check-email.component.html',
    styleUrls: ['./check-email.component.scss'],
    imports: [TranslateModule, RouterLink],
})
export class CheckEmailComponent implements OnDestroy {
    private readonly router = inject(Router);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly facade = inject(ForgotPasswordFacade);

    protected readonly AUTH = AUTH;
    protected readonly LOGIN_ROUTE = LOGIN_ROUTE;
    protected readonly AUTH_LOGO = this.appConfig.customization.assets.authLogo;
    protected readonly APP_NAME = this.appConfig.customization.app.name;

    protected readonly loading = this.facade.loading;
    protected readonly resendCountdown = signal(0);
    protected readonly countdownLabel = computed(() =>
        this.formatCountdown(this.resendCountdown())
    );

    private timer: ReturnType<typeof setInterval> | null = null;

    protected onResend(): void {
        const email = this.facade.submittedEmail();
        if (!email || this.resendCountdown() > 0 || this.facade.loading()) {
            return;
        }
        this.facade.execute({ email });
        this.startCountdown();
    }

    protected goToLogin(): void {
        this.router.navigate(['/', AUTH, LOGIN_ROUTE]);
    }

    private startCountdown(): void {
        this.stopTimer();
        this.resendCountdown.set(RESEND_COOLDOWN_SECONDS);
        this.timer = setInterval(() => {
            const next = this.resendCountdown() - 1;
            if (next <= 0) {
                this.resendCountdown.set(0);
                this.stopTimer();
            } else {
                this.resendCountdown.set(next);
            }
        }, 1000);
    }

    private stopTimer(): void {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    private formatCountdown(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(
            remainingSeconds
        ).padStart(2, '0')}`;
    }

    ngOnDestroy(): void {
        this.stopTimer();
    }
}
