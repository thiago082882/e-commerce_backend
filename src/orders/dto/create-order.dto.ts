export class CreateOrderDto {
    id_client: number;
    id_address: number;
   // status?: string = "PAGO";
    products: Array< { id: number; quantity: number; } >
}