
import { Body, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {

constructor(private productsService : ProductsService){}

@HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
@UseGuards(JwtAuthGuard, JwtRolesGuard)
@Get() // http:localhost:3000/categories -> GET
findAll() {
    return this.productsService.findAll();
}

/*@HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
@UseGuards(JwtAuthGuard, JwtRolesGuard)
@Get('pagination') // http:localhost:3000/categories -> GET
async pagination(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
): Promise<Pagination<Product>> {
    return this.productsService.paginate({
        page,
        limit,
        route: `http://${API}:3000/products/pagination`
    });
}
*/

@HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
@UseGuards(JwtAuthGuard, JwtRolesGuard)
@Get('category/:id_category') // http:localhost:3000/categories -> GET
findByCategory(@Param('id_category', ParseIntPipe) id_category: number) {
    return this.productsService.findByCategory(id_category);
}
/*
@HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
@UseGuards(JwtAuthGuard, JwtRolesGuard)
@Get('search/:name') // http:localhost:3000/categories -> GET
findByName(@Param('name') name: string) {
    return this.productsService.findByName(name);
}
*/

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard,JwtRolesGuard)
    @Post() // http:localhost:3000/categories -> POST
    @UseInterceptors(FilesInterceptor('files[]',2))
    create(@UploadedFiles(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
            new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      })) files: Array<Express.Multer.File>,@Body() product: CreateProductDto) 
    {
      console.log(files);
      return this.productsService.create(files,product);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard,JwtRolesGuard)
    @Put('upload/:id') // http:localhost:3000/categories -> PUT
    @UseInterceptors(FilesInterceptor('files[]',2))
    updateWithImage(@UploadedFiles(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
            new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      })) files: Array<Express.Multer.File>,
      @Param('id',ParseIntPipe) id: number ,
      @Body() product: UpdateProductDto) 
    {
      console.log(files);
      return this.productsService.updateWithImage(files,id,product);
    }



    
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard,JwtRolesGuard)
    @Put(':id') // http:localhost:3000/categories -> PUT
    update(
      @Param('id',ParseIntPipe) id: number ,
      @Body() product: UpdateProductDto) 
    {
      return this.productsService.update(id,product);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard,JwtRolesGuard)
    @Delete(':id') // http:localhost:3000/categories -> DELETE
    delete(
      @Param('id',ParseIntPipe) id: number
      
    ){
      return this.productsService.delete(id);
    }
}
