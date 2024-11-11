import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { SupplierEntity } from "./supplier.entity";
import { EntityNames } from "src/common/enums/entity-name.enum";
import { BaseEntity } from "src/common/abstracts/entity.abstract";

@Entity(EntityNames.SupplierOtp)
export class SupplierOTPEntity extends BaseEntity{
    @Column()
    code:string;
    @Column()
    expires_in:Date;
    @Column()
    supplier_id:number;
    @OneToOne(()=>SupplierEntity,supplier=>supplier.otp,{onDelete:"CASCADE"})
    @JoinColumn({name:"supplier_id"})
    supplier:SupplierEntity;
}