import { UserLoginBody } from "./../../../api/schema/users";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserAuth, loginUser } from "api-client";
import { User } from "database";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AxiosError } from "axios";
interface UserAuthOptions {
  onLoginError?: (data: { message: string }) => void;
}
const TOKEN_NAME = "USER_TOKEN";
function useUserAuth(
  systemAdmin: boolean = false,
  options: UserAuthOptions = {}
) {
  const { onLoginError } = options;
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const authenticationQuery = useQuery({
    queryKey: ["authentication"],
    queryFn: getUserAuth,
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }
      return true;
    },
    onError: () => {
      setAuthenticated(false);
    },
    onSuccess: (data: User) => {
      if (data) {
        setAuthenticated(true);
        setUser(data);
      } else {
        setAuthenticated(false);
      }
    },
  });
  const loginMutation = useMutation({
    mutationFn: async (body: UserLoginBody) =>
      await loginUser(body.email, body.password),
    onSuccess: (data) => {
      const { token } = data;
      if (token) {
        localStorage.setItem(TOKEN_NAME, token);
        authenticationQuery.refetch();
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        onLoginError && onLoginError(error.response?.data);
      }
    },
  });

  return {
    authenticated: authenticated,
    loading: authenticationQuery.isLoading,
    user: user,
    refetch: authenticationQuery.refetch,
    login: loginMutation.mutate,
    loginMutation,
    logout: () => {
      localStorage.removeItem("token");
      authenticationQuery.refetch();
      navigate("/login");
    },
  };
}
export default useUserAuth;
