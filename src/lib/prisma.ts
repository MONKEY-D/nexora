import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient();
};

// ✅ Use `let` instead of `var` outside `declare global`
declare global {
    // `var` is required for globalThis usage
    // eslint-disable-next-line no-var
    var prismaGlobal: PrismaClient | undefined;
}

// ✅ Use `let` to fix the ESLint/TypeScript error
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// ✅ Ensure Prisma is reused in development mode
if (process.env.NODE_ENV !== "production") {
    globalThis.prismaGlobal = prisma;
}
