import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id:number;
    @CreateDateColumn({type:"time with time zone"})
    created_at:Date;
    @UpdateDateColumn({type:"time with time zone"})
    updated_at:Date;
}