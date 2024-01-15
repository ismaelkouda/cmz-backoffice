import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MappingService } from 'src/shared/services/mapping.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

  public module: string;
  public subModule: string;
  public initialView: boolean = true;
  public listFiles: Array<any> = [];

  constructor(
    private route: ActivatedRoute,
    private mappingService: MappingService,
  ) {
    this.listFiles = [
      {
        id: 1,
        type: 'Base de données SIM',
        nom: 'nom_fichier',
        taille: 100,
        created_at: '2024-01-10 10:10:10'
      },
      {
        id: 1,
        type: 'Base de données SIM Actives',
        nom: 'nom_fichier',
        taille: 100,
        created_at: '2024-01-10 10:10:10'
      },
      {
        id: 1,
        type: 'Base de données SIM Suspendues',
        nom: 'nom_fichier',
        taille: 100,
        created_at: '2024-01-10 10:10:10'
      },
      {
        id: 1,
        type: 'Base de données SIM Résiliées',
        nom: 'nom_fichier',
        taille: 100,
        created_at: '2024-01-10 10:10:10'
      },
      {
        id: 5,
        type: 'Base de données SIM Portées',
        nom: 'nom_fichier',
        taille: 100,
        created_at: '2024-01-10 10:10:10'
      }
    ]
  }

  ngOnInit() {

    this.route.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[5];
    });
  }

}
