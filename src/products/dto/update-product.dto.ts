export class UpdateProductDto {
    name?:String;
    description? : string;
    price?:number;
    id_category? : number;
    image1? : string ;
    image2? : string ;
    image_to_update? : Array<number>;

    
}