// import { useToast } from "@/hooks/use-toast";
// import { useUploadThing } from "@/lib/uploadthing";
// import { UpdateUserProfileValues } from "@/lib/validation";
// import {
//   InfiniteData,
//   QueryFilters,
//   useMutation,
//   useQueryClient,
// } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { updateUserProfile } from "./actions";
// import { PostsPage } from "@/lib/types";

// export function useUpdateProfileMutation() {
//   const { toast } = useToast();

//   const router = useRouter();

//   const queryClient = useQueryClient();

//   const { startUpload: startAvatarUpload } = useUploadThing("avatar");

//   const mutation = useMutation({
//     mutationFn: async ({
//       values,
//       avatar,
//     }: {
//       values: UpdateUserProfileValues;
//       avatar?: File;
//     }) => {
//       return Promise.all([
//         updateUserProfile(values),
//         avatar && startAvatarUpload([avatar]),
//       ]);
//     },
//     onSuccess: async ([updatedUser, uploadResult]) => {
//       const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;

//       const queryFilter: QueryFilters = {
//         queryKey: ["post-feed"],
//       };

//       await queryClient.cancelQueries(queryFilter);

//       queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
//         queryFilter,
//         (oldData) => {
//           if (!oldData) return;

//           return {
//             pageParams: oldData.pageParams,
//             pages: oldData.pages.map((page) => ({
//               nextCursor: page.nextCursor,
//               posts: page.posts.map((post) => {
//                 if (post.user.id === updatedUser.id) {
//                   return {
//                     ...post,
//                     user: {
//                       ...updatedUser,
//                       avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
//                     },
//                   };
//                 }
//                 return post;
//               }),
//             })),
//           };
//         },
//       );

//       router.refresh();

//       toast({
//         description: "Profile updated",
//       });
//     },
//     onError(error) {
//       console.error(error);
//       toast({
//         variant: "destructive",
//         description: "Failed to update profile. Please try again.",
//       });
//     },
//   });

//   return mutation;
// }


import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileValues } from "@/lib/validation";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./actions";
import { PostsPage } from "@/lib/types";

export function useUpdateProfileMutation() {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateUserProfileValues;
      avatar?: File;
    }) => {
      return Promise.all([
        updateUserProfile(values),
        avatar ? startAvatarUpload([avatar]) : null, // Ensure we handle undefined avatar
      ]);
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      const newAvatarUrl = uploadResult?.[0]?.serverData?.avatarUrl;
      const queryKey = ["post-feed"];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        { queryKey },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page: PostsPage) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post: PostsPage["posts"][number]) => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        }
      );

      router.refresh();

      toast({
        description: "Profile updated successfully!",
      });
    },
    onError(error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        description: "Failed to update profile. Please try again.",
      });
    },
  });

  return mutation;
}
