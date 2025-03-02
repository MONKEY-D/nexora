import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient();
};


declare global {
    // `var` is required for globalThis usage
    // eslint-disable-next-line no-var
    var prismaGlobal: PrismaClient | undefined;
}


const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;


if (process.env.NODE_ENV !== "production") {
    globalThis.prismaGlobal = prisma;
}
