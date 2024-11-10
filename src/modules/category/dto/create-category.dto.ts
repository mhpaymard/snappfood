import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCategoryDto {
    @ApiProperty({type:"string"})
    title:string;
    @ApiProperty({type:"string"})
    slug:string;
    @ApiProperty({format:"binary"})
    image:string;
    @ApiProperty({type:"boolean"})
    show:boolean;
    @ApiPropertyOptional({type:"number",nullable:true,default:''})
    parent_id:number;
}
