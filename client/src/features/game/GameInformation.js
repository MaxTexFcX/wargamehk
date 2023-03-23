import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { selectGameById } from "./gameApiSlice"
import GameInformationForm from "./GameInformationForm"


const GameInformation = () => {

    const { id } = useParams()

    const game = useSelector(state => selectGameById(state, id))

    const content = game ? <GameInformationForm game={game} /> : <p>Loading....</p>

   return content
}

export default GameInformation

