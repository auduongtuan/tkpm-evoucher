import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
// name: singular
export type MutationFunction<GetReturnType = unknown, TVariables = unknown> = (
  variables: TVariables
) => Promise<GetReturnType>;
export default function useRecord<GetReturnType = unknown>({
  name,
  getFn,
  onGetSuccess,
}: {
  name: string;
  getFn: (id: number) => Promise<GetReturnType>;
  onGetSuccess?: (data: GetReturnType) => Promise<unknown> | unknown;
}) {
  // const queryClient = useQueryClient();
  const params = useParams();
  const id = params?.id ? parseInt(params?.id) : undefined;
  // const listQueryKey = [name, "list"];
  // const refetchList = async () => {
  //   await queryClient.refetchQueries({
  //     queryKey: listQueryKey,
  //     type: "active",
  //   });
  // };
  const recordQuery = id
    ? useQuery({
        queryKey: [`${name}_record`, id],
        queryFn: async () => getFn(id),
        onSuccess: (data) => {
          if (onGetSuccess) onGetSuccess(data);
        },
      })
    : undefined;

  return {
    id,
    recordQuery,
  };
}
