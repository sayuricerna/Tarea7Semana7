import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Factura } from '../../interfaces/factura.interface';
import { FacturaService } from '../../services/factura.service';
import { Router } from '@angular/router';
declare var Swal: any;

@Component({
  selector: 'app-nueva-factura',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-factura.component.html',
  styleUrl: './nueva-factura.component.css'
})
export class NuevaFacturaComponent implements OnInit, OnChanges {

  @Input() facturaEditar: Factura | null = null;
  @Input() totalFacturas: number = 0;

  // Avisa al padre cuando guarda o cancela
  @Output() guardado  = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  modoEdicion   = false;
  errorCedulaRuc = '';
  porcentajeIva  = 15;

  form: Factura = this.crearFormVacio();

  constructor(private facturaService: FacturaService , private router: Router) {}

  ngOnInit(): void {
    this.inicializarForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['facturaEditar']) {
      this.inicializarForm();
    }
  }

  inicializarForm(): void {
    if (this.facturaEditar) {
      this.modoEdicion = true;
      this.form = { ...this.facturaEditar };

      if (this.form.fecha) {
        this.form.fecha = this.form.fecha.toString().substring(0, 10);
      }

      this.porcentajeIva = this.form.subtotal > 0
        ? Math.round((this.form.iva / this.form.subtotal) * 100)
        : 15;

    } else {
      this.modoEdicion = false;
      this.form = this.crearFormVacio();
      this.generarNumeroFactura();
    }
    this.errorCedulaRuc = '';
  }

  guardar(): void {
    if (!this.validarFormulario()) return;

    if (this.modoEdicion && this.form.id) {
      this.facturaService.actualizar(this.form.id, this.form).subscribe({
        next: () => {
          this.mostrarAlerta('success', '¡Factura actualizada correctamente!');
          this.guardado.emit();
          this.router.navigate(['/facturas']); 
        },
        error: () => this.mostrarAlerta('error', 'Error al actualizar la factura')
      });
    } else {
      this.facturaService.crear(this.form).subscribe({
        next: () => {
          this.mostrarAlerta('success', '¡Factura creada correctamente!');
          this.guardado.emit();
          this.router.navigate(['/facturas']); 
        },
        error: () => this.mostrarAlerta('error', 'Error al crear la factura')
      });
    }

  }

  cancelar(): void {
    this.cancelado.emit();
  }

  calcularTotales(): void {
    const sub = Number(this.form.subtotal) || 0;
    this.form.iva   = parseFloat((sub * (this.porcentajeIva / 100)).toFixed(2));
    this.form.total = parseFloat((sub + this.form.iva).toFixed(2));
  }

  validarFormulario(): boolean {
    if (!this.validarCedulaRuc())    return false;
    if (!this.form.nombreCliente?.trim()) {
      this.mostrarAlerta('warning', 'El nombre del cliente es obligatorio');
      return false;
    }
    if (this.form.subtotal <= 0) {
      this.mostrarAlerta('warning', 'El subtotal debe ser mayor a 0');
      return false;
    }
    return true;
  }

  validarCedulaRuc(): boolean {
    const v = this.form.cedulaRuc?.trim() ?? '';
    if (/^\d{10}$/.test(v) || /^\d{13}$/.test(v)) {
      this.errorCedulaRuc = '';
      return true;
    }
    this.errorCedulaRuc = 'Ingrese una cédula (10 dígitos) o RUC (13 dígitos) válido';
    return false;
  }

  crearFormVacio(): Factura {
    return {
      numeroFactura : '',
      fecha         : new Date().toISOString().substring(0, 10),
      cedulaRuc     : '',
      nombreCliente : '',
      direccion     : '',
      telefono      : '',
      descripcion   : '',
      subtotal      : 0,
      iva           : 0,
      total         : 0,
      estado        : 'ACTIVA'
    };
  }

  generarNumeroFactura(): void {
    const intentar = (n: number) => {
      const numero = `FACT-001-${n.toString().padStart(9, '0')}`;

      this.facturaService.buscarPorFactura(numero).subscribe(existe => {
        if (existe) {
          intentar(n + 1); 
        } else {
          this.form.numeroFactura = numero; 
        }
      });
    };

    intentar(this.totalFacturas + 1);
  }


  // generarNumeroFactura(): void {
  //   const num = (this.totalFacturas + 1).toString().padStart(9, '0');
  //   this.form.numeroFactura = `FACT-001-${num}`;
  // }
  
  mostrarAlerta(tipo: 'success' | 'error' | 'warning', mensaje: string): void {
    Swal.fire({
      icon: tipo,
      title: mensaje,
      timer: 2000,
      showConfirmButton: false
    });
  }
}