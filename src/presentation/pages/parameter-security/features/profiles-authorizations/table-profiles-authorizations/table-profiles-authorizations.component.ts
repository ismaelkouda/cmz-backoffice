import { ProfilesAuthorizationsInterface } from './../../../data-access/profiles-authorizations/interfaces/profiles-authorizations.interface';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import {
    PROFILES_AUTHORIZATIONS_STATE_ENUM,
    T_PROFILES_AUTHORIZATIONS_STATE_ENUM,
} from '../../../data-access/profiles-authorizations/enums/profiles-authorizations-state.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JournalComponent } from '../../../../../../shared/components/journal/journal.component';
import { ModalParams } from '../../../../../../shared/constants/modalParams.contant';
import { PROFILES_AUTHORIZATIONS_TABLE } from '../../../data-access/profiles-authorizations/constants/profiles-authorizations-table.constant';
import { ProfilesAuthorizationsPageActionsType } from '../../../data-access/profiles-authorizations/types/profiles-authorizations-page-actions.type';
import { PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM } from '../../../data-access/profiles-authorizations/enums/profiles-authorizations-buttons-actions.enum';
import { ProfilesAuthorizationsApiService } from '../../../data-access/profiles-authorizations/services/profiles-authorizations-api.service';

type TYPE_COLOR_STATE_BADGE = 'badge-success' | 'badge-danger';

@Component({
    selector: 'app-table-profiles-authorizations',
    templateUrl: './table-profiles-authorizations.component.html',
    styleUrls: ['./table-profiles-authorizations.component.scss'],
})
export class TableProfilesAuthorizationsComponent {
    public nbDataPerPage = 50;
    @Output() interfaceUser =
        new EventEmitter<ProfilesAuthorizationsPageActionsType>();

    @Input() spinner: boolean;
    @Input() listProfilesAuthorizations$: Observable<
        Array<ProfilesAuthorizationsInterface>
    > = new BehaviorSubject<Array<ProfilesAuthorizationsInterface>>([]);

    public profilesAuthorizationsSelected: ProfilesAuthorizationsInterface;
    public table: TableConfig = PROFILES_AUTHORIZATIONS_TABLE;
    private destroy$ = new Subject<void>();

    public PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM =
        PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM;
    public PROFILES_AUTHORIZATIONS_STATE_ENUM =
        PROFILES_AUTHORIZATIONS_STATE_ENUM;

    constructor(
        private toastService: ToastrService,
        private ngbModal: NgbModal,
        private clipboardService: ClipboardService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService,
        private profilesAuthorizationsApiService: ProfilesAuthorizationsApiService
    ) {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public pageCallback() {
        return this.profilesAuthorizationsApiService.fetchProfilesAuthorizations();
    }

    public onExportExcel(): void {
        this.profilesAuthorizationsApiService
            .getProfilesAuthorizations()
            .pipe(take(1))
            .subscribe((profilesAuthorizations) => {
                if (profilesAuthorizations) {
                    this.tableExportExcelFileService.exportAsExcelFile(
                        profilesAuthorizations,
                        this.table,
                        'list_profiles_authorizations'
                    );
                } else {
                    this.toastService.error(
                        this.translate.instant('NO_DATA_TO_EXPORT')
                    );
                }
            });
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant(
            'COPIED_TO_THE_CLIPBOARD'
        );
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    public getStateBadge(selectedProfilesAuthorizations?: {
        statut: T_PROFILES_AUTHORIZATIONS_STATE_ENUM;
    }): TYPE_COLOR_STATE_BADGE {
        if (
            !selectedProfilesAuthorizations ||
            !selectedProfilesAuthorizations.statut
        ) {
            return 'badge-danger';
        }

        const stateMap: Record<
            T_PROFILES_AUTHORIZATIONS_STATE_ENUM,
            TYPE_COLOR_STATE_BADGE
        > = {
            [PROFILES_AUTHORIZATIONS_STATE_ENUM.ACTIVE]: 'badge-success',
            [PROFILES_AUTHORIZATIONS_STATE_ENUM.INACTIVE]: 'badge-danger',
        };

        return stateMap[selectedProfilesAuthorizations.statut];
    }

    public handleAction(
        params: ProfilesAuthorizationsPageActionsType | any
    ): void {
        this.onSelectCustomerActivation(params.data);

        switch (params.view) {
            case 'modal':
                if (
                    params.action ===
                        PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM.ACTIVE ||
                    params.action ===
                        PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM.INACTIVE
                ) {
                }
                if (
                    params.action ===
                    PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM.DELETE
                ) {
                    this.handleJournal(params.data);
                }
                break;

            case 'page':
                this.interfaceUser.emit(params);
                break;
        }
    }

    private onSelectCustomerActivation(
        profilesAuthorizationsSelected: ProfilesAuthorizationsInterface
    ): void {
        this.profilesAuthorizationsSelected = profilesAuthorizationsSelected;
    }

    handleJournal(profilesAuthorizationsSelected: {
        numero_demande: string;
    }): void {
        const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
        modalRef.componentInstance.numero_demande =
            profilesAuthorizationsSelected?.numero_demande;
        modalRef.componentInstance.typeJournal = 'demandes-services';
    }

    public handleActionButtonSeeMoreStyle(profilesAuthorizationsSelected: {
        statut: string;
        nom: string;
    }): { class: string; icon: string; tooltip: string } {
        const VIEW_MORE = this.translate.instant('VIEW_MORE');
        switch (profilesAuthorizationsSelected?.statut) {
            default: {
                return {
                    class: 'p-button-dark',
                    icon: 'pi pi-eye',
                    tooltip: `${VIEW_MORE} ${profilesAuthorizationsSelected.nom}`,
                };
            }
        }
    }

    public handleActionButtonEditStyle(profilesAuthorizationsSelected: {
        statut: string;
        nom: string;
    }): {
        class: string;
        icon: string;
        tooltip: string;
    } {
        const EDIT_THE_PROFILE = this.translate.instant('EDIT_THE_PROFILE');
        const CANNOT_MODIFY_THE_PROFILE = this.translate.instant(
            'CANNOT_MODIFY_THE_PROFILE'
        );
        switch (profilesAuthorizationsSelected?.statut) {
            case PROFILES_AUTHORIZATIONS_STATE_ENUM.ACTIVE: {
                return {
                    class: 'p-button-secondary',
                    icon: 'pi pi-pencil',
                    tooltip: `${EDIT_THE_PROFILE} ${profilesAuthorizationsSelected?.nom}`,
                };
            }
        }
        return {
            class: 'p-button-secondary',
            icon: 'pi pi-times',
            tooltip: `${CANNOT_MODIFY_THE_PROFILE} ${profilesAuthorizationsSelected?.nom}`,
        };
    }

    public handleActionButtonAffectStyle(profilesAuthorizationsSelected: {
        statut: string;
        nom: string;
    }): {
        class: string;
        icon: string;
        tooltip: string;
    } {
        const AFFECT_THE_PROFILE = this.translate.instant('AFFECT_THE_PROFILE');
        const CANNOT_AFFECT_THE_PROFILE = this.translate.instant(
            'CANNOT_AFFECT_THE_PROFILE'
        );
        switch (profilesAuthorizationsSelected?.statut) {
            case PROFILES_AUTHORIZATIONS_STATE_ENUM.ACTIVE: {
                return {
                    class: 'p-button-dark',
                    icon: 'pi pi-arrow-right',
                    tooltip: `${AFFECT_THE_PROFILE} ${profilesAuthorizationsSelected?.nom}`,
                };
            }
        }
        return {
            class: 'p-button-secondary',
            icon: 'pi pi-times',
            tooltip: `${CANNOT_AFFECT_THE_PROFILE} ${profilesAuthorizationsSelected?.nom}`,
        };
    }
}
