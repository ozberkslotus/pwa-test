"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { HOME_ROUTE } from "@/lib/routes";
import { tokenStorage } from "@/lib/token-storage";
import { getMe, login } from "./api";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: ({ token, user }) => {
      tokenStorage.set(token);
      queryClient.setQueryData(authKeys.me, user);
      router.replace(HOME_ROUTE);
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: getMe,
    enabled: !!tokenStorage.get(),
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    tokenStorage.clear();
    queryClient.clear();
    router.replace("/login");
  };
}
