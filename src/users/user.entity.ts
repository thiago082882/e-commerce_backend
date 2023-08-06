import { Entity, PrimaryGeneratedColumn ,Column} from "typeorm";

@Entity({name: 'users'})
export class User {

    @PrimaryGeneratedColumn()
        id : number;

        @Column()
        name :String;

        @Column()
        lastname : String; 

        @Column({unique:true})
        email : String;

        @Column({unique:true})
        phone : String;

        @Column({nullable:true})
        image : String;

        @Column()
        password: String;

        @Column({nullable:true})
        notification_token: String;

  
        @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
        created_at : Date ;

        @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
        updated_at : Date	;	
    
}

