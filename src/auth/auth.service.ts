import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository, In } from 'typeorm';

import { LoginAuthDto } from './dto/login-auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Rol } from '../roles/rol.entity';
import { RegisterUserDto } from './dto/register-auth';



@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Rol) private rolesRepository: Repository<Rol>,

        private jwtService: JwtService
    ) {}

    async register(user: RegisterUserDto) {

        const { email, phone } = user;
        const emailExist = await this.usersRepository.findOneBy({ email: email })

        if (emailExist) {
            // 409 CONFLICT
            throw new HttpException('O email já existe', HttpStatus.CONFLICT);
        }

        const phoneExist = await this.usersRepository.findOneBy({phone: phone});

        if (phoneExist) {
            throw new HttpException('O telefone já existe', HttpStatus.CONFLICT)
        }

        const newUser = this.usersRepository.create(user);
        let rolesIds = [];
        
        if (user.rolesIds !== undefined && user.rolesIds !== null) { // DATA
            rolesIds = user.rolesIds;
        }
        else {
            rolesIds.push('CLIENT')
        }
        
        const roles = await this.rolesRepository.findBy({ id: In(rolesIds) });
        newUser.roles = roles;

        const userSaved = await this.usersRepository.save(newUser);

        const rolesString = userSaved.roles.map(rol => rol.id); //['CLIENT', 'ADMIN']
        const payload = { id: userSaved.id, name: userSaved.name, roles: rolesString };
        const token = this.jwtService.sign(payload);
        const data = {
            user: userSaved,
            token: 'Bearer ' + token
        }
        delete data.user.password;
        return data;
    }

    async login(loginData: LoginAuthDto) {

        const { email, password } = loginData;
        const userFound = await this.usersRepository.findOne({ 
            where: { email: email },
            relations: ['roles']
         })
        if (!userFound) {
            throw new HttpException('O email não existe', HttpStatus.NOT_FOUND);
        }
        
        const isPasswordValid = await compare(password, userFound.password);
        if (!isPasswordValid) {
            console.log('Senha incorreta');
            
            // 403 FORBITTEN access denied
            throw new HttpException('senha é incorreta', HttpStatus.FORBIDDEN);
        }

        const rolesIds = userFound.roles.map(rol => rol.id); //['CLIENT', 'ADMIN']

        const payload = { 
            id: userFound.id, 
            name: userFound.name, 
            roles: rolesIds 
        };
        const token = this.jwtService.sign(payload);
        const data = {
            user: userFound,
            token: 'Bearer ' + token
        }

        delete data.user.password;

        return data;
    }

}
