export class createTokenDto {
    number: number;
    exp_month:number;
    exp_year:number;
    cvc:number;
    type : string = 'card'
}