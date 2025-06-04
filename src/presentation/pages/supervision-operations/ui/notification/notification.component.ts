import { Component, OnInit } from '@angular/core';
import { SupervisionOperationService } from '../../data-access/supervision-operation.service';
import { ToastrService } from 'ngx-toastr';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { StoreLocaleService } from 'src/shared/services/store-locale.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
    public initialView: boolean = true;
    public listNotifys: Array<any> = [];
    public totalPage: 0;
    public totalRecords: 0;
    public recordsPerPage: 0;
    public offset: any;
    public p: number = 1;
    public page: number = 0;
    public showView: boolean = false;
    public currentData: any;
    public checkedAllConsumers: boolean = false;
    public checkconsumerList: any[] = [];
    public title = 'Notifications - Système de Gestion de Collecte Centralisée';

    constructor(
        private supervisionOperationService: SupervisionOperationService,
        private toastrService: ToastrService,
        private storage: EncodingDataService,
        private mappingService: MappingService,
        private titleService: Title,
        private storeLocaleService: StoreLocaleService
    ) {
        this.titleService.setTitle(`${this.title}`);
    }

    ngOnInit() {
        this.GetAllNotifications();
    }

    public GetAllNotifications(): void {
        this.supervisionOperationService.GetAllNotifications({}).subscribe({
            next: (response) => {
                this.listNotifys = response.data.data;
                this.totalPage = response.data.last_page;
                this.totalRecords = response.data.total;
                this.recordsPerPage = response.data.per_page;
                this.page = response.data?.current_page;
                this.offset =
                    (response.data.current_page - 1) * this.recordsPerPage + 1;
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }
    public OnCheckAllConsumer() {
        this.checkconsumerList = [];
        if (this.checkedAllConsumers) {
            this.listNotifys.forEach((consumer) => {
                consumer.checked = true;
                this.checkconsumerList.push(consumer.id);
            });
        } else {
            this.listNotifys.forEach((consumer) => {
                consumer.checked = false;
            });
            this.checkconsumerList.splice(0, this.checkconsumerList.length);
        }
    }
    public onCheckedOneConsumer(consumer: any) {
        if (this.checkconsumerList.includes(consumer.id)) {
            this.checkconsumerList.forEach((value, index) => {
                if (value == consumer.id)
                    this.checkconsumerList.splice(index, 1);
            });
        } else if (!this.checkconsumerList.includes(consumer.id)) {
            this.checkconsumerList.push(consumer.id);
        }
        if (this.checkconsumerList.length === this.listNotifys.length) {
            this.checkedAllConsumers = true;
        } else {
            this.checkedAllConsumers = false;
        }
    }

    OnReadNotification(): void {
        this.supervisionOperationService
            .ReadNotifications({
                notifications: this.checkconsumerList,
            })
            .subscribe({
                next: (response) => {
                    this.GetAllNotifications();
                    setTimeout(() => {
                        let user = JSON.parse(this.storage.getData('user'));
                        user.notifications = this.listNotifys.length;
                        this.mappingService.notifications =
                            this.listNotifys.length;
                        this.storage.saveData('user', JSON.stringify(user));
                        this.storeLocaleService.OnEmitNotify(
                            this.listNotifys.length
                        );
                    }, 1000);
                    this.toastrService.success(response.message);
                },
                error: (error) => {
                    this.toastrService.error(error.error.message);
                },
            });
    }

    public pushStatutView(event: boolean): void {
        this.showView = event;
        this.initialView = !event;
    }
    public onPageChange(event) {
        this.p = event;
        this.GetAllNotifications();
    }
}
