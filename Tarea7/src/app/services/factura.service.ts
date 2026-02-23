import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura } from '../interfaces/factura.interface';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FacturaService {

  // private apiUrl = 'https://localhost:5137/api/factura';
  private apiUrl = 'https://localhost:7015/api/factura';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.apiUrl);
  }

  getById(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.apiUrl}/${id}`);
  }

  buscarPorFactura(numero: string): Observable<boolean> {
  return this.http.get<Factura[]>(this.apiUrl).pipe(
    map(facturas => facturas.some(f => f.numeroFactura === numero))
  );
}

  crear(factura: Factura): Observable<Factura> {
    return this.http.post<Factura>(this.apiUrl, factura);
  }

  actualizar(id: number, factura: Factura): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, factura);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}