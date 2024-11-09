import { BaseEntity } from "src/common/abstracts/entity.abstract";
import { EntityNames } from "src/common/enums/entity-name.enum";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity(EntityNames.Category)
export class CategoryEntity extends BaseEntity {
    @Column()
    title:string;
    @Column({unique:true})
    slug:string;
    @Column()
    image:string;
    @Column()
    show:boolean;
    @Column({nullable:true})
    parent_id:number;
    @ManyToOne(()=>CategoryEntity,category=> category.children,{onDelete:"CASCADE"})
    parent:CategoryEntity;
    @OneToMany(()=>CategoryEntity,category=>category.parent)
    children:CategoryEntity[];
}
