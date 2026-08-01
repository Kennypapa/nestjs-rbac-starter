import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionsService } from './permissions.service';

@ApiTags('permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Roles('ADMIN')
  @RequirePermissions('permissions:manage')
  @ApiOperation({ summary: 'Create a permission' })
  async create(@Body() dto: CreatePermissionDto) {
    const permission = await this.permissionsService.create(dto);
    return this.permissionsService.toResponse(permission);
  }

  @Get()
  @Roles('ADMIN', 'MANAGER')
  @RequirePermissions('permissions:read')
  @ApiOperation({ summary: 'List permissions' })
  async findAll() {
    const permissions = await this.permissionsService.findAll();
    return permissions.map((permission) =>
      this.permissionsService.toResponse(permission),
    );
  }
}
