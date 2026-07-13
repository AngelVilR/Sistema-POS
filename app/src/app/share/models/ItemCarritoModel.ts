import { VentaModel } from "./VentaModel";

export interface ItemCarritoModel{
    producto: VentaModel;
    cantidad: number;    
    subtotal: number;
}