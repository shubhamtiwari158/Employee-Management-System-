import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
 let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;

// import { PrismaClient } from '@prisma/client';

// // Create a singleton instance of Prisma Client
// let prisma;

// if (process.env.NODE_ENV === 'production') {
//   prisma = new PrismaClient();
// } else {
//   // In development, create a single instance across hot reloads
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//   prisma = global.prisma;
// }

// export { prisma };