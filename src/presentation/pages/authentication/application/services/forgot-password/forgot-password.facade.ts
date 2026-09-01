import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { ForgotPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/forgot-password/forgot-password-response.entity';
import { ForgotPasswordRequestDto } from '@presentation/pages/authentication/application/dto/forgot-password/forgot-password-request.dto';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { ForgotPasswordRequestBus } from '@presentation/pages/authentication/application/commands-bus/forgot-password/forgot-password-request.bus';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { ForgotPasswordRequestCommand } from '@presentation/pages/authentication/application/commands/forgot-password/forgot-password-request.command';
import { AppStateService } from '@core/state/app-state.service';

export interface ForgotPasswordCooldownState {
    email: string;
    retryAfter: number;
    startedAt: number;
}

const COOLDOWN_STORAGE_KEY = 'auth.forgot-password';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordFacade extends ObjectBaseFacade<
    ForgotPasswordResponseEntity,
    ForgotPasswordRequestDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ForgotPasswordRequestBus);
    private readonly appState = inject(AppStateService);

    private readonly cooldown = signal<ForgotPasswordCooldownState>(
        this.readState()
    );

    readonly submittedEmail = computed(() => this.cooldown().email);
    readonly retryAfter = computed(() => this.cooldown().retryAfter);
    readonly startedAt = computed(() => this.cooldown().startedAt);

    constructor() {
        super();
        effect(() => {
            const item = this.items();
            if (!item) {
                return;
            }
            this.persist({
                email: this.cooldown().email,
                retryAfter: item.retryAfter,
                startedAt: Date.now(),
            });
        });
    }

    execute(dto: ForgotPasswordRequestDto): void {
        this.persist({
            email: dto.email,
            retryAfter: this.cooldown().retryAfter,
            startedAt: this.cooldown().startedAt,
        });
        const command = new ForgotPasswordRequestCommand(dto.email);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(dto, fetch$, this.ui);
    }

    private persist(state: ForgotPasswordCooldownState): void {
        this.appState.set(COOLDOWN_STORAGE_KEY, state);
        this.cooldown.set(state);
    }

    private readState(): ForgotPasswordCooldownState {
        return (
            this.appState.get<ForgotPasswordCooldownState>(
                COOLDOWN_STORAGE_KEY
            ) ?? { email: '', retryAfter: 0, startedAt: 0 }
        );
    }
}
