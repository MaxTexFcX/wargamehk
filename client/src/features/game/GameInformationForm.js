import moment from "moment" 
const GameInformationForm = ({ game }) => {

    const date = game.date
    const dateObj = new Date(date)
    const showdate= moment(dateObj).format('DD-MM-YYYY');

    const countInGamePeople = game.joined.length

    const content = (
        <>
            <p>{game.title}</p>
            <p>日期: &nbsp;{showdate}</p>
            <p>地點: &nbsp;{game.location}</p>
            <p>人數: &nbsp;{countInGamePeople}/{game.maxpeople}</p>

        </>

    )
    return content

}

export default GameInformationForm