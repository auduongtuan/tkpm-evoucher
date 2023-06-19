import useRecord from "ui/hooks/useRecord";
import { getStore } from "api-client";
import { RiGameFill } from "react-icons/ri";
import { Breadcrumb, Button, Empty } from "antd";
import { Description, Link } from "ui";
import SectionTitle from "@/components/SectionTitle";
const StoreDetail = () => {
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
        <Description label={"Address"} className="mt-4">
          <div className="text-base leading-normal">{store.address}</div>
        </Description>
        <Description label={"Categories"} className="mt-4">
          <div className="text-base ">
            {store.categories.reduce<React.ReactNode[]>((acc, category, i) => {
              acc.push(
                <Link
                  to={`/stores/category/${category.id}`}
                  className="underline underline-offset-4 decoration-gray-200"
                  key={"category-tag" + category.id}
                >
                  {category.name}
                </Link>
              );
              if (i < store.categories.length - 1) {
                acc.push(", ");
              }
              return acc;
            }, [])}
          </div>
        </Description>
        <Button
          href={`http://www.google.com/maps/place/${store.lat},${store.lng}`}
          key={store.id + "record"}
          className="flex flex-col mt-4 no-underline"
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
          <SectionTitle title={"Campaigns"} />
          <div className="flex flex-col gap-2">
            {store.campaigns.length > 0 ? (
              store.campaigns.map((campaign) => {
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
              <Empty description="No campaigns found" />
            )}
          </div>
        </section>
      </div>
    </div>
  ) : (
    <></>
  );
};
export default StoreDetail;
