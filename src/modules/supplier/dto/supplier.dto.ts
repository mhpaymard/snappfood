import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsIdentityCard, IsMobilePhone, Length } from "class-validator";
import { ValidationMessage } from "src/common/enums/messages.enum";

export class SupplierSignupDto {
    @ApiProperty()
    category_id:number;
    @ApiProperty()
    @Length(3,50)
    store_name:string;
    @ApiProperty()
    city:string;
    @ApiProperty()
    @Length(3,50)
    manager_name:string;
    @ApiProperty()
    @Length(3,50)
    manager_family:string;
    @ApiProperty()
    @IsMobilePhone("fa-IR",{},{message:ValidationMessage.InvalidPhoneNumber})
    phone:string;
    @ApiPropertyOptional()
    invite_code:string;
}

export class SupplementaryInformationDto{
    @ApiProperty()
    @IsEmail()
    email:string;
    @ApiProperty()
    @IsIdentityCard("IR")
    national_code:string;
}

export class UploadDocumentsDto{
    @ApiProperty({format:"binary"})
    contract:string;
    @ApiProperty({format:"binary"})
    personal_image:string;
}