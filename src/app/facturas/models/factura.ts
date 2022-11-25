import { Cliente } from "src/app/clientes/cliente";
import { DetalleFactura } from "./detalle-factura";

export class Factura {
    id: number;
    descripcion: string;
    observacion: string;
    detalles: Array<DetalleFactura> = [];
    cliente: Cliente;
    total: number;
    createAt: string;

    calcularGranTotal(): number {
        this.total = 0;
        this.detalles.forEach((detalle:DetalleFactura) => {
            this.total += detalle.calcularImporte();
        });
        return this.total;
    }
}
