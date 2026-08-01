import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const permissions = [
  { action: 'read', resource: 'users', description: 'Read users' },
  { action: 'manage', resource: 'users', description: 'Manage user roles' },
  { action: 'read', resource: 'roles', description: 'Read roles' },
  { action: 'manage', resource: 'roles', description: 'Manage roles' },
  { action: 'read', resource: 'permissions', description: 'Read permissions' },
  {
    action: 'manage',
    resource: 'permissions',
    description: 'Manage permissions',
  },
];

async function main() {
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        action_resource: {
          action: permission.action,
          resource: permission.resource,
        },
      },
      update: {
        description: permission.description,
      },
      create: permission,
    });
  }

  const allPermissions = await prisma.permission.findMany();

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {
      description: 'Full system access',
    },
    create: {
      name: 'ADMIN',
      description: 'Full system access',
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'MANAGER' },
    update: {
      description: 'Operational read access',
    },
    create: {
      name: 'MANAGER',
      description: 'Operational read access',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {
      description: 'Standard authenticated user',
    },
    create: {
      name: 'USER',
      description: 'Standard authenticated user',
    },
  });

  await prisma.rolePermission.deleteMany({
    where: { roleId: { in: [adminRole.id, managerRole.id, userRole.id] } },
  });

  await prisma.rolePermission.createMany({
    data: allPermissions.map((permission) => ({
      roleId: adminRole.id,
      permissionId: permission.id,
    })),
  });

  const managerPermissionKeys = new Set([
    'users:read',
    'roles:read',
    'permissions:read',
  ]);

  await prisma.rolePermission.createMany({
    data: allPermissions
      .filter((permission) =>
        managerPermissionKeys.has(`${permission.resource}:${permission.action}`),
      )
      .map((permission) => ({
        roleId: managerRole.id,
        permissionId: permission.id,
      })),
  });

  const password = await bcrypt.hash('Admin123!', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password,
      firstName: 'System',
      lastName: 'Admin',
      isActive: true,
    },
    create: {
      email: 'admin@example.com',
      password,
      firstName: 'System',
      lastName: 'Admin',
    },
  });

  await prisma.userRole.deleteMany({ where: { userId: adminUser.id } });
  await prisma.userRole.create({
    data: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log('Seed completed');
  console.log('Admin login: admin@example.com / Admin123!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
