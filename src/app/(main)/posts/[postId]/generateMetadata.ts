import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { postId: string };
}): Promise<Metadata> {
  const { user } = await validateRequest();
  if (!user) return {};

  const post = await prisma.post.findUnique({
    where: { id: params.postId },
    include: getPostDataInclude(user.id),
  });
  if (!post) return {};

  return { title: `${post.user.displayName}: ${post.content.slice(0, 50)}...` };
}
