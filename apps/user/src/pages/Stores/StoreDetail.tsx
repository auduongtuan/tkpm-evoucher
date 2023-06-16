import Link from "@/components/Link";
import useRecord from "@/hooks/useRecord";
import { getStore } from "api-client";
import pluralize from "pluralize-esm";
import { RiGameFill, RiStore2Fill } from "react-icons/ri";
import { Breadcrumb, Button } from "antd";
const StoreDetail = () => {
  // const { modalProps, closeModal } = useRouteModal("/stores");
  // const [form] = Form.useForm();
  // const { formModalProps } = useCrud({
  //   name: "store",
  //   getFn: getStore,
  //   onGetSuccess: (data) => {
  //     form.setFieldsValue({ ...data });
  //   },
  //   updateFn: updateStore,
  //   createFn: createStore,
  //   closeModal: closeModal,
  //   form: form,
  // });
  const { id, recordQuery } = useRecord({
    name: "store",
    getFn: getStore,
  });
  const store = recordQuery?.data;
  store && console.log(store.campaigns);
  return !recordQuery?.isLoading && store ? (
    <div className="grid grid-cols-12 gap-6 p-4 bg-white rounded-xl">
      <Breadcrumb
        className="col-span-12"
        items={[
          {
            title: (
              <Link to={"/"} noStyle>
                Home
              </Link>
            ),
          },
          {
            title: (
              <Link to={"/"} noStyle>
                {store.merchant.name}
              </Link>
            ),
          },
          {
            title: store.name,
          },
        ]}
      />
      <div className="col-span-12 md:col-span-7">
        {store.merchant.image && (
          <img
            src={store.merchant.image}
            className="max-w-full aspect-[4/3] object-cover rounded-md"
            alt={store.name}
          />
        )}
      </div>
      <div className="col-span-12 mt-2 md:col-span-5">
        <div className="col-span-12 text-2xl">{store.name}</div>

        <div className="mt-2 leading-normal text-gray-600 text-md">
          {store.address}
        </div>
        <div className="mt-4 text-gray-600 text-md">
          Categories:{" "}
          {store.categories
            .map((category) => category.name)

            .join(", ")}
        </div>
        <Button
          href={`http://www.google.com/maps/place/${store.lat},${store.lng}`}
          key={store.id + "record"}
          className="flex flex-col mt-3 no-underline"
          target="_blank"
          type="primary"
        >
          Open in Google Maps
        </Button>
        <p className="mt-4 text-sm leading-normal">
          {store.merchant.description && store.merchant.description}
        </p>
      </div>

      <div className="flex flex-col col-span-12 gap-8">
        <section>
          <h2>Campaigns</h2>
          <div className="flex flex-col gap-2">
            {store.campaigns.map((campaign) => {
              return (
                <Link
                  to={`/campaign/${campaign.id}`}
                  key={campaign.id + "record"}
                  className="flex items-center gap-4 mt-3"
                >
                  <RiGameFill className="text-xl leading-none text-orange-400" />

                  <div className="flex flex-col ">
                    <div className="font-medium leading-normal text-md">
                      {campaign.name}
                    </div>
                    <div className="mt-1 text-sm text-gray-600 truncate">
                      {campaign.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  ) : (
    <></>
  );
};
export default StoreDetail;
