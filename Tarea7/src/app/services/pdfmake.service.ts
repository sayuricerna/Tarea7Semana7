import { Injectable } from '@angular/core';
import { Factura } from '../interfaces/factura.interface';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs ?? (pdfFonts as any).vfs;

@Injectable({ providedIn: 'root' })
export class PdfmakeService {

generarReporteGeneral(facturas: Factura[], descargar: boolean = true): void {
  const fecha = new Date().toLocaleDateString('es-EC');

  const filas = facturas.map((f, i) => [
    { text: (i + 1).toString(), alignment: 'center' },
    { text: f.numeroFactura ?? '',  fontSize: 8 },
    { text: f.cedulaRuc },
    { text: f.nombreCliente },
    { text: new Date(f.fecha).toLocaleDateString('es-EC'), alignment: 'center' },
    { text: `$ ${f.subtotal.toFixed(2)}`, alignment: 'right' },
    { text: `$ ${f.iva.toFixed(2)}`,      alignment: 'right' },
    { text: `$ ${f.total.toFixed(2)}`,    alignment: 'right', bold: true },
    { text: f.estado, alignment: 'center',
      color: f.estado === 'ACTIVA' ? '#28a745' : f.estado === 'ANULADA' ? '#dc3545' : '#0d6efd' }
  ]);

  const totalGeneral    = facturas.reduce((a, f) => a + f.total,    0);
  const subtotalGeneral = facturas.reduce((a, f) => a + f.subtotal, 0);
  const ivaGeneral      = facturas.reduce((a, f) => a + f.iva,      0);

  const docDefinition: any = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [30, 40, 30, 40],

    content: [
      // Encabezado
      {
        columns: [
          {
            stack: [
              { text: 'Tarea7 - Semana 7',     style: 'empresa' },
              { text: 'RUC: 1759026535555',  style: 'subEmpresa' },
              { text: 'Santo Domingo – Ecuador',     style: 'subEmpresa' },
            ]
          },
          {
            alignment: 'right',
            stack: [
              { text: 'REPORTE GENERAL DE FACTURAS', style: 'titulo' },
              { text: `Fecha de emisión: ${fecha}`,  style: 'subEmpresa' },
              { text: `Facturas totales: ${facturas.length}`, style: 'subEmpresa' },
            ]
          }
        ]
      },
      { canvas: [{ type: 'line', x1: 0, y1: 6, x2: 782, y2: 6, lineWidth: 1.5, lineColor: '#1a56db' }] },
      { text: '', margin: [0, 6] },

      // Tabla
      {
        table: {
          headerRows: 1,
          widths: [20, 90, 70, '*', 60, 55, 50, 60, 50],
          body: [
            ['#', 'N° Factura', 'Cédula/RUC', 'Cliente', 'Fecha',
             'Subtotal', 'IVA', 'Total', 'Estado'
            ].map(t => ({ text: t, style: 'tableHeader' })),
            ...filas,
            [
              { text: '', colSpan: 5, border: [false,true,false,false] }, {}, {}, {}, {},
              { text: `$ ${subtotalGeneral.toFixed(2)}`, alignment: 'right', bold: true, fillColor: '#e8f0fe' },
              { text: `$ ${ivaGeneral.toFixed(2)}`,      alignment: 'right', bold: true, fillColor: '#e8f0fe' },
              { text: `$ ${totalGeneral.toFixed(2)}`,    alignment: 'right', bold: true, color: '#1a56db', fillColor: '#e8f0fe', fontSize: 12 },
              { text: '', fillColor: '#e8f0fe' }
            ]
          ]
        },
        layout: {
          fillColor: (row: number) => row === 0 ? '#1a56db' : row % 2 === 0 ? '#f8f9fa' : null
        }
      },

      { text: '', margin: [0, 10] },
      {
        text: `Documento generado el ${fecha}`,
        style: 'pie'
      }
    ],

    styles: {
      empresa:     { fontSize: 14, bold: true, color: '#1a56db' },
      titulo:      { fontSize: 13, bold: true, color: '#343a40' },
      subEmpresa:  { fontSize: 8,  color: '#666' },
      tableHeader: { bold: true, color: '#fff', fontSize: 9, margin: [3, 4] },
      pie:         { fontSize: 7, color: '#aaa', alignment: 'center', italics: true }
    },

    defaultStyle: { fontSize: 9, font: 'Roboto' }
  };

// pdfMake.createPdf(docDefinition).download(`Reporte_Facturas_${fecha.replace(/\//g,'-')}.pdf`);

  if (descargar) {
    pdfMake.createPdf(docDefinition).download(`Reporte_Facturas_${fecha.replace(/\//g,'-')}.pdf`);
  } else {
    pdfMake.createPdf(docDefinition).open();
  }
}
  generarFacturaPDF(factura: Factura, descargar: boolean = true): void {
    const fecha = new Date(factura.fecha).toLocaleDateString('es-EC', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 40],

      content: [
        {
          columns: [
            {
              stack: [
                { text: 'Tarea7 - Semana 7',     style: 'empresa' },
                { text: 'RUC: 1759026535555',  style: 'subEmpresa' },
                { text: 'Santo Domingo – Ecuador',     style: 'subEmpresa' },
                { text: 'Teléfono: 02-123-4567', style: 'subEmpresa' },
              ]
            },
            {
              alignment: 'right',
              stack: [
                {
                  table: {
                    body: [
                      [{ text: 'FACTURA', style: 'tituloFactura', fillColor: '#1a56db', color: '#fff' }],
                      [{ text: factura.numeroFactura ?? 'N/A', style: 'numeroFactura' }],
                      [{ text: `Fecha: ${fecha}`, style: 'fechaFactura' }],
                      [{ text: `Estado: ${factura.estado}`, style: 'estadoFactura' }],
                    ]
                  },
                  layout: 'noBorders'
                }
              ]
            }
          ]
        },

        { canvas: [{ type: 'line', x1: 0, y1: 8, x2: 515, y2: 8, lineWidth: 1.5, lineColor: '#1a56db' }] },
        { text: '', margin: [0, 8] },

        // ── Datos del cliente ────────────────────────────────────────
        { text: 'DATOS DEL CLIENTE', style: 'seccionTitulo' },
        {
          table: {
            widths: ['auto', '*', 'auto', '*'],
            body: [
              [
                { text: 'Cédula / RUC:', bold: true }, { text: factura.cedulaRuc },
                { text: 'Nombre:', bold: true }, { text: factura.nombreCliente }
              ],
              [
                { text: 'Dirección:', bold: true }, { text: factura.direccion ?? '—' },
                { text: 'Teléfono:', bold: true }, { text: factura.telefono ?? '—' }
              ],
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 4, 0, 12]
        },

        // ── Detalle ──────────────────────────────────────────────────
        { text: 'DETALLE DE FACTURA', style: 'seccionTitulo' },
        {
          table: {
            widths: ['*', 100],
            headerRows: 1,
            body: [
              [
                { text: 'Descripción', style: 'tableHeader' },
                { text: 'Valor', style: 'tableHeader', alignment: 'right' }
              ],
              [
                { text: factura.descripcion ?? 'Servicio / Producto', margin: [4, 6] },
                { text: `$ ${factura.subtotal.toFixed(2)}`, alignment: 'right', margin: [4, 6] }
              ]
            ]
          },
          layout: {
            fillColor: (rowIndex: number) => rowIndex === 0 ? '#1a56db' : null
          },
          margin: [0, 4, 0, 0]
        },

        // ── Totales ──────────────────────────────────────────────────
        {
          alignment: 'right',
          margin: [0, 0, 0, 20],
          table: {
            widths: [120, 80],
            body: [
              [
                { text: 'Subtotal 12%:', alignment: 'right' },
                { text: `$ ${factura.subtotal.toFixed(2)}`, alignment: 'right' }
              ],
              [
                { text: 'IVA 15%:', alignment: 'right' },
                { text: `$ ${factura.iva.toFixed(2)}`, alignment: 'right' }
              ],
              [
                { text: 'TOTAL:', alignment: 'right', bold: true, fontSize: 13 },
                { text: `$ ${factura.total.toFixed(2)}`, alignment: 'right', bold: true, fontSize: 13, color: '#1a56db' }
              ],
            ]
          },
          layout: 'noBorders'
        },

        // ── Pie ──────────────────────────────────────────────────────
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#ccc' }] },
        {
          text: 'Documento generado electrónicamente',
          style: 'pie',
          margin: [0, 8, 0, 0]
        }
      ],

      // ── Estilos ──────────────────────────────────────────────────
      styles: {
        empresa:       { fontSize: 18, bold: true, color: '#1a56db', margin: [0, 0, 0, 4] },
        subEmpresa:    { fontSize: 9, color: '#555' },
        tituloFactura: { fontSize: 14, bold: true, alignment: 'center', padding: 6 },
        numeroFactura: { fontSize: 11, bold: true, alignment: 'center', padding: 4 },
        fechaFactura:  { fontSize: 9,  alignment: 'center', padding: 4 },
        estadoFactura: { fontSize: 9,  alignment: 'center', color: '#28a745', padding: 4 },
        seccionTitulo: { fontSize: 10, bold: true, color: '#fff', background: '#343a40',
                         fillColor: '#343a40', margin: [0, 0, 0, 2] },
        tableHeader:   { bold: true, color: '#fff', fillColor: '#1a56db',
                         fontSize: 10, margin: [4, 6] },
        pie:           { fontSize: 8, color: '#999', alignment: 'center', italics: true }
      },

      defaultStyle: { fontSize: 10, font: 'Roboto' }
    };

    if (descargar) {
      pdfMake.createPdf(docDefinition).download(`Factura_${factura.numeroFactura ?? factura.id}.pdf`);
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
  }
}