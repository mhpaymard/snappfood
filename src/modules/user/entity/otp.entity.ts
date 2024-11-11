import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("otp")
export class OTPEntity{
    @PrimaryGeneratedColumn("increment")
    id:number;
    @Column()
    code:string;
    @Column()
    expires_in:Date;
    @Column()
    user_id:number;
    @OneToOne(()=>UserEntity,user=>user.otp,{onDelete:"CASCADE"})
    @JoinColumn({name:"user_id"})
    user:UserEntity;
    @CreateDateColumn()
    created_at:Date;
    @UpdateDateColumn()
    updated_at:Date;
}