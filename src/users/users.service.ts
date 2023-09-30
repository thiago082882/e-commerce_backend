import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import  storage = require('../utils/cloud_storage');
import { Rol } from 'src/roles/rol.entity';


@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private userRepository : Repository<User>
            
    ){}

    create(user: CreateUserDto){

        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }

    findAll(){
        return this.userRepository.find({relations:['roles']});
    }
    async update(id: number,user:UpdateUserDto){

        const userFound= await this.userRepository.findOneBy({id:id});
            
            if(!userFound){

                throw new HttpException('Usuario não existe',HttpStatus.NOT_FOUND);
            }

            const updateUser = Object.assign(userFound,user);
            return this.userRepository.save(updateUser)

    }
    
    async updateWithImage(file:Express.Multer.File,id: number,user:UpdateUserDto){
        const url = await storage(file,file.originalname);
        console.log('URL'+url);
        if(url === undefined && url === null){
            throw new HttpException('A imagem não pode ser salva',HttpStatus.INTERNAL_SERVER_ERROR);
        
        }

        const userFound= await this.userRepository.findOneBy({id:id});
            
        if(!userFound){

            throw new HttpException('Usuario não existe',HttpStatus.NOT_FOUND);
        }
        user.image = url;

        const updateUser = Object.assign(userFound,user);
        return this.userRepository.save(updateUser)
    }

  

}
