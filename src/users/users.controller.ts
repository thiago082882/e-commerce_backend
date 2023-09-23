import { Body, Controller, Post, Get, UseGuards, Put, Param, ParseIntPipe, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {


    constructor(private usersService : UsersService){}

    @UseGuards(JwtAuthGuard)
    @Get() // http://localhost/users -> GET
    findAll(){
        return this.usersService.findAll();

    }

    @Post() // http://localhost/users -> POST
    create(@Body() user : CreateUserDto){
        return this.usersService.create(user);

    }
    @UseGuards(JwtAuthGuard)
    @Put(':id')// http://10.0.0.101:3000/users/:id -> PUT
    update(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
        return this.usersService.update(id,user);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
            new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      })) file: Express.Multer.File) 
    {
      console.log(file);
      this.usersService.updateWithImage(file);
    }
     
}
