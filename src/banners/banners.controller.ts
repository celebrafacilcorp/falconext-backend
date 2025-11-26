import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('banners')
@UseGuards(JwtAuthGuard)
export class BannersController {
    constructor(private readonly bannersService: BannersService) { }

    @Post()
    create(@Req() req: any, @Body() createBannerDto: CreateBannerDto) {
        return this.bannersService.create(req.user.empresaId, createBannerDto);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.bannersService.findAll(req.user.empresaId);
    }

    @Get(':id')
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.bannersService.findOne(+id, req.user.empresaId);
    }

    @Patch(':id')
    update(@Req() req: any, @Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
        return this.bannersService.update(+id, req.user.empresaId, updateBannerDto);
    }

    @Delete(':id')
    remove(@Req() req: any, @Param('id') id: string) {
        return this.bannersService.remove(+id, req.user.empresaId);
    }
}
