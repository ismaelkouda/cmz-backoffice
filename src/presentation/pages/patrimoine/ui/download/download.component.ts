import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MappingService } from 'src/shared/services/mapping.service';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { handle } from 'src/shared/functions/api.function';
import { Pargination } from 'src/shared/table/pargination';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html'
})

export class DownloadComponent implements OnInit {

  public itemDownload: {};
  public pargination = new Pargination(1, 50, 0, 0, 0, 1, 0);
  private response: any = {};
  public module: string;
  public subModule: string;
  public baseUrl: string;
  public initialView: boolean = true;
  public listFiles: Array<any> = [];
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public page: number = 0
  public title = 'Télechargements - Système de Gestion de Collecte Centralisée';

  constructor(private route: ActivatedRoute, private patrimoineService: PatrimoineService,
    private toastrService: ToastrService, private mappingService: MappingService,
    private titleService: Title, private loadingBar: LoadingBarService
  ) {
    this.baseUrl = this.mappingService.baseUrl.replace("/api/v1", "");
    this.titleService.setTitle(`${this.title}`);
  }

  ngOnInit() {
    this.pageCallback()
    this.route.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[4];
    });
  }

  async pageCallback(nbrPage: number = 1) {
    this.response = await handle(() => this.patrimoineService.GetAllDownlaod(nbrPage), this.toastrService, this.loadingBar);
    this.handleSuccessfulPageCallback(this.response);
  }

  private handleSuccessfulPageCallback(response): void {
    this.listFiles = response.data.data;
    this.pargination = new Pargination(response?.data?.p, response?.data?.to, response?.data?.last_page, response?.data?.total, response?.data?.per_page, response?.data?.current_page, (response?.data?.current_page - 1) * this.pargination?.per_page + 1);
  }

  public onPageChange(event: number) {
    this.p = event;
    this.pageCallback(event + 1)
  }
  downloadFile(data) {
    this.onMarkItemDownload(data);
    if (data) {
      window.open(this.baseUrl + data.url_fichier)
    }
  }

  onMarkItemDownload(data) {
    this.itemDownload = data;
  }

}
