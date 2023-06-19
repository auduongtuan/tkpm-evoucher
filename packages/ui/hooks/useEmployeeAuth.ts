import { EmployeeLoginBody } from "database/schema/employees";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getEmployeeAuth, loginEmployee } from "api-client";
import { Employee } from "database";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import useAdminStore from "./useAdminStore";
const TOKEN_NAME = "EMPLOYEE_TOKEN";
interface EmployeeAuthOptions {
  onLoginError?: (data: { message: string }) => void;
}
function useEmployeeAuth(
  systemAdmin: boolean = false,
  options: EmployeeAuthOptions = {}
) {
  const { onLoginError } = options;
  const {
    employee,
    setEmployee,
    authenticated,
    setAuthenticated,
    logout,
    setLogout,
  } = useAdminStore();
  const navigate = useNavigate();
  const authenticationQuery = useQuery({
    queryKey: ["authentication"],
    queryFn: getEmployeeAuth,
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }
      return true;
    },
    onError: () => {
      setAuthenticated(false);
      console.log("error");
    },
    onSuccess: (data: Employee) => {
      if (data) {
        if (systemAdmin && data.systemAdmin) {
          setAuthenticated(true);
        }
        if (!systemAdmin) {
          setAuthenticated(true);
        }
        setEmployee(data);
        setLogout(() => {
          localStorage.removeItem(TOKEN_NAME);
          authenticationQuery.refetch();
          navigate("/login");
        });
      } else {
        setAuthenticated(false);
      }
    },
  });
  const loginMutation = useMutation({
    mutationFn: async (body: EmployeeLoginBody) =>
      await loginEmployee(body.email, body.password),
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
    employee: employee,
    refetch: authenticationQuery.refetch,
    loginMutation,
    login: loginMutation.mutate,
    logout,
  };
}
export default useEmployeeAuth;
