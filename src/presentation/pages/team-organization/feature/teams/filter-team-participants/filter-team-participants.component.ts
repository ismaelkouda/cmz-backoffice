import {
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Subject } from 'rxjs';

export interface TeamParticipantsFilterFormInterface {
    matricule: FormControl<string>;
}

export interface TeamParticipantsFilterInterface {
    matricule?: string;
}

@Component({
    selector: 'app-filter-team-participants',
    standalone: true,
    templateUrl: './filter-team-participants.component.html',
    styleUrls: ['./filter-team-participants.component.scss'],
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        InputTextModule,
        ButtonModule,
        RippleModule,
    ],
})
export class FilterTeamParticipantsComponent implements OnInit, OnDestroy {
    @Output() filter = new EventEmitter<TeamParticipantsFilterInterface>();

    public formFilter!: FormGroup<TeamParticipantsFilterFormInterface>;
    private readonly destroy$ = new Subject<void>();
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);

    ngOnInit(): void {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        if (!this.formFilter) {
            this.formFilter =
                this.fb.group<TeamParticipantsFilterFormInterface>({
                    matricule: new FormControl<string>('', {
                        nonNullable: true,
                    }),
                });
        }
    }

    public onSubmitFilterForm(): void {
        const filterData: TeamParticipantsFilterInterface = {
            matricule: this.formFilter.get('matricule')?.value?.trim() ?? '',
        };

        if (this.formFilter.valid) {
            this.filter.emit(filterData);
        } else {
            const translatedMessage = 'COMMON.FORM_INVALID';
            this.toastService.error(translatedMessage);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
