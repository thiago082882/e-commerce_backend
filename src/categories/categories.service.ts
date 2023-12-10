import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import storage = require('../utils/cloud_storage')
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {

constructor(
    @InjectRepository(Category)private categoriesRepository:Repository<Category>
){}

findAll(){
    return  this.categoriesRepository.find()
}

async create(file:Express.Multer.File,category:CreateCategoryDto){




    const uri = await storage(file,file.originalname);

    if(uri=== undefined && uri ===null){
        throw new HttpException('A imagem não pode ser guardada',HttpStatus.INTERNAL_SERVER_ERROR);
    }

    category.image = uri
    const newCategory = this.categoriesRepository.create(category)
    return this.categoriesRepository.save(newCategory)

}

async updateWithImage(file:Express.Multer.File,id:number,category:UpdateCategoryDto){




    const uri = await storage(file,file.originalname);

    if(uri=== undefined && uri ===null){
        throw new HttpException('A imagem não pode ser guardada',HttpStatus.INTERNAL_SERVER_ERROR);
    }
const categoryFound = await this.categoriesRepository.findOneBy({id:id});
if(!categoryFound){
    throw new HttpException('A categoria não existe',HttpStatus.NOT_FOUND);
}
    category.image = uri
    const updateCategory = Object.assign(categoryFound,category)
    return this.categoriesRepository.save(updateCategory)

}



async update(id:number,category:UpdateCategoryDto){


const categoryFound = await this.categoriesRepository.findOneBy({id:id});
if(!categoryFound){
    throw new HttpException('A categoria não existe',HttpStatus.NOT_FOUND);
}

    const updateCategory = Object.assign(categoryFound,category)
    return this.categoriesRepository.save(updateCategory)

}

async delete(id:number){
    const categoryFound = await this.categoriesRepository.findOneBy({id:id});
if(!categoryFound){
    throw new HttpException('A categoria não existe',HttpStatus.NOT_FOUND);
}
return this.categoriesRepository.delete(id);
}

}
