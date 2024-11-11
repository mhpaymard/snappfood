import { BaseEntity } from "src/common/abstracts/entity.abstract";
import { EntityNames } from "src/common/enums/entity-name.enum";
import { Column, Entity, JoinColumn, OneToMany, OneToOne} from "typeorm";
import { UserAddressEntity } from "./address.entity";
import { UserOTPEntity } from "./otp.entity";

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity{
    @Column({nullable:true})
    first_name:string;
    @Column({nullable:true})
    last_name:string;
    @Column({unique:true})
    mobile:string;
    @Column({nullable:true,unique:true})
    email:string;
    @Column({unique:true,nullable:true})
    invite_code:string;
    @Column({default:0})
    score:number;
    @Column({nullable:true})
    agentId:number;
    @OneToMany(()=>UserAddressEntity,address => address.user)
    address_list:UserAddressEntity[];
    @Column({default:false})
    mobile_verify:boolean;
    @Column({nullable:true})
    otp_id:number;
    @OneToOne(()=>UserOTPEntity,otp=>otp.user)
    @JoinColumn({name:"otp_id"})
    otp:UserOTPEntity;

}