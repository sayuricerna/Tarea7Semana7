import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Factura } from '../interfaces/factura.interface';
import { FacturaService } from '../services/factura.service';
import { PdfmakeService } from '../services/pdfmake.service';
import { NuevaFacturaComponent } from './nueva-factura.component/nueva-factura.component';

declare var Swal: any;

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule, NuevaFacturaComponent],
  templateUrl: './factura.component.html',
  styleUrl: './factura.component.css'
})
export class FacturaComponent implements OnInit {

  facturas: Factura[] = [];
  vistaActual: 'lista' | 'formulario' = 'lista';
  facturaEditar: Factura | null = null;
  facturaVista:  Factura | null = null;

  constructor(
    private facturaService: FacturaService,
    private pdfService:     PdfmakeService,
    private cdr:            ChangeDetectorRef  
  ) {}

  ngOnInit(): void {
    this.cargarFacturas();
  }

  cargarFacturas(): void {
    this.facturaService.getAll().subscribe({
      next: data => {
        this.facturas = data;
        this.cdr.detectChanges();              
      },
      error: () => this.alerta('error', 'No se pudo conectar con el servidor')
    });
  }

  nuevaFactura(): void {
    this.facturaEditar = null;
    this.vistaActual   = 'formulario';
  }

  editarFactura(f: Factura): void {
    this.facturaEditar = { ...f };
    this.vistaActual   = 'formulario';
  }

  onGuardado(): void {
    this.vistaActual = 'lista';
    this.cargarFacturas();
  }

  onCancelado(): void {
    this.vistaActual = 'lista';
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Eliminar esta factura?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((r: any) => {
      if (r.isConfirmed) {
        this.facturaService.eliminar(id).subscribe({
          next: () => { this.cargarFacturas(); this.alerta('success', 'Factura eliminada'); },
          error: ()  => this.alerta('error', 'Error al eliminar')
        });
      }
    });
  }

  //botones prinicipales

  verDetalle(f: Factura): void {
    this.facturaVista = f;
    this.abrirModal('modalDetalle');
  }

  cerrarDetalle(): void {
    this.cerrarModal('modalDetalle');
  }

  imprimirIndividual(): void {
    window.print();
  }

  descargarPDFIndividual(): void {
    if (this.facturaVista)
      this.pdfService.generarFacturaPDF(this.facturaVista, true);
  }

  abrirPDFIndividual(): void {
    if (this.facturaVista)
      this.pdfService.generarFacturaPDF(this.facturaVista, false);
  }

  //imprimir lista de facturas
  imprimirTodas(): void {
    window.print();
  }

  exportarPDFGeneral(): void {
    this.pdfService.generarReporteGeneral(this.facturas);
  }

  abrirPDFGeneral(): void {
  this.pdfService.generarReporteGeneral(this.facturas, false);
}
  exportarCSV(): void {
    const encabezado = ['N° Factura','Cédula/RUC','Cliente','Fecha','Subtotal','IVA','Total','Estado'];

    const filas = this.facturas.map(f => [
      f.numeroFactura ?? '',
      f.cedulaRuc,
      f.nombreCliente,
      new Date(f.fecha).toLocaleDateString('es-EC'),
      f.subtotal.toFixed(2),
      f.iva.toFixed(2),
      f.total.toFixed(2),
      f.estado
    ]);

    const csv = [encabezado, ...filas]
      .map(fila => fila.map(c => `"${c}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); // \uFEFF = BOM para Excel
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `Facturas_${new Date().toLocaleDateString('es-EC').replace(/\//g,'-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  get totalGeneral(): number {
    return this.facturas.reduce((acc, f) => acc + f.total, 0);
  }

  get subtotalGeneral(): number {
    return this.facturas.reduce((acc, f) => acc + f.subtotal, 0);
  }

  get ivaGeneral(): number {
    return this.facturas.reduce((acc, f) => acc + f.iva, 0);
  }

  badgeClase(estado: string): string {
    const m: Record<string, string> = {
      'ACTIVA' : 'badge bg-success',
      'PAGADA' : 'badge bg-primary',
      'ANULADA': 'badge bg-danger'
    };
    return m[estado] ?? 'badge bg-secondary';
  }

  abrirModal(id: string): void {
    const m = document.getElementById(id);
    if (m) { m.classList.add('show'); m.style.display = 'block'; document.body.classList.add('modal-open'); }
  }

  cerrarModal(id: string): void {
    const m = document.getElementById(id);
    if (m) { m.classList.remove('show'); m.style.display = 'none'; document.body.classList.remove('modal-open'); }
  }

  alerta(tipo: 'success' | 'error' | 'warning', msg: string): void {
    Swal.fire({ icon: tipo, title: msg, timer: 2000, showConfirmButton: false });
  }
}