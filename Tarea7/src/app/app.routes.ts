import { Routes } from '@angular/router';
import { FacturaComponent } from './factura.component/factura.component';
import { NuevaFacturaComponent } from './factura.component/nueva-factura.component/nueva-factura.component';
export const routes: Routes = [
    {
        path:"",
        component:FacturaComponent,
        pathMatch:"full"
    },
    {
        path:"facturas",
        component:FacturaComponent
    },
    {
        path:"nueva-factura",
        component:NuevaFacturaComponent
    },
    {
        path:"editarFactura/:id",
        component:NuevaFacturaComponent
    },


];
