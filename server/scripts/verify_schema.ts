
import { PrismaClient, AssetCategory, AssetStatus, HeirRelation } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting verification...');

  // 1. Create a User
  const user = await prisma.user.create({
    data: {
      email: `test-${Date.now()}@example.com`,
      fullName: 'Test User',
    },
  });
  console.log('Created User:', user.id);

  // 2. Create an Asset
  const asset = await prisma.asset.create({
    data: {
      name: 'Test Property',
      category: AssetCategory.property,
      value: 500000,
      status: AssetStatus.active,
      userId: user.id,
    },
  });
  console.log('Created Asset:', asset.id);

  // 3. Create an Heir
  const heir = await prisma.heir.create({
    data: {
      name: 'Test Heir',
      relation: HeirRelation.son,
      userId: user.id,
    },
  });
  console.log('Created Heir:', heir.id);

  // 4. Verify Relations
  const userWithRelations = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      assets: true,
      heirs: true,
    },
  });

  if (!userWithRelations) throw new Error('User not found');
  if (userWithRelations.assets.length !== 1) throw new Error('Asset relation failed');
  if (userWithRelations.heirs.length !== 1) throw new Error('Heir relation failed');

  console.log('Verification successful! All relations working correctly.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
