import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsString, Length } from "class-validator";
import { ValidationMessage } from "src/common/enums/messages.enum";

export class SendOtpDto{
    @ApiProperty()
    @IsMobilePhone("fa-IR",{},{message:ValidationMessage.InvalidPhoneNumber})
    phone:string;
}

export class CheckOtpDto{
    @ApiProperty()
    @IsMobilePhone("fa-IR",{},{message:ValidationMessage.InvalidPhoneNumber})
    phone:string;
    @ApiProperty()
    @IsString()
    @Length(5,5,{message:ValidationMessage.InvalidOtpCode})
    code:string;
}