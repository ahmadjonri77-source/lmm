import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) { }


  @Post()
  
  createSection(@Body() payload: CreateSectionDto) {
    return this.sectionService.createSection(payload);
  }

  @Get("all")
  findAllSections() {
    return this.sectionService.findAllSections();
  }

  @Get("one/:id")
  findOneSection(@Param("id",ParseIntPipe) id: number) {
    return this.sectionService.findOneSection(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateSectionDto) {
    return this.sectionService.updateSection(id, payload);
  }

  @Delete(':id')
  deleteSection(@Param('id',ParseIntPipe) id: number) {
    return this.sectionService.deleteSection(id);
  }
}
