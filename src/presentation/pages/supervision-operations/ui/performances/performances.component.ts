import { Component, OnInit } from '@angular/core';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-performances',
  templateUrl: './performances.component.html',
  styleUrls: ['./performances.component.scss']
})
export class PerformancesComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    localStorage.setItem('layout', 'Barcelona');

  }

  showInfos(data) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })
    if (data === 'dmt') {
      swalWithBootstrapButtons.fire({
        icon: 'info',
        html: '<b style="font-size:30px;">Délai Moyen de Traitement</b><br><p style="font-size:19px;">Le Délai Moyen de traitement (DMT) est un indicateur clé pour mesurer la performance des équipes de traitements. Il représente la durée moyenne d\'une demande entre sa création et sa clôture.</p>',
        confirmButtonColor: '#F07427',
        confirmButtonText: 'ok',
      });
    } else {
      swalWithBootstrapButtons.fire({
        icon: 'info',
        html: '<b style="font-size:30px;">Service-Level Agreement </b><br><p style="font-size:19px;">Un accord de niveau de service, ou SLA (Service-Level Agreement), est un engagement de niveau de services sur la durée maximale de traitement des demandes emises. Cet engagement relate les services que le fournisseur met à disposition et des paramètres comme leurs disponibilités ou les temps de réponse.</p>',
        confirmButtonColor: '#F07427',
        confirmButtonText: 'ok',
      });
    }
  }

}
