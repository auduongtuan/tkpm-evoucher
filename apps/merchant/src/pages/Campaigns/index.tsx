import RecordList from "ui/admin-components/RecordList";
import { deleteCampaign, getMerchantCampaigns } from "api-client";
import { Campaign } from "database";
import { Outlet } from "react-router-dom";
import { Store } from "antd/es/form/interface";
import useAdminStore from "ui/hooks/useAdminStore";

const Campaigns = () => {
  const merchantId = useAdminStore(
    (state) => state.employee?.merchantId
  ) as number;
  return (
    <>
      <Outlet />
      <RecordList<Campaign>
        name="campaign"
        getFn={async () => getMerchantCampaigns(merchantId)}
        deleteFn={deleteCampaign}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
          },

          {
            title: "Number of stores applied",
            dataIndex: "stores",
            key: "stores_length",
            render: (stores: Store) => (stores ? stores.length : 0),
          },
        ]}
      />
    </>
  );
};
export default Campaigns;
