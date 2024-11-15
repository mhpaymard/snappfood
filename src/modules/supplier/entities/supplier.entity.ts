import { BaseEntity } from "src/common/abstracts/entity.abstract";
import { EntityNames } from "src/common/enums/entity-name.enum";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { SupplierOTPEntity } from "./otp.entity";
import { SupplierStatus } from "../enum/supplier-status.enum";

@Entity(EntityNames.Supplier)
export class SupplierEntity extends BaseEntity{
    @Column()
    phone:string;
    @Column({nullable:true})
    email:string;
    @Column()
    manager_name:string;
    @Column()
    manager_family:string;
    @Column()
    store_name:string;
    @Column({nullable:true})
    category_id:number
    @ManyToOne(()=>CategoryEntity,category=>category.suppliers,{onDelete:"SET NULL"})
    category:CategoryEntity;
    @Column()
    city:string;
    @Column({unique:true,nullable:true})
    invite_code:string;
    @Column({unique:true,nullable:true})
    national_code:string;
    @Column({nullable:true})
    agent_id:number;
    @ManyToOne(()=>SupplierEntity,supplier=>supplier.subsets)
    agent:SupplierEntity;
    @OneToMany(()=>SupplierEntity,supplier=>supplier.agent)
    subsets:SupplierEntity[];
    @Column({nullable:true})
    otp_id:number;
    @OneToOne(()=>SupplierOTPEntity,otp=>otp.supplier)
    @JoinColumn({name:"otp_id"})
    otp:SupplierOTPEntity;
    @Column({default:false})
    mobile_verify:boolean;
    @Column({default:SupplierStatus.Registered})
    status:string;
    @Column({nullable:true})
    documents:string[];
    @Column({nullable:true})
    personal_image:string;
}
