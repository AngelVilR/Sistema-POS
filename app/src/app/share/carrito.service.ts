import { computed, effect, Injectable, signal } from '@angular/core';
import { ItemCarritoModel } from './models/ItemCarritoModel';
import { ProductoModel } from './models/ProductoModel';
import { VentaModel } from './models/VentaModel';
/* import { ProductoPersonalizableModel } from './models/ProductoPersonalizableModel'; */

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  //Signal del objeto del carrito
  private carrito = signal<ItemCarritoModel[]>(this.loadCarritoFromLS());

  //Items de carrito de unicamente lectura
  public readonly itemsCarrito = computed(() => this.carrito());

  public prom2x1: boolean = false;
  public prom10k: boolean = false;
  /* public prom2x1Signal = signal(false); */
  public porcentajeDesc = signal(0);

  //Signal computada que calculara todos los items que tenga el carrito
  //Reacciona de acuerdo a los cambios del carrito
  public cantItems = computed(() =>
    this.carrito().reduce((sum, item) => sum + item.cantidad, 0)
  );

  private tempSubtotal = computed(() => {
    return this.carrito().reduce((subtotal, item) => subtotal + item.subtotal, 0);
  })

  public prom2x1Signal: any = computed(() => {
    return !this.prom10kSignal() && this.carrito().some(item => {
      const nombre = item.producto.producto?.nombre?.toLocaleLowerCase() ?? '';
      return nombre.includes('gelatina') && item.cantidad >= 2;
    }) 
  });

  public prom10kSignal: any = computed(() => {
    let tempCantItems = this.carrito().length;
    let tempSubtotal = this.tempSubtotal();
    return (
      tempCantItems > 2 &&
      tempSubtotal >= 10000
    );
  })

  public subtotalFinal = computed(() => {
    let tempSubtotal = this.tempSubtotal();
    let prDescuento = (this.porcentajeDesc() / 100);
    let subtotalFinal = tempSubtotal;
    console.log(this.prom10kSignal())
    if (this.prom10kSignal()) {
      subtotalFinal = tempSubtotal - (tempSubtotal * prDescuento);
    }
    return subtotalFinal;
  });

  public ivaFinal = computed(() => {
    return this.subtotalFinal() * 0.13
  });

  public totalFinal = computed(() => {
    return this.subtotalFinal() + this.ivaFinal()
  });

  constructor() {
    //Efecto que guarda el estado del carrito en LS cada vez que cambia
    effect(() => {
      localStorage.setItem('pedido', JSON.stringify(this.carrito()))
    })
  }

  //Cargar el carrito desde el localStorage (LS)
  private loadCarritoFromLS(): ItemCarritoModel[] {
    if (typeof localStorage !== 'undefined') {
      const cartData = localStorage.getItem('pedido');
      return cartData ? JSON.parse(cartData) : []
    }
    return [];
  }

  private CalcularSubtotalItem(prProd: VentaModel, prCantidad: number): number {
    return prProd.producto?.precio! * prCantidad
  }

  agregarCarrito(prProd: VentaModel, prValidCant?: boolean): void {
    //Actualiza el signal del carrito por cada cambio que se haga. Los cambios se hacen con el "update"
    this.carrito.update((currentCart) => {
      const listCarrito = [...currentCart] //Copia de las compras
      const existItemIndex = listCarrito.findIndex(
        (item) => item.producto.productoId === prProd.productoId
      )

      if (existItemIndex !== -1) {
        //Si el producto existe lo busca y lo guarda en existItem
        const existItem = listCarrito[existItemIndex];
        let nuevaCantidad: number;

        //Si es un prValidCant es true, suma la cantidad en el carrito. Si es false, resta la cantidad en el carrito
        if (prValidCant) {
          nuevaCantidad = existItem.cantidad + 1;
        } else {
          nuevaCantidad = existItem.cantidad - 1;
        }

        if (nuevaCantidad <= 0) {
          //Si la cantidad es <= 0, elimina el prod de la lista
          listCarrito.splice(existItemIndex, 1);
        } else {
          //Si es mayor, actualiza el item

          //Si la cantidad es multiplo de 2 y SI es de Gelatina, aplica la promocion 2x1
          let tempSubtotalItem = 0
          if (!this.prom10k && (nuevaCantidad % 2 == 0) && (existItem.producto.producto?.nombre.toLocaleLowerCase().includes("gelatina"))) {
            tempSubtotalItem = this.CalcularSubtotalItem(existItem.producto, (nuevaCantidad / 2));
          } else if ((nuevaCantidad > 2) && (existItem.producto.producto?.nombre.toLocaleLowerCase().includes("gelatina"))) {
            tempSubtotalItem = (this.CalcularSubtotalItem(existItem.producto, nuevaCantidad)) - existItem.producto.producto?.precio;
          } else {
            tempSubtotalItem = this.CalcularSubtotalItem(existItem.producto, nuevaCantidad);
          }

          listCarrito[existItemIndex] = {
            ...existItem,
            cantidad: nuevaCantidad,
            subtotal: tempSubtotalItem,
          } as ItemCarritoModel;
        }
      } else {
        //Si el producto no existe, unicamente lo agrega como nuevo
        let tempSubtotalItem = this.CalcularSubtotalItem(prProd, 1);

        listCarrito.push({
          producto: prProd,
          cantidad: 1,
          subtotal: tempSubtotalItem
        } as ItemCarritoModel)
      }
      return listCarrito;
    })
  }

  eliminarItemCarrito(prProdId: number): void {
    this.carrito.update((currenttCarrito) =>
      currenttCarrito.filter((item) => item.producto.productoId !== prProdId)
      /* Validaciones de las signals descuentos */

    );
  }

  vaciarCarrito(): void {
    this.carrito.set([]);    
  }
}
