import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ConflictMessages, NotFoundMessage, PublicMessages } from 'src/common/enums/messages.enum';
import { S3Service } from '../s3/s3.service';
import { FolderNames } from 'src/common/enums/folder-name.enum';
import { toBoolean } from 'src/common/utility/function.util';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utility/pagination.utility';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private categoryRepository:Repository<CategoryEntity>,
    private s3Service:S3Service
  ){}

  async create(createCategoryDto: CreateCategoryDto, image:Express.Multer.File) {
    const {Location} = await this.s3Service.uploadFile(image,FolderNames.Category)
    let {title,slug,show,parent_id} = createCategoryDto;
    const category = await this.findOneBySlug(slug);
    if(category) throw new ConflictException(ConflictMessages.CategorySlug);
    show = toBoolean(show);
    let parent:CategoryEntity = null;
    if(parent_id && !isNaN(parent_id)){
      parent = await this.findOneById(+parent_id);
    }
    await this.categoryRepository.insert({
      title,
      slug,
      show,
      image:Location,
      parent_id:parent?.id
    })
    return {
      message:PublicMessages.Created
    }
  }

  async findAll(paginationDto:PaginationDto) {
    const {limit,page,skip} = paginationSolver(paginationDto?.page,paginationDto?.limit);
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

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
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
