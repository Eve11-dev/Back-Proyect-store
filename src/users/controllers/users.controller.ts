import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { CreateUserDto } from '../dto/users.dto';
import { UsersService } from "../services/users.service";
import { loginUserDto } from "../dto/login.user.dto";

@Controller ('Users')
export class UsersController{
    constructor( private readonly usersService: UsersService) {} 
    
    @Post()
    async create(@Body() UserDto: CreateUserDto){
        return await this.usersService.create(UserDto);
    }
    @Post('login')
    async login(@Body() login:loginUserDto) {
        return this.usersService.login(login);
    }

    @Get()
    findAll(){
      return this.usersService.findAll();  
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.usersService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number){
        return this.usersService.remove(id);
    }
    //El metodo patch actualiza parcialmente
    //Los pipes son transformadores, transforman la data
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() createUserDto: CreateUserDto,
    ) {
        return this.usersService.update(id, createUserDto);
    }
}