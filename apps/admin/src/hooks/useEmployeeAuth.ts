import { useQuery } from "@tanstack/react-query";
import { getEmployeeAuth } from "@/api-client";
import { Employee } from "database";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AxiosError } from "axios";
function useEmployeeAuth(systemAdmin: boolean = false) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
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
      } else {
        setAuthenticated(false);
      }
    },
  });

  return {
    authenticated: authenticated,
    loading: authenticationQuery.isLoading,
    employee: employee,
    refetch: authenticationQuery.refetch,
    logout: () => {
      localStorage.removeItem("token");
      authenticationQuery.refetch();
      navigate("/login");
    },
  };
}
export default useEmployeeAuth;
