import Merchants from "./Merchants";
import Stores from "./Stores";
import Campaigns from "./Campaigns";

const Home = () => {
  // const queryFns = {
  //   merchant: getMerchants,
  //   store: getStores,
  //   category: getCategories,
  //   game: getGames,
  //   campaign: getCampaigns,
  //   user: getUsers,
  //   voucher: getVouchers,
  // };
  // const statistics: {[key: keyof typeof queryFns]: } = Object.keys(queryFns).reduce((acc, recordType) => {
  //   acc[recordType] = useQuery({
  //     queryKey: [recordType, "list"],
  //     queryFn: queryFns[recordType],
  //   });
  //   return acc;
  // }, {});

  return (
    <div className="flex flex-col gap-4">
      <Merchants />
      <Stores />
      <Campaigns />
    </div>
  );
};
export default Home;
