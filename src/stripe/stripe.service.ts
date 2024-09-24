import { HttpException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentBodyStripeDto } from './dto/payment-body-stripe.dto';
import { Observable, catchError, map } from 'rxjs';
import { StripeToken } from './models/stripe_token';
import { HttpService } from '@nestjs/axios';
import { error } from 'console';
import { Axios, AxiosError, AxiosResponse } from 'axios';
import { createTokenDto } from './dto/token-body.dto';

@Injectable()
export class StripeService {
     private stripe:Stripe;

     constructor(private readonly httpService : HttpService){
        this.stripe = new Stripe('sk_test_51Q1coL2Mz6LGZtUqDIMqcUFEAtva091DZ1hM4KIQno96ZlnvQ00dCxlpy7qS4IWmapE9VxXbl7u2G7xxI78hpijg00vW6pBWwC',{
            apiVersion: '2024-06-20'
        })
     }

     createToken(tokenBody :createTokenDto):Observable<StripeToken>{
        return this.httpService.post(
         "https://api.stripe.com/v1/payment_methods",
         {
            'type': tokenBody.type,
            'card[number]': tokenBody.number,
            'card[exp_month]':tokenBody.exp_month,
            'card[exp_year]':tokenBody.exp_year,
            'card[cvc]': tokenBody.cvc

         },
         {
            headers:{
               "Authorization": "Bearer pk_test_51Q1coL2Mz6LGZtUqYDq2CTEVI3VhZRXlyBbow1TivuGgOuJYfekHdEx273DdaBA1uay32JG2n3WknRYKPHBJmvl800PCb3ry9G",
               "Content-Type": "application/x-www-form-urlencoded"
            }
         }
        ).pipe(
         catchError((error:AxiosError)=>{
            throw new HttpException(error.response.data,error.response.status)
         })
        ).pipe(map((resp:AxiosResponse<StripeToken>)=> resp.data))
     }
     createPayment(body : PaymentBodyStripeDto){
        return this.stripe.paymentIntents.create({
           amount: body.amount * 100,
           currency:'BRL',
           description: 'Ecommerce App',
           payment_method: body.payment_method,
           confirm:true,
           automatic_payment_methods: 
           {
            enabled: true,
            allow_redirects:"never"
         
         },
         return_url: "http://localhost:3000/stripe/create"

        })
     }
}
