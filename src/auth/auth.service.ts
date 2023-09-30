import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-auth';
import { User } from 'src/users/user.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import {compare} from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private usersRepository : Repository<User>,
    @InjectRepository(Rol) private rolesRepository : Repository<Rol>,
    private jwtService : JwtService
    
    ){}

    async register(user: RegisterUserDto) {


       const {email,phone} = user;

        const emailExist = await this.usersRepository.findOneBy({ email: email});

        if(emailExist){
            //409 Conflito
            throw  new HttpException('O email já existe',HttpStatus.CONFLICT);

        }
        
        const phoneExist = await this.usersRepository.findOneBy({phone: phone});

        if(phoneExist){
            //409 Conflito
            throw new HttpException('O Celular já existe',HttpStatus.CONFLICT)

        }

        //Inicia um novo token de sessão 
        const newUser = this.usersRepository.create(user);

        let rolesIds = [];
        if(user.rolesIds !== undefined && user.rolesIds !==null){ //data
      //  const rolesIds = user.rolesIds;
        const roles = await this.rolesRepository.findBy({id:In(rolesIds)});
        newUser.roles = roles;
        }else {
            rolesIds.push('CLIENT')
        }

       const userSaved= await this.usersRepository.save(newUser);
       const rolesString = userSaved.roles.map(rol => rol.id);
       const payload = {id:userSaved.id,name:userSaved.name,roles:rolesString};
        const token  = this.jwtService.sign(payload);
const data = {
   user: userSaved,
   token : 'Bearer ' + token
}

delete data.user.password;
return data;
    }    
    async login(loginData : LoginAuthDto){
        const {email,password} =  loginData;
        const userFound = await this.usersRepository.findOne({
           where:{ email:email},
           relations:['roles']
        })
        if(!userFound){
            throw new HttpException('O email não existe',HttpStatus.NOT_FOUND);

        }

const isPasswordValid = await compare(password,userFound.password);
if(!isPasswordValid){
    //403 -> acesso negado
    throw new HttpException('A senha está incorreta',HttpStatus.FORBIDDEN);

}

const rolesIds = userFound.roles.map(rol => rol.id); // ['CLIENT','ADMIN']
const payload = {id:userFound.id,name:userFound.name,roles:rolesIds};
const token  = this.jwtService.sign(payload);
const data = {
   user: userFound,
   token : 'Bearer ' + token
}

delete data.user.password;
return data;

    }
    
}
