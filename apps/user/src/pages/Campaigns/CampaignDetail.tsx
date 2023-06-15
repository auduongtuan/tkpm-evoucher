import Link from "@/components/Link";
import useRecord from "@/hooks/useRecord";
import { getCampaign } from "api-client";
import pluralize from "pluralize-esm";
import { RiStore2Fill } from "react-icons/ri";
import dayjs from "dayjs";
import { Breadcrumb, Button } from "antd";
import Description from "@/components/Description";
import { PlayCircleFilled } from "@ant-design/icons";
import GameModal from "@/games/GameModal";
import useGameStore from "@/games/useGameStore";
const CampaignDetail = () => {
  // const { modalProps, closeModal } = useRouteModal("/campaigns");
  // const [form] = Form.useForm();
  // const { formModalProps } = useCrud({
  //   name: "campaign",
  //   getFn: getCampaign,
  //   onGetSuccess: (data) => {
  //     form.setFieldsValue({ ...data });
  //   },
  //   updateFn: updateCampaign,
  //   createFn: createCampaign,
  //   closeModal: closeModal,
  //   form: form,
  // });
  const { id, recordQuery } = useRecord({
    name: "campaign",
    getFn: getCampaign,
  });
  const campaign = recordQuery?.data;
  const openGameModal = useGameStore((state) => state.openModal);
  return !recordQuery?.isLoading && campaign ? (
    <div className="grid grid-cols-12 gap-6 p-4 bg-white rounded-xl">
      <GameModal />
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
              <Link to={`/merchant/${campaign.merchant.id}`} noStyle>
                {campaign.merchant.name}
              </Link>
            ),
          },
          {
            title: campaign.name,
          },
        ]}
      />
      <div className="col-span-12 md:col-span-7">
        {campaign.image && (
          <img
            src={campaign.image}
            className="max-w-full aspect-[4/3] object-cover rounded-md"
            alt={campaign.name}
          />
        )}
      </div>
      <div className="col-span-12 mt-2 md:col-span-5">
        <div className="col-span-12 text-2xl">{campaign.name}</div>
        <div className="mt-2 text-sm text-gray-600">
          By{" "}
          <Link to={`/merchant/${campaign.merchant.id}`}>
            {campaign.merchant.name}
          </Link>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {campaign.stores.length} {pluralize("store", campaign.stores.length)}{" "}
          applied
        </div>

        <p className="mt-4 leading-normal text-md">
          {campaign.description && campaign.description}
        </p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Description label="Games" className="col-span-2">
            {campaign.games.map((game) => game.name).join(", ")}
          </Description>
          <Description label="Started at">
            {dayjs(campaign.startedAt).format("DD/MM/YYYY")}
          </Description>
          <Description label="Ended at">
            {dayjs(campaign.endedAt).format("DD/MM/YYYY")}
          </Description>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlayCircleFilled />}
          onClick={() => openGameModal()}
        >
          Play now
        </Button>
      </div>
      <div className="flex flex-col col-span-12 gap-8">
        <section>
          <h2>Store applied</h2>
          <div className="flex flex-col gap-2">
            {campaign.stores.map((store) => {
              return (
                <div
                  key={store.id + "record"}
                  className="flex items-center gap-4 mt-3"
                >
                  <RiStore2Fill className="text-xl leading-none text-gray-600" />

                  <div className="flex flex-col ">
                    <div className="font-medium leading-normal text-md">
                      {store.name}
                    </div>
                    <div className="mt-1 text-sm text-gray-600 truncate">
                      {store.address}
                    </div>
                  </div>
                </div>
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
export default CampaignDetail;
