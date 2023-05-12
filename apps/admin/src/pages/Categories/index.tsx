import { deleteGame, getGame, getGames } from "@/api-client";
import RecordList from "@/components/RecordList";
import { Game, Campaign } from "database";
import { Outlet } from "react-router-dom";
const Games = () => {
  return (
    <>
      <RecordList<Game>
        name="game"
        getFn={getGames}
        deleteFn={deleteGame}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
          },
          {
            title: "Number of stores",
            dataIndex: "campaigns",
            width: "25%",
            render: (campaigns: Campaign[]) =>
              campaigns ? campaigns.length : 0,
          },
        ]}
      />
      <Outlet />
    </>
  );
};
export default Games;
