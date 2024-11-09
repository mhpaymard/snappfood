import { BaseEntity } from "src/common/abstracts/entity.abstract";
import { EntityNames } from "src/common/enums/entity-name.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity(EntityNames.UserAddress)
export class UserAddressEntity extends BaseEntity{
    @Column()
    title:string;
    @Column()
    province:string;
    @Column()
    city:string;
    @Column()
    address:string;
    @Column({nullable:true})
    postal_code:string;
    @Column()
    user_id:number;
    @ManyToOne(()=>UserEntity,user => user.address_list,{onDelete:"CASCADE"})
    user:UserEntity;    
}