import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "src/modules/auth/guard/auth.guard";
import { SupplierAuthGuard } from "src/modules/supplier/guards/supplier-auth.guard";

export function Auth(){
    return applyDecorators(
        ApiBearerAuth("Authorization"),
        UseGuards(AuthGuard)
    )
}

export function SupplierAuth(){
    return applyDecorators(
        ApiBearerAuth("Authorization"),
        UseGuards(SupplierAuthGuard)
    )
}