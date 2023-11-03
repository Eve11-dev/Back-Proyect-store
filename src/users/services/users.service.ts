import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {  DataSource, Repository } from "typeorm";
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/users.dto';
import { UserImage } from "../entities/user-image.entity";
import * as bcrypt from "bcrypt";
import { loginUserDto } from "../dto/login.user.dto";


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(UserImage)
        private readonly userImageRepo: Repository<UserImage>,

        private readonly dataSource: DataSource,
    ){}
    
    //Crear un registro
   /* async create(CreateUserDto: CreateUserDto) {
        const user = this.userRepo.create(CreateUserDto);
        await this.userRepo.save(user);

        return user;
    }*/

      //Crear un usuario y agregar una imagen
      async create(userDto: CreateUserDto) {
        const { images = [], password, ...detailsUser} = userDto;

        const user = await this.userRepo.create({
            ...detailsUser,
            password: bcrypt.hashSync(password, 10),
            images: images.map((image) =>
            this.userImageRepo.create({ url:image }),
            ),
        });   

        await this.userRepo.save(user);
        return user;
    }
   /* //Encontrar un registro
    findOne(id: number){
        return this.userRepo.findOneBy({id});
    }*/

    async login(login: loginUserDto) {
        const { password, email, } = login;
        const user = await this.userRepo.findOne({
            where: { email },
            select: { password: true, email: true },
        });

        if (!user) {
            throw new UnauthorizedException(
                'Credenciales no validas, correo no encontrado',
            );
        }

        if (!bcrypt.compareSync(password, user.password)) {
            throw new UnauthorizedException(
            'Credenciales no validas, correo no encontrado',
            );
        }
            return user;
    }

     //Encontrar un registro con relaciones
     findOne(id: number){
        return this.userRepo.findOne({
            where: {id},
            relations:{
                autor: true,
            },
        });
    }
    //Mostrar todos los registros 
    findAll() {
        return this.userRepo.find({
            order: { id: 'ASC'},
            relations:{
                images: true,
            },
        });
    }

    
    //Eliminar un registro
    async remove(id: number) {
        const User = await this.findOne(id);
        await this.userRepo.remove(User);
        return 'Usuario eliminado satisfactoriamente '
    }
    //Actualizar un registro o producto
    /* async update (id: number, cambios: CreateUserDto){
        const oldUser = await this.findOne(id);
        const updateUser = await this.userRepo.merge(oldUser, cambios);
        return this.userRepo.save(updateUser);
    }*/

      //Actualizar un usuario con imagenes
      async update(id: number, cambios: CreateUserDto) {
        const { images, ...updateAll } = cambios;
        const user = await this.userRepo.preload({
        id: id,
        ...updateAll,  // Para esparciar todos los datos del ProductDto
        });
    
        //Empezamos a correr el queryRunner
        const  queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        if(images) {
            //Si images no está vacio, vamos a borrar las imagines existentes 
            await queryRunner.manager.delete(UserImage, {user: {id}});
    
            //Creamos nuevas imagenes de producto
            user.images = images.map((image) =>
                this.userImageRepo.create({ url: image}),
            );
        } else {
            user.images = await this.userImageRepo.findBy({ user: {id} });
        }
    
        //Guardamos en usuario
        await queryRunner.manager.save(user);
    
        //Se finaliza la transaccion y liberamos el queryRunner
        await queryRunner.commitTransaction();
        await queryRunner.release();
    
        return user;
        }
    

}