import {
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
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

export interface ProfileUsersFilterFormInterface {
    matricule: FormControl<string>;
}

export interface ProfileUsersFilterInterface {
    matricule?: string;
}

@Component({
    selector: 'app-filter-profile-users',
    standalone: true,
    templateUrl: './filter-profile-users.component.html',
    styleUrls: ['./filter-profile-users.component.scss'],
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        InputTextModule,
        ButtonModule,
        RippleModule,
    ],
})
export class FilterProfileUsersComponent implements OnInit, OnDestroy {
    @Output() filter = new EventEmitter<ProfileUsersFilterInterface>();

    public formFilter!: FormGroup<ProfileUsersFilterFormInterface>;
    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly toastService: ToastrService,
        private readonly fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        if (!this.formFilter) {
            this.formFilter = this.fb.group<ProfileUsersFilterFormInterface>({
                matricule: new FormControl<string>('', {
                    nonNullable: true,
                }),
            });
        }
    }

    public onSubmitFilterForm(): void {
        const filterData: ProfileUsersFilterInterface = {
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
