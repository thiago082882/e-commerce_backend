import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { product } from './product.entity';
import { Category } from 'src/categories/category.entity';

@Module({
    imports:[TypeOrmModule.forFeature([product,Category])],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
