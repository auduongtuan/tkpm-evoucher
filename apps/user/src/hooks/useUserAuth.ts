import { UserLoginBody } from "database/schema/users";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAuthUser, loginUser } from "api-client";
import { User } from "database";
import { AxiosError } from "axios";
import useAppStore from "@/stores/useAppStore";
interface UserAuthOptions {
  onLoginError?: (data: { message: string }) => void;
}
const TOKEN_NAME = "USER_TOKEN";
function useUserAuth(options: UserAuthOptions = {}) {
  const { onLoginError } = options;
  const { user, setUser, authenticated, setAuthenticated } = useAppStore();
  const authenticationQuery = useQuery({
    queryKey: ["user", "authentication"],
    queryFn: getAuthUser,
    onError: (err) => {
      console.log(err);
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
      console.log("token", token);
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
      localStorage.removeItem(TOKEN_NAME);
      setUser(null);
      setAuthenticated(false);
      authenticationQuery.refetch();
      // navigate("/login");
    },
  };
}
export default useUserAuth;
