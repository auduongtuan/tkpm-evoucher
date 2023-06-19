import { Link } from "ui";
import useRecord from "ui/hooks/useRecord";
import { getFullMerchant } from "api-client";
import pluralize from "pluralize-esm";
import { RiGameFill, RiStore2Fill } from "react-icons/ri";
import { Breadcrumb, Empty } from "antd";
import ThumbnailImage from "ui/components/ThumbnailImage";
import SectionTitle from "@/components/SectionTitle";
import CategoryLinks from "ui/components/CategoryLinks";
import { Category } from "database";
const MerchantDetail = () => {
  // const { modalProps, closeModal } = useRouteModal("/merchants");
  // const [form] = Form.useForm();
  // const { formModalProps } = useCrud({
  //   name: "merchant",
  //   getFn: getMerchant,
  //   onGetSuccess: (data) => {
  //     form.setFieldsValue({ ...data });
  //   },
  //   updateFn: updateMerchant,
  //   createFn: createMerchant,
  //   closeModal: closeModal,
  //   form: form,
  // });
  const { id, recordQuery } = useRecord({
    name: "merchant",
    getFn: getFullMerchant,
  });
  const merchant = recordQuery?.data;
  return !recordQuery?.isLoading && merchant ? (
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
            title: merchant.name,
          },
        ]}
      />
      <div className="col-span-12 md:col-span-7">
        <ThumbnailImage src={merchant.image} alt={merchant.name} />
      </div>
      <div className="col-span-12 mt-2 md:col-span-5">
        <div className="col-span-12 text-2xl">{merchant.name}</div>
        <div className="text-gray-600">
          {merchant.stores.length} {pluralize("store", merchant.stores.length)}
        </div>
        <div className="mt-4 text-gray-600 text-md">
          <CategoryLinks
            categories={[
              ...merchant.stores.reduce<Set<Category>>((acc, curr) => {
                curr.categories.forEach((category) => acc.add(category));
                return acc;
              }, new Set<Category>()),
            ]}
          />
        </div>
        <p className="mt-4 text-sm leading-normal">
          {merchant.description && merchant.description}
        </p>
      </div>
      <div className="flex flex-col col-span-12 gap-8">
        <section>
          <SectionTitle title={"Campaigns"} />
          <div className="flex flex-col gap-2">
            {merchant.campaigns.length > 0 ? (
              merchant.campaigns.map((campaign) => {
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
              })
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_DEFAULT}
                description="No campaigns yet"
              ></Empty>
            )}
          </div>
        </section>
        <section>
          <SectionTitle title={"Stores"} />
          <div className="flex flex-col gap-2">
            {merchant.stores.length > 0 ? (
              merchant.stores.map((store) => {
                return (
                  <Link
                    to={`/store/${store.id}`}
                    key={store.id + "record"}
                    className="flex items-center gap-4 mt-3"
                  >
                    <RiStore2Fill className="text-xl leading-none text-blue-600" />

                    <div className="flex flex-col ">
                      <div className="font-medium leading-normal text-md">
                        {store.name}
                      </div>
                      <div className="mt-1 text-sm text-gray-600 truncate">
                        {store.address}
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_DEFAULT}
                description="No stores yet"
              ></Empty>
            )}
          </div>
        </section>
      </div>
    </div>
  ) : (
    <></>
  );
};
export default MerchantDetail;
