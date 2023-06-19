import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { FormInstance, message } from "antd";
import { useParams } from "react-router-dom";
import { capitalize, isObject } from "lodash-es";
// name: singular
export type MutationFunction<GetReturnType = unknown, TVariables = unknown> = (
  variables: TVariables
) => Promise<GetReturnType>;
export default function useCrud<
  RecordCreateBody = unknown,
  RecordUpdateBody = unknown,
  GetReturnType = unknown,
  CreateReturnType = unknown,
  UpdateReturnType = unknown
>({
  name,
  getFn,
  updateFn,
  createFn,
  closeModal,
  onGetSuccess,
  onCreateSuccess,
  onCreateError,
  onUpdateSuccess,
  valuesFilter,
  form,
  recordId,
}: {
  name: string;
  form: FormInstance;
  recordId?: number;
  getFn: (id: number) => Promise<GetReturnType>;
  onGetSuccess?: (data: GetReturnType) => Promise<unknown> | unknown;
  onCreateSuccess?: (data: CreateReturnType) => Promise<unknown> | unknown;
  onCreateError?: (error: unknown) => Promise<unknown> | unknown;
  onUpdateSuccess?: (data: UpdateReturnType) => Promise<unknown> | unknown;
  createFn: (body: RecordCreateBody) => Promise<CreateReturnType>;
  updateFn: (id: number, body: RecordUpdateBody) => Promise<UpdateReturnType>;
  valuesFilter?: (values: any) => any;
  closeModal?: Function;
}) {
  const queryClient = useQueryClient();
  const params = useParams();
  const id = recordId || (params?.id ? parseInt(params?.id) : undefined);
  const listQueryKey = [name, "list"];
  const refetchList = async () => {
    await queryClient.refetchQueries({
      queryKey: listQueryKey,
      type: "active",
    });
  };
  const recordQuery = id
    ? useQuery({
        queryKey: [`${name}_record`, id],
        queryFn: async () => getFn(id),
        onSuccess: (data) => {
          if (onGetSuccess) onGetSuccess(data);
        },
        refetchOnWindowFocus: false,
      })
    : undefined;
  const updateRecordMutation = id
    ? useMutation({
        mutationFn: (body: RecordUpdateBody) => updateFn(id, body),
        onSuccess: async (data) => {
          await refetchList();
          message.success(
            `${capitalize(name)} ${
              isObject(data) && "name" in data ? `${data.name} ` : ""
            }updated`
          );
          if (onUpdateSuccess) onUpdateSuccess(data);
          if (closeModal) closeModal();
        },
      })
    : undefined;
  const createRecordMutation = useMutation({
    mutationFn: (body: RecordCreateBody) => createFn(body),
    onSuccess: async (data) => {
      await refetchList();
      message.success(`${capitalize(name)} created`);
      if (onCreateSuccess) onCreateSuccess(data);
      if (closeModal) closeModal();
    },
    onError: onCreateError,
  });
  const onFormOk = () => {
    form
      .validateFields()
      .then((values) => {
        const submitedValues = valuesFilter ? valuesFilter(values) : values;
        console.log("SUBMIT VALUES", submitedValues);
        if (id) {
          updateRecordMutation?.mutate(submitedValues);
        } else {
          createRecordMutation.mutate(submitedValues, {
            onSuccess: () => {
              form.resetFields();
            },
          });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  return {
    id,
    refetchList,
    recordQuery,
    updateRecordMutation,
    createRecordMutation,
    onFormOk,
    formModalProps: {
      title: id ? `Edit ${name}` : `Add new ${name}`,
      okText: id ? "Update" : "Create",
      cancelText: "Cancel",
      onOk: onFormOk,
    },
  };
}
