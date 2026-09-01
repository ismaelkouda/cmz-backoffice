import {
    Component,
    computed,
    effect,
    inject,
    OnDestroy,
    signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { ForgotPasswordFacade } from '@presentation/pages/authentication/application/services/forgot-password/forgot-password.facade';
import { LOGIN_ROUTE } from '@presentation/pages/authentication/presentation/features/login/login-paths.constants';
import { AUTH } from '@presentation/app.routes';

const DEFAULT_RETRY_AFTER_SECONDS = 60;

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
    protected readonly hasEmail = this.facade.submittedEmail;
    protected readonly maskedEmail = computed(() =>
        this.maskEmail(this.facade.submittedEmail())
    );

    protected readonly resendCountdown = signal(0);
    protected readonly countdownLabel = computed(() =>
        this.formatCountdown(this.resendCountdown())
    );
    protected readonly resendDisabled = computed(
        () => this.resendCountdown() > 0 || !this.hasEmail() || this.loading()
    );

    private timer: ReturnType<typeof setInterval> | null = null;

    constructor() {
        effect(() => {
            this.facade.retryAfter();
            this.facade.startedAt();
            this.recomputeRemaining();
        });
        this.recomputeRemaining();
        this.timer = setInterval(() => this.recomputeRemaining(), 1000);
    }

    protected onResend(): void {
        const email = this.facade.submittedEmail();
        if (!email || this.resendDisabled()) {
            return;
        }
        this.facade.execute({ email });
    }

    protected goToLogin(): void {
        this.router.navigate(['/', AUTH, LOGIN_ROUTE]);
    }

    private recomputeRemaining(): void {
        const retryAfter = this.facade.retryAfter();
        const startedAt = this.facade.startedAt();
        if (!retryAfter) {
            const fallback = this.hasEmail() ? DEFAULT_RETRY_AFTER_SECONDS : 0;
            this.resendCountdown.set(fallback);
            return;
        }
        const elapsed = Math.floor(
            (Date.now() - (startedAt || Date.now())) / 1000
        );
        this.resendCountdown.set(Math.max(0, retryAfter - elapsed));
    }

    private maskEmail(email: string): string {
        if (!email || !email.includes('@')) {
            return email;
        }
        const [local, domain] = email.split('@');
        const head = local.charAt(0);
        const tail = local.length > 2 ? local.charAt(local.length - 1) : '';
        return `${head}***${tail}@${domain}`;
    }

    private formatCountdown(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(
            remainingSeconds
        ).padStart(2, '0')}`;
    }

    ngOnDestroy(): void {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}
