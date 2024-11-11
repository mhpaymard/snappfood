import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Query, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UploadFileS3 } from 'src/common/interceptors/upload-file.interceptor';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { FileMaxSizes, FileTypes } from 'src/common/enums/file.enum';
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

  @Get("/by-slug/:slug")
  findBySlug(@Param("slug") slug:string) {
    return this.categoryService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(UploadFileS3("image"))
  update(
    @Param('id',ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile(new ParseFilePipe({
      validators:[
        new MaxFileSizeValidator({maxSize:FileMaxSizes.Image}),
        new FileTypeValidator({fileType:FileTypes.Image})
      ]
    })) image:Express.Multer.File
  ) {
    return this.categoryService.update(+id, updateCategoryDto,image);
  }

  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
