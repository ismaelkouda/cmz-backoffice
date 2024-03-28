import { Component, OnInit } from '@angular/core';
import { SupervisionSystemeService } from '../../data-access/supervision-systeme.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-taux-des-charges',
  templateUrl: './taux-des-charges.component.html',
  styleUrls: ['./taux-des-charges.component.scss']
})
export class TauxDesChargesComponent implements OnInit {

  listeTaux: Array<any> = [];
  showIframe: boolean = false;
  url: string;
  nom: any

  constructor(
    private supervisionSystemeService: SupervisionSystemeService,
    private toastrService: ToastrService,

  ) { }

  ngOnInit() {
    this.GetAllTauxCharges()
  }



  public GetAllTauxCharges() {
    this.supervisionSystemeService
      .GetAllTauxCharges({})
      .subscribe({
        next: (response) => {
          this.listeTaux = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }


  visualiser(url: string, nom: string): void {
    this.url = url;
    this.showIframe = true;
    this.nom = nom;
  }
}
