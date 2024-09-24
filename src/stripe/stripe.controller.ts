
import { Body, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { PaymentBodyStripeDto } from './dto/payment-body-stripe.dto';
import { StripeService } from './stripe.service';
import { CardTokenBody } from 'src/mercado_pago/models/card_token_body';
import { createTokenDto } from './dto/token-body.dto';



@Controller('stripe')
export class StripeController {

    constructor(private stripeService :  StripeService){

    }
      
    @HasRoles(JwtRole.ADMIN,JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard,JwtRolesGuard)
    @Post('create') // http://localhost:3000/stripe/create -> POST
   createPayment(
      @Body() body : PaymentBodyStripeDto) 
    {
      return this.stripeService.createPayment(body);
    }

    @HasRoles(JwtRole.ADMIN,JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard,JwtRolesGuard)
    @Post('token') // http://localhost:3000/stripe/token -> POST
   createToken(@Body() body : createTokenDto) 
    {
      return this.stripeService.createToken(body);
    }



}
