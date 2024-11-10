import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UploadFileS3 } from 'src/common/interceptors/upload-file.interceptor';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { FileMaxSizes } from 'src/common/enums/file.enum';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(UploadFileS3("image"))
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile(new ParseFilePipe({
      validators:[
        new MaxFileSizeValidator({maxSize:FileMaxSizes.Image}),
        new FileTypeValidator({fileType:"image/*"})
      ]
    })) image:Express.Multer.File,
  ) {
    return this.categoryService.create(createCategoryDto,image);
  }

  @Get()
  @Pagination()
  findAll(@Query() paginationDto:PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
