import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.parameter.create({
    data: {
      key: 'expirationDelta',
      value: '400',
    },
  });

  await prisma.user.create({
    data: {
      email: 'devxtest@gmail.com',
      name: 'devx admin',
      password: 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', // 123
      verified: true,
      role: 'ADMIN',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
