import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "src/modules/auth/auth.service";
import {Request} from "express";
import { AuthMessage } from "src/common/enums/messages.enum";
import { isJWT } from "class-validator";
import { SupplierService } from "../supplier.service";
@Injectable()
export class SupplierAuthGuard implements CanActivate{
    constructor(private supplierService:SupplierService){}
    async canActivate(context: ExecutionContext) {Request
        const httpContext = context.switchToHttp();
        const request:Request = httpContext.getRequest();
        const token = this.extractToken(request);
        request.user = await this.supplierService.validateAccessToken(token);
        return true;
    }
    protected extractToken(request:Request):string{
        const {authorization} = request.headers;
        if(!authorization || authorization.trim() == "") throw new UnauthorizedException(AuthMessage.LoginRequired);
        const [bearer,token] = authorization.split(" ");
        if(bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token)) throw new UnauthorizedException(AuthMessage.LoginRequired);
        return token;
    }
}