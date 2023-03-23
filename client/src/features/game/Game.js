import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectGameById } from "./gameApiSlice";
import "../../css/navbarV.css"
import "../../css/game.css"
import LZ from "../../global/LZ.jpeg"
import { useUpdateGameUserMutation, useUpdateLeaveGameMutation } from "./gameApiSlice";
import useAuth from "../../hooks/useAuth"
import { useEffect} from "react";
import moment from "moment" 

const Game = ({ gameId }) => {
    const game = useSelector(state => selectGameById(state, gameId))

    let isJoined = false
    let isFull = false

    const { username } = useAuth()

    const navigate = useNavigate()

    const [addGameUser, {
        isSuccess,
        isError,
        error
    }] = useUpdateGameUserMutation()

    const [removeGameUser, {
        isSuccess: isRemoveSuccess,
        isError: isRemoveError,
        error: RemoveError
    }] = useUpdateLeaveGameMutation()

    useEffect(() => {
        if (isSuccess) {
            navigate(`/dash/games/${gameId}`)
            navigate(`/dash/games/`)
        }

    }, [isSuccess, navigate, gameId])

    useEffect(() => {
        if (isRemoveSuccess) {
            console.log("Remove success")
        }
    }, [isRemoveSuccess])

    if (game) {
        const handleEdit = () => navigate(`/dash/games/${gameId}`);
        
        
        const JoinGame = async (e) => {
            e.preventDefault()
            await addGameUser({ id: game.id, player: username })
            window.location.reload(true)
        }

        const LeaveGame = async (e) => {
            e.preventDefault()
            await removeGameUser({ id: game.id, player: username })
            window.location.reload(true)
        }

        const gameGamemodeString = game.gamemode.join(', ');

        const setMaxpeople =  parseInt(game.maxpeople, 10)

        
        const date = game.date
        const dateObj = new Date(date)
        const showdate= moment(dateObj).format('DD-MM-YYYY');

        const countInGamePeople = game.joined.length

        for (let i=0 ; i < countInGamePeople ; i++) {
            if(game.joined[i] === username){
                isJoined = true
            }
        }

        if(countInGamePeople >= setMaxpeople){
            isFull = true
        }

        const errContent = (error?.data?.message || RemoveError?.data?.message) ?? ''

        return (

            <div className="card">
                {
                    (isError || isRemoveError) &&
                    <div className="alert alert-primary" role="alert">
                        {errContent}
                    </div>
                }
                <img src={LZ} className="card-img-top" alt="IMG" />
                <div className="card-body">
                    <div className="title__div">
                        <p className="card-title game_title">{game.title}</p>
                    </div>
                    <div className="information__div">
                        <p></p>
                        <p className="card-text information">日期: &nbsp;{showdate}</p>
                        <p className="card-text information">地點: &nbsp;{game.location}</p>
                        <p className="card-text information">模式: &nbsp;{gameGamemodeString}</p>
                        <p className="card-text information">人數: &nbsp;{countInGamePeople}/{game.maxpeople}</p>
                    </div>
                    <div className="game__button">
                        <button type="button" className="btn btn-primary getinfo_btn" onClick={handleEdit}>詳細資料</button>
                        {
                            (!isJoined && !isFull) &&
                            <button type="button" className="btn btn-success getinfo_join" onClick={JoinGame}>加入</button>
                        }
                        {
                            (isJoined) &&
                            <button type="button" className="btn btn-warning getinfo_join" onClick={LeaveGame}>退&nbsp;出</button>
                        }
                    </div>
                </div>
            </div>
        );
    } else return console.log(gameId);
};

export default Game;