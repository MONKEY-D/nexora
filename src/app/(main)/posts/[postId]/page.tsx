import type { Metadata } from "next";
import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import Linkify from "@/components/Linkify";
import Post from "@/components/posts/Post";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserToolTip";
import prisma from "@/lib/prisma";
import { getPostDataInclude, UserData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// ✅ Define PageProps once and share across the file
interface PostParamProps {
  params: {
    postId: string;
  };
}

// ✅ generateMetadata using shared PageProps
export async function generateMetadata({
  params,
}: PostParamProps): Promise<Metadata> {
  const { user } = await validateRequest();
  if (!user) return {};

  const post = await prisma.post.findUnique({
    where: { id: params.postId },
    include: getPostDataInclude(user.id),
  });

  if (!post) return {};

  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
  };
}

// ✅ Page component using same PageProps
export default async function Page({ params }: PostParamProps) {
  const { user } = await validateRequest();
  if (!user) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const post = await prisma.post.findUnique({
    where: { id: params.postId },
    include: getPostDataInclude(user.id),
  });

  if (!post) notFound();

  return (
    <main className="flex w-full gap-5">
      <div className="w-full space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden w-80 lg:block">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
}

// ✅ Sidebar component remains the same
async function UserInfoSidebar({ user }: { user: UserData }) {
  const { user: me } = await validateRequest();
  if (!me) return null;

  return (
    <div className="space-y-5 bg-card p-5 rounded-2xl shadow-sm">
      <h2 className="text-xl font-bold">About this user</h2>
      <UserTooltip user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex items-center gap-3"
        >
          <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
          <div>
            <p className="font-semibold hover:underline line-clamp-1">
              {user.displayName}
            </p>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
        </Link>
      </UserTooltip>
      <Linkify>
        <div className="text-muted-foreground whitespace-pre-line break-words line-clamp-6">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== me.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              (f) => f.followerId === me.id,
            ),
          }}
        />
      )}
    </div>
  );
}
