import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
//import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { convertUrlToBase64 } from '../../../../functions/convertUrlToBase64';
import { InvoiceFormDetailsInterface } from '../interfaces/invoice-form-details.interface';

@Injectable({
    providedIn: 'root',
})
export class InvoicePdfService {
    private pdfMake: any;
    
    //constructor() {
      //:  (pdfMake as any).vfs = pdfFonts.vfs;
    //}

    async generateInvoice(
        data: InvoiceFormDetailsInterface,
        logoUrl?: string,
        qrCodeUrl?: string
    ): Promise<void> {
        const logoBase64 = logoUrl ? await this.loadLogo(logoUrl) : undefined;
        const qrCodeBase64 = qrCodeUrl
            ? await this.loadQrCode(qrCodeUrl)
            : undefined;
        const documentDefinition = this.getDocumentDefinition(
            data,
            logoBase64,
            qrCodeBase64
        );
        (pdfMake as any)
            .createPdf(documentDefinition)
            .download(`facture-imako-${data.numero_demande}.pdf`);
    }

    private async loadLogo(url: string): Promise<string | undefined> {
        try {
            return await convertUrlToBase64(url);
        } catch (err) {
            console.warn('Impossible de charger le logo', err);
            return undefined;
        }
    }

    private async loadQrCode(url: string): Promise<string | undefined> {
        try {
            return await convertUrlToBase64(url);
        } catch (err) {
            console.warn('Impossible de charger le QR Code', err);
            return undefined;
        }
    }

    private getDocumentDefinition(
        data: InvoiceFormDetailsInterface,
        logoBase64?: string,
        qrCodeBase64?: string
    ): any {
        return {
            pageSize: 'A4',
            pageMargins: [40, 40, 40, 60],
            content: [
                this.createHeader(data, logoBase64, qrCodeBase64),
                this.createCompanyInfo(data),
                this.createClientMessage(),
                this.createItemsTable(data),
                this.createFinalAmount(data),
                this.createFinalAmountText(data),
                this.createFooter(data),
            ],
            styles: this.getStyles(),
        };
    }

    private getStyles() {
        return {
            header: {
                fontSize: 18,
                bold: true,
                color: '#1a4f72',
                margin: [0, 0, 0, 10],
            },
            subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
            tableHeader: {
                bold: true,
                fontSize: 10,
                color: 'white',
                fillColor: '#1a4f72',
                alignment: 'center',
            },
            tableCell: { fontSize: 9, margin: [0, 3, 0, 3] },
            totalRow: { bold: true, fontSize: 10, fillColor: '#f0f0f0' },
            grandTotal: { bold: true, fontSize: 11, fillColor: '#e3f2fd' },
        };
    }

    private createHeader(
        data: InvoiceFormDetailsInterface,
        logoBase64?: string,
        qrCodeBase64?: string
    ) {
        return {
            columns: [
                {
                    width: '50%',
                    stack: [
                        logoBase64
                            ? { image: logoBase64, width: 100 }
                            : {
                                  text: 'Logo Fournisseur',
                                  italics: true,
                                  color: 'gray',
                              },
                        {
                            margin: [0, 10, 0, 0],
                            stack: [
                                {
                                    text: `NCC : ${
                                        data.fournisseurInfo?.cc || 'N/A'
                                    }`,
                                    fontSize: 9,
                                },
                                {
                                    text: `Régime d'imposition : ${
                                        data.fournisseurInfo
                                            ?.regime_imposition || 'N/A'
                                    }`,
                                    fontSize: 9,
                                },
                                {
                                    text: `Centre des impôts : ${
                                        data.fournisseurInfo.centre_impot ||
                                        'N/A'
                                    }`,
                                    fontSize: 9,
                                },
                            ],
                        },
                    ],
                },
                {
                    width: '50%',
                    stack: [
                        {
                            text: `Facture N°: ${data.numero_demande || 'N/A'}`,
                            bold: true,
                            alignment: 'left',
                            margin: [0, 0, 0, 10],
                        },
                        qrCodeBase64
                            ? {
                                  image: qrCodeBase64,
                                  width: 100,
                                  alignment: 'left',
                              }
                            : {
                                  text: 'QR Code',
                                  italics: true,
                                  color: 'gray',
                                  alignment: 'center',
                              },
                        {
                            margin: [0, 10, 0, 0],
                            stack: [
                                {
                                    text: `Nom : ${
                                        data.clientInfo.nom_tenant || 'N/A'
                                    }`,
                                    fontSize: 9,
                                    alignment: 'left',
                                },
                                {
                                    text: `NCC : ${
                                        data.clientInfo.numero_cc || 'N/A'
                                    }`,
                                    fontSize: 9,
                                    alignment: 'left',
                                },
                                {
                                    text: `Régime d'imposition : ${
                                        data.clientInfo.regime_code || 'N/A'
                                    }`,
                                    fontSize: 9,
                                    alignment: 'left',
                                },
                            ],
                        },
                    ],
                },
            ],
            margin: [0, 0, 0, 20],
        };
    }

    private createCompanyInfo(data: InvoiceFormDetailsInterface) {
        return {
            columns: [
                {
                    width: '50%',
                    stack: [
                        { text: 'Informations IMAKO', style: 'subheader' },
                        {
                            text: `RCCM: ${
                                data.fournisseurInfo?.rccm || 'N/A'
                            }`,
                        },
                        {
                            text: `Références bancaires: ${
                                data.fournisseurInfo?.banque || 'N/A'
                            }`,
                        },
                        {
                            text: `Établissement: ${
                                data.fournisseurInfo?.nom_entreprise || 'N/A'
                            }`,
                        },
                        {
                            text: `Adresse: ${
                                data.fournisseurInfo?.adresse || 'N/A'
                            }`,
                        },
                        {
                            text: `Tél: ${
                                data.fournisseurInfo?.contact_responsable ||
                                'N/A'
                            }`,
                        },
                        {
                            text: `Email: ${
                                data.fournisseurInfo?.email_responsable || 'N/A'
                            }`,
                        },

                        {
                            text: `Nom du vendeur: ${
                                data.fournisseurInfo?.nom_responsable || 'N/A'
                            }`,
                        },
                        {
                            text: `Date et heure: ${
                                data.fournisseurInfo?.contact_responsable ||
                                'N/A'
                            }`,
                        },
                        {
                            text: `Mode de paiement: ${
                                data.fournisseurInfo?.mode_paiement || 'N/A'
                            }`,
                        },
                    ],
                },
                {
                    width: '50%',
                    stack: [
                        { text: 'Informations Client', style: 'subheader' },
                        {
                            text: `Nom: ${
                                data.clientInfo?.nom_tenant || 'N/A'
                            }`,
                        },
                        {
                            text: `Adresse: ${
                                data.clientInfo?.adresse || 'N/A'
                            }`,
                        },
                        {
                            text: `Contacts: ${
                                data.clientInfo?.contact_admin_tenant || 'N/A'
                            }`,
                        },
                        { text: `NCC: ${data.clientInfo?.numero_cc || 'N/A'}` },
                        { text: `Régime: ${data.clientInfo?.regime || 'N/A'}` },
                    ],
                },
            ],
            margin: [0, 0, 0, 20],
        };
    }

    private createClientMessage() {
        return {
            text: [
                { text: 'Message Important\n', style: 'subheader' },
                'Bonjour cher client,\nVeuillez trouver ci-joint votre facture.\n',
                'Nous vous remercions de votre confiance et restons à votre disposition pour toute question ou information complémentaire.\nBien cordialement,',
            ],
            margin: [0, 0, 0, 20],
        };
    }

    private createItemsTable(data: InvoiceFormDetailsInterface) {
        return {
            table: {
                widths: ['18%', '30%', '11%', '10%', '10%', '10%', '11%'],
                body: [
                    [
                        { text: 'Réf', style: 'tableHeader' },
                        { text: 'Désignation', style: 'tableHeader' },
                        { text: 'P.U. HT', style: 'tableHeader' },
                        { text: 'Qté', style: 'tableHeader' },
                        { text: 'Taxes (%)', style: 'tableHeader' },
                        { text: 'Rem. (%)', style: 'tableHeader' },
                        { text: 'Montant HT', style: 'tableHeader' },
                    ],

                    [
                        {
                            text: data.numero_demande || 'N/A',
                            style: 'tableCell',
                        },
                        {
                            text: "Fourniture d'une solution de SIM Monitoring",
                            style: 'tableCell',
                        },
                        {
                            text: data.facture.prix_unitaire || '0',
                            style: 'tableCell',
                            alignment: 'right',
                        },
                        {
                            text: data.facture.qte || '1',
                            style: 'tableCell',
                            alignment: 'center',
                        },
                        {
                            text: data.facture.tva || '0',
                            style: 'tableCell',
                            alignment: 'center',
                        },
                        {
                            text: data.facture.remise || '0',
                            style: 'tableCell',
                            alignment: 'center',
                        },
                        {
                            text: data.facture.prix_ht || '0',
                            style: 'tableCell',
                            alignment: 'right',
                        },
                    ],

                    [
                        {
                            text: 'TOTAL HT',
                            colSpan: 6,
                            alignment: 'right',
                            style: 'tableCell',
                        },
                        {},
                        {},
                        {},
                        {},
                        {},
                        {
                            text: data.facture.prix_ht || '0',
                            style: 'tableCell',
                            alignment: 'right',
                        },
                    ],
                    [
                        {
                            text: `TVA (${data.facture.tva || '0'}%)`,
                            colSpan: 6,
                            alignment: 'right',
                            style: 'tableCell',
                        },
                        {},
                        {},
                        {},
                        {},
                        {},
                        {
                            text: data.facture.prix_tva || '0',
                            style: 'tableCell',
                            alignment: 'right',
                        },
                    ],
                    [
                        {
                            text: 'TOTAL TTC',
                            colSpan: 6,
                            alignment: 'right',
                            style: 'totalRow',
                        },
                        {},
                        {},
                        {},
                        {},
                        {},
                        {
                            text: data.facture.prix_ttc || '0',
                            style: 'totalRow',
                            alignment: 'right',
                        },
                    ],
                    [
                        {
                            text: 'TOTAL À PAYER',
                            colSpan: 6,
                            alignment: 'right',
                            style: 'grandTotal',
                        },
                        {},
                        {},
                        {},
                        {},
                        {},
                        {
                            text: data.facture.prix_ttc || '0',
                            style: 'grandTotal',
                            alignment: 'right',
                        },
                    ],
                ],
            },
            // layout: 'lightHorizontalLines',
            margin: [0, 0, 0, 15],
        };
    }

    private createFinalAmount(data: InvoiceFormDetailsInterface) {
        return {
            stack: [
                {
                    text: 'RESUME DE LA FACTURE',
                    style: 'subheader',
                    margin: [0, 0, 0, 10],
                },
                {
                    table: {
                        widths: ['40%', '20%', '20%', '20%'],
                        body: [
                            [
                                { text: 'CATÉGORIE', style: 'tableHeader' },
                                { text: 'SOUS-TOTAL', style: 'tableHeader' },
                                { text: 'TAUX (%)', style: 'tableHeader' },
                                { text: 'TOTAL TAXES', style: 'tableHeader' },
                            ],
                            [
                                {
                                    text: 'TVA normal : TVA sur HT IB/DVR - A',
                                    style: 'tableCell',
                                },
                                {
                                    text: data.facture.prix_ht || '0',
                                    style: 'tableCell',
                                    alignment: 'right',
                                },
                                {
                                    text: data.facture.tva || '0',
                                    style: 'tableCell',
                                    alignment: 'center',
                                },
                                {
                                    text: data.facture.prix_tva || '0',
                                    style: 'tableCell',
                                    alignment: 'right',
                                },
                            ],
                        ],
                    },
                    // layout: 'lightHorizontalLines'
                },
            ],
            // margin: [0, 20, 0, 20]
        };
    }

    private createFooter(data: InvoiceFormDetailsInterface) {
        return {
            text: [
                {
                    text: `RCCM : ${
                        data?.fournisseurInfo?.rccm ?? 'N/A'
                    } - CC : ${data.fournisseurInfo?.cc ?? 'N/A'} – ${
                        data.fournisseurInfo?.adresse ?? 'N/A'
                    }`,
                    fontSize: 8,
                },
                {
                    text: `Tel : ${
                        data?.fournisseurInfo?.contact_1 ?? 'N/A'
                    } // ${
                        data?.fournisseurInfo?.contact_2 ?? 'N/A'
                    } - Email : ${
                        data?.fournisseurInfo?.email ?? 'N/A'
                    } - Web: ${data?.fournisseurInfo?.site_web ?? 'N/A'}`,
                    fontSize: 8,
                },
                {
                    text: `- ${data?.fournisseurInfo?.banque ?? 'N/A'} : ${
                        data?.fournisseurInfo?.compte ?? 'N/A'
                    }`,
                    fontSize: 8,
                },
            ],
            alignment: 'center',
            margin: [0, 15, 0, 0],
        };
    }

    private createFinalAmountText(data: InvoiceFormDetailsInterface) {
        return {
            text: `Arrêté cette facture à la somme de ${
                data.prix_ttc_lettres || 'N/A'
            } Fcfa TTC sauf erreur.`,
            italics: true,
            alignment: 'center',
            margin: [0, 10, 0, 20],
        };
    }
}
