import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./services/users.service";
import { User } from './entities/user.entity';
import { UsersController } from "./controllers/users.controller";
import { UserImage } from "./entities/user-image.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, UserImage])],
    providers: [UsersService],
    //aqui los servicios
    controllers:[UsersController],
    //aqui los controladores
    exports: [TypeOrmModule, UsersModule],
    
})
export class UsersModule{}
