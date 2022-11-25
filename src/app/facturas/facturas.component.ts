import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../clientes/cliente.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, mergeMap, flatMap} from 'rxjs/operators';
import { Factura } from './models/factura';
import { FacturaService } from './services/factura.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DetalleFactura } from './models/detalle-factura';
import swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {

  titulo: string = 'Nueva Factura';
  factura: Factura = new Factura();

  autocompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute, private facturaService: FacturaService, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges
    .pipe(
      map(value => typeof value === 'string' ? value : value.nombre),
      mergeMap(value => value ? this._filter(value) : [])
    );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();
    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?:Producto):string | undefined {
    return producto? producto.nombre : undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Producto;
    console.log(producto);

    if(this.existeProducto(producto.id)){
      this.incrementarCantidad(producto.id);
    } else {
      let nuevoDetalle = new DetalleFactura();
      nuevoDetalle.producto = producto;
      this.factura.detalles.push(nuevoDetalle);
    }

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id: number, event: any): void {
    let cantidad: number = event.target.value as number;

    if (cantidad == 0) {
      return this.eliminarDetalleFactura(id);
    }
    
    this.factura.detalles = this.factura.detalles.map((detalle: DetalleFactura) => {
      if(id === detalle.producto.id) {
        detalle.cantidad = cantidad;
      }
      return detalle;
    });
  }

  existeProducto(id:number): boolean{
    let existe = false;
    this.factura.detalles.forEach((detalle: DetalleFactura) => {
      if (id === detalle.producto.id) {
        existe = true;
      }
    });
    return existe;
  }

  incrementarCantidad(id:number): void {
    this.factura.detalles = this.factura.detalles.map((detalle: DetalleFactura) => {
      if(id === detalle.producto.id) {
        ++detalle.cantidad;
      }
      return detalle;
    });
  }

  eliminarDetalleFactura(id:number): void{
    this.factura.detalles = this.factura.detalles.filter((detalle: DetalleFactura) => id !== detalle.producto.id);
  }

  create() : void {
    this.facturaService.create(this.factura).subscribe(factura => {
      swal(this.titulo, `Factura ${factura.descripcion} creada con éxito.`, 'success');
      this.router.navigate(['/clientes']);
    });
  }

}
