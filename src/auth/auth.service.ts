import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-auth';
import { User } from 'src/users/user.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import {compare} from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private usersRepository : Repository<User>,
    private jwtService : JwtService
    
    ){}

    async register(user: RegisterUserDto) {

       const {email,phone} = user;

        const emailExist = await this.usersRepository.findOneBy({ email: email});

        if(emailExist){
            //409 Conflito
            return new HttpException('O email já existe',HttpStatus.CONFLICT);

        }
        
        const phoneExist = await this.usersRepository.findOneBy({phone: phone});

        if(phoneExist){
            //409 Conflito
            return new HttpException('O Celular já existe',HttpStatus.CONFLICT)

        }

        //Inicia um novo token de sessão 
        const newUser = this.usersRepository.create(user);
       const userSaved= await this.usersRepository.save(newUser);
       const payload = {id:userSaved.id,name:userSaved.name};
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
        const userFound = await this.usersRepository.findOneBy({email:email})
        if(!userFound){
            return new HttpException('O email não existe',HttpStatus.NOT_FOUND);

        }

const isPasswordValid = await compare(password,userFound.password);
if(!isPasswordValid){
    //403 -> acesso negado
    return new HttpException('A senha está incorreta',HttpStatus.FORBIDDEN);

}

const payload = {id:userFound.id,name:userFound.name};
const token  = this.jwtService.sign(payload);
const data = {
   user: userFound,
   token : 'Bearer ' + token
}

delete data.user.password;
return data;

    }
    
}
