import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MappingService } from 'src/shared/services/mapping.service';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

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

  constructor(
    private route: ActivatedRoute,
    private patrimoineService: PatrimoineService,
    private toastrService: ToastrService,
    private mappingService: MappingService,
  ) {
    this.baseUrl = this.mappingService.baseUrl.replace("/api/v1", "");  
  }

  ngOnInit() {
    this.GetAllDownlaod()
    this.route.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[5];
    });
  }

  public GetAllDownlaod(): void {
    this.patrimoineService
      .GetAllDownlaod()
      .subscribe({
        next: (response) => {
          this.listFiles = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.page = response.data?.current_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public onPageChange(event) {
    this.p = event;
    this.GetAllDownlaod()
  }
  downloadFile(data) {
    if (data) {
      window.open(this.baseUrl + data.url_fichier)
    }
  }

}
