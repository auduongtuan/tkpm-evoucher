import { useQuery } from "@tanstack/react-query";
import { getEmployeeAuth } from "@/api-client";
import { Employee } from "database";
import { useNavigate } from "react-router-dom";
function useEmployeeAuth(systemAdmin: boolean = false) {
  const authenticationQuery = useQuery({
    queryKey: ["authentication"],
    queryFn: getEmployeeAuth,
  });
  const navigate = useNavigate();
  const employee = authenticationQuery.data as Employee;
  if (employee && systemAdmin && !employee.systemAdmin) {
    return {
      authenticated: false,
    };
  }
  return {
    employee: authenticationQuery.data as Employee,
    authenticated: authenticationQuery.data?.id !== undefined,
    logout: () => {
      localStorage.removeItem("token");
      authenticationQuery.refetch();
      navigate("/login");
    },
  };
}
export default useEmployeeAuth;
