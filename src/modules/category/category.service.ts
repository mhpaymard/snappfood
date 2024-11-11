import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ConflictMessages, NotFoundMessage, PublicMessages } from 'src/common/enums/messages.enum';
import { S3Service } from '../s3/s3.service';
import { FolderNames } from 'src/common/enums/folder-name.enum';
import { isNumber, toBoolean } from 'src/common/utility/function.util';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utility/pagination.utility';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private categoryRepository:Repository<CategoryEntity>,
    private s3Service:S3Service
  ){}

  async create(createCategoryDto: CreateCategoryDto, image:Express.Multer.File) {
    let {title,slug,show,parent_id} = createCategoryDto;
    const category = await this.findOneBySlug(slug);
    if(category) throw new ConflictException(ConflictMessages.CategorySlug);
    const {Location,Key} = await this.s3Service.uploadFile(image,FolderNames.Category)

    show = toBoolean(show);
    let parent:CategoryEntity = null;
    if(parent_id && isNumber(parent_id)){
      parent = await this.findOneById(+parent_id);
    }
    await this.categoryRepository.insert({
      title,
      slug,
      show,
      image:Location,
      parent_id:parent?.id,
      image_key:Key
    })
    return {
      message:PublicMessages.Created
    }
  }

  async findAll(paginationDto:PaginationDto) {
    const {limit,page,skip} = paginationSolver(+paginationDto?.page,+paginationDto?.limit);
    const [categories,count] = await this.categoryRepository.findAndCount({
      where:{},
      relations:{
        parent:true
      },
      select:{
        parent:{
          title:true
        }
      },
      skip,
      take:limit,
      order:{id:"DESC"}
    })
    return{
      categories,
      pagination:paginationGenerator(count,page,limit)
    }
  }

  async findBySlug(slug:string){
    const category = await this.categoryRepository.findOne({
      where:{slug},
      relations:{
        children:true
      }
    });
    if(!category) throw new NotFoundException(NotFoundMessage.NotFoundCategorySlug);

    return {
      category,
    }
  }
  async update(id: number, updateCategoryDto: UpdateCategoryDto,image:Express.Multer.File) {
    const {show,slug,title,parent_id} = updateCategoryDto;
    const category = await this.findOneById(id);
    const updateObject: DeepPartial<CategoryEntity> = {};
    if(image){
      const {Location,Key} = await this.s3Service.uploadFile(image,FolderNames.Category);
      if(Location){
        updateObject['image'] = Location;
        updateObject['key'] = Key;
        if(category?.image_key) await this.s3Service.deleteFile(category?.image_key)
      }
    }
    if(title) updateObject['title'] = title;
    if(show) updateObject['show'] = toBoolean(show);
    if(slug){
      const categoryWithSlug = await this.findOneBySlug(slug);
      if(!!categoryWithSlug && categoryWithSlug.id!==id) throw new ConflictException(ConflictMessages.CategorySlug)
      updateObject['slug'] = slug;
    }
    if(parent_id && isNumber(parent_id)){
      let parent = await this.findOneById(+parent_id);
      updateObject['parent_id']=parent.id;
    }
    await this.categoryRepository.update({id},updateObject);
    return {
      message: PublicMessages.Updated
    }
  }

  async remove(id: number) {
    await this.findOneById(id);
    await this.categoryRepository.delete({id});
    return {
      message: PublicMessages.Deleted
    }
  }

  async findOneBySlug(slug: string) {
    return this.categoryRepository.findOneBy({slug});
  }
  async findOneById(id:number){
    const category = await this.categoryRepository.findOneBy({id});
    if(!category) throw new NotFoundException(NotFoundMessage.NotFoundCategory);
    return category;
  }
}
