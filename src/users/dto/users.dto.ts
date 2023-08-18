import { IsNotEmpty, IsNumber, IsString, MaxLength, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto{

    @IsNotEmpty()
    @IsNumber()
    id: number;
    //Los decoradores en el dto se validan por la info que se agregue sea la que se conecta
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    sexo: string;

   @IsBoolean()
   @IsOptional()
   active: boolean;
}