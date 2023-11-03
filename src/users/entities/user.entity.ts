import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserImage } from './user-image.entity';


@Entity()
export class User{
    @PrimaryGeneratedColumn({type: 'int4'}) // Este decorador hace referencia a una llave primaria
    id: number;

    @Column({type: 'varchar', length: '100'}) //Campos de una tabla
    name: string;

    @Column({type: 'varchar'}) //Campos de una tabla
    password: string;

    @Column({type: 'varchar', length: '100'}) //Campos de una tabla
    email: string;

    @Column({type: 'varchar', length: '50'}) //Campos de una tabla
    sexo: string;

   @Column({ type: 'boolean', default: true })
   active: boolean;

    @Column({ type: 'text', array: true , default: ['user'] })
    roles: string[];


      //Un usuario puede tener muchas imagenes
      autor: User; 
@OneToMany(()=> UserImage, (userImage)=> userImage.user,{
    cascade: true,
})
images?: UserImage[];
}
