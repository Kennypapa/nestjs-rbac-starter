import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

const roleInclude = {
  permissions: {
    include: {
      permission: true,
    },
  },
} as const;

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoleDto) {
    const existing = await this.prisma.role.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Role already exists');
    }

    if (dto.permissionIds?.length) {
      await this.ensurePermissionsExist(dto.permissionIds);
    }

    return this.prisma.role.create({
      data: {
        name: dto.name,
        description: dto.description,
        permissions: dto.permissionIds?.length
          ? {
              create: dto.permissionIds.map((permissionId) => ({
                permissionId,
              })),
            }
          : undefined,
      },
      include: roleInclude,
    });
  }

  findAll() {
    return this.prisma.role.findMany({
      include: roleInclude,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: roleInclude,
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async update(id: string, dto: UpdateRoleDto) {
    await this.findOne(id);

    return this.prisma.role.update({
      where: { id },
      data: { description: dto.description },
      include: roleInclude,
    });
  }

  async assignPermissions(id: string, dto: AssignPermissionsDto) {
    await this.findOne(id);
    await this.ensurePermissionsExist(dto.permissionIds);

    await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
    await this.prisma.rolePermission.createMany({
      data: dto.permissionIds.map((permissionId) => ({
        roleId: id,
        permissionId,
      })),
    });

    return this.findOne(id);
  }

  toResponse(role: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    permissions: Array<{
      permission: {
        id: string;
        action: string;
        resource: string;
        description: string | null;
      };
    }>;
  }) {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions.map((entry) => ({
        id: entry.permission.id,
        key: `${entry.permission.resource}:${entry.permission.action}`,
        action: entry.permission.action,
        resource: entry.permission.resource,
        description: entry.permission.description,
      })),
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  private async ensurePermissionsExist(permissionIds: string[]) {
    const permissions = await this.prisma.permission.findMany({
      where: { id: { in: permissionIds } },
    });

    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('One or more permissions were not found');
    }
  }
}
