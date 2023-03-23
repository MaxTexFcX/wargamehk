import { useGetGamesQuery } from "./gameApiSlice";
import "../../css/game.css"
import Game from "./Game"
//import { LINK } from "react-router-dom"

const GamesList = () => {

    const {
        data: game,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetGamesQuery(null,{
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <p>Loading.....</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {

        const { ids } = game

        const tableContent = ids?.length
            ? ids.map(gameId => <Game key={gameId} gameId={gameId} />)
            : null

        content = (
            <div className="displayGameList_content">
                <div className="displayGameList_subcontent">
                    <div className="displayGameList_navtext">
                    <p>尋找戰局</p>
                    </div>
                <div className="displayGameList_btnlist">
                    <button type="button" className="btn btn-primary">建立戰區</button>
                    </div>
                </div>
                <div className="displayGameList_div">
                    {tableContent}
                </div>
            </div>
        )
    }

    return content
}

export default GamesList