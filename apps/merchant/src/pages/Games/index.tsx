import { deleteGame, getGame, getGames } from "api-client";
import RecordList from "ui/admin-components/RecordList";
import { Game, Employee, Store } from "database";
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
            title: "Slug",
            dataIndex: "slug",
          },
          {
            title: "Average Score",
            dataIndex: "averageScore",
          },
        ]}
      />
      <Outlet />
    </>
  );
};
export default Games;
