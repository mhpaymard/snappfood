import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { EntityNames } from "src/common/enums/entity-name.enum";
import { BaseEntity } from "src/common/abstracts/entity.abstract";

@Entity(EntityNames.UserOtp)
export class UserOTPEntity extends BaseEntity{
    @Column()
    code:string;
    @Column()
    expires_in:Date;
    @Column()
    user_id:number;
    @OneToOne(()=>UserEntity,user=>user.otp,{onDelete:"CASCADE"})
    @JoinColumn({name:"user_id"})
    user:UserEntity;
}