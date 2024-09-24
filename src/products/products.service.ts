import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CreateProductDto } from './dto/create-product.dto';
import asyncForEach = require('../utils/async_foreach');
import  storage  =  require('../utils/cloud_storage');
import { Like } from 'typeorm';
import { IPaginationOptions, Pagination,paginate} from 'nestjs-typeorm-paginate';

@Injectable()
export class ProductsService {


    constructor(@InjectRepository(Product)private productsRepository: Repository<Product>){}

    findAll() {
        return this.productsRepository.find();
    }
    
    findByCategory(id_category: number) {
        return this.productsRepository.findBy({ id_category: id_category });
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<Product>> {
        return paginate<Product>(this.productsRepository, options);
    }
  

    findByName(name: string) {
        return this.productsRepository.find({ where : { name: Like(`%${name}%`) }})
    }
    

    async create(files :Array<Express.Multer.File>,product:CreateProductDto){
        console.log('Files' + files.length);
     
        if(files.length === 0  ){
            throw new HttpException("As imagens são obrigatórias",HttpStatus.NOT_FOUND);
        }

        let uploadedFiles = 0; //Contar quantos arquivos subiu para o firebase 

        const newProduct  = this.productsRepository.create(product);
        const savedProduct = await this.productsRepository.save(newProduct)
        const startForEach = async ()=>{
            await asyncForEach(files,async(file:Express.Multer.File)=>{
                const uri = await storage(file,file.originalname);
                if(uri !== undefined && uri !== null){
                    if(uploadedFiles === 0){
                        savedProduct.image1 = uri 
                    }else if(uploadedFiles === 1){
                        savedProduct.image2 = uri 
                    }

                }
                await this.update(savedProduct.id,savedProduct);
                uploadedFiles = uploadedFiles + 1;
           
            })
        }
        await startForEach();
        return savedProduct;

    }
    async updateWithImage(files :Array<Express.Multer.File>,id:number,product:UpdateProductDto){
        console.log('Files' + files.length);
     
        if(files.length === 0  ){
            throw new HttpException("As imagens são obrigatórias",HttpStatus.NOT_FOUND);
        }

        
        let counter = 0 ;
        let uploadedFiles = Number(product.image_to_update[counter]); //Contar quantos arquivos subiu para o firebase 

        const UpdateProduct = await this.update(id,product)
        const startForEach = async ()=>{
            await asyncForEach(files,async(file:Express.Multer.File)=>{
                const uri = await storage(file,file.originalname);
                if(uri !== undefined && uri !== null){
                    if(uploadedFiles === 0){
                       UpdateProduct.image1 = uri 
                    }else if(uploadedFiles === 1){
                        UpdateProduct.image2 = uri 
                    }

                }
                await this.update( UpdateProduct.id, UpdateProduct);
                counter++;
                uploadedFiles = product.image_to_update[counter];
           
            })
        }
        await startForEach();
        return UpdateProduct;

    }
async update(id:number,product : UpdateProductDto){

    const productFound = await this.productsRepository.findOneBy({id:id});

    if(!productFound){
        throw new HttpException("Produto não encontrado",HttpStatus.NOT_FOUND);
    }
    const UpdateProduct = Object.assign(productFound,product);
    return this.productsRepository.save(UpdateProduct);

}


async delete(id:number){

    const productFound = await this.productsRepository.findOneBy({id:id});

    if(!productFound){
        throw new HttpException("Produto não encontrado",HttpStatus.NOT_FOUND);
    }

    return this.productsRepository.delete(id);

}


}
