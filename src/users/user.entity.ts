import { Entity, PrimaryGeneratedColumn ,Column, BeforeInsert, ManyToMany, JoinTable, OneToMany} from "typeorm";
import { hash } from "bcrypt";
import { Rol } from "src/roles/rol.entity";
import { Address } from "src/address/address.entity";


@Entity({name: 'users'})
export class User {

    @PrimaryGeneratedColumn()
        id : number;

        @Column()
        name :string;

        @Column()
        lastname : string; 

        @Column({unique:true})
        email : string;

        @Column({unique:true})
        phone : string;

        @Column({nullable:true})
        image : string;

        @Column({select:false})
        password: string;

        @Column({nullable:true})
        notification_token: string;

  
        @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
        created_at : Date ;

        @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
        updated_at : Date	;	

 
            @JoinTable({
                name: 'user_has_roles',
                joinColumn: {
                    name: 'id_user'
                },
                inverseJoinColumn: {
                    name: 'id_rol'
                }
            })  //tabela principal da relação
            
                       // Muitos pra muitos -> relação 
            @ManyToMany(() => Rol, (rol) => rol.users)
            roles: Rol[];

            @OneToMany(()=>Address,address =>address.address)
            address:Address;

        //Criptogrsfia de senha 
        @BeforeInsert()
        async hashPassword(){
            this.password = await hash(this.password,Number(process.env.HASH_SALT));
        }
    
}

