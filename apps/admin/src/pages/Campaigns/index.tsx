import RecordList from "ui/admin-components/RecordList";
import { getCampaigns, deleteCampaign } from "api-client";
import { Campaign, Merchant } from "database";
import { Outlet } from "react-router-dom";
import { Store } from "antd/es/form/interface";

const Campaigns = () => {
  return (
    <>
      <Outlet />
      <RecordList<Campaign>
        name="campaign"
        getFn={getCampaigns}
        deleteFn={deleteCampaign}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Merchant",
            key: "merchant",
            dataIndex: "merchant",
            render: (merchant: Merchant) => merchant.name,
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
