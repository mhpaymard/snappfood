import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { SupplierSignupDto } from './dto/supplier.dto';
import { ConflictMessages, PublicMessages } from 'src/common/enums/messages.enum';
import { CategoryService } from '../category/category.service';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity) private supplierRepository:Repository<SupplierEntity>,
    private categoryService:CategoryService
  ){}

  async signup(signupDto:SupplierSignupDto){
    let {category_id,invite_code,city,manager_family,manager_name,phone,store_name} = signupDto;
    const supplier = await this.supplierRepository.findOneBy({phone});
    if(supplier) throw new ConflictException(ConflictMessages.SupplierAccountPhone)
    const category = await this.categoryService.findOneById(+category_id);
    let agent:SupplierEntity = null;
    if(invite_code){
      agent = await this.supplierRepository.findOneBy({invite_code});
    }
    const mobileNumber = parseInt(phone)
    const account = this.supplierRepository.create({
      manager_name,
      manager_family,
      city,
      store_name,
      category_id:category.id,
      phone,
      agent_id:agent?.id ?? null,
      invite_code:mobileNumber.toString(32).toUpperCase()
    })
    await this.supplierRepository.save(account);
    return {
      message:PublicMessages.Created
    }
  }
}
