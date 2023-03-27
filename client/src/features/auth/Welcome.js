import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { io } from "socket.io-client";
import { useState } from "react";

const Welcome = () => {

    const socket = io('http://localhost:5000', {
        reconnectionAttempts: 5, // Limit the number of reconnection attempts
        reconnectionDelay: 3000,  // Wait 3000ms before attempting to reconnect
    });

    //var socket = io('http://localhost:5000');

    const { username, isManager, isAdmin } = useAuth()
    const [data1, setData1] = useState("123")
    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    socket.on('data', function(data) {
        console.log(data);
        setData1(data)
    });

    const content = (

        <section className="welcome">

            <p>{today}</p>

            <h1>Welcome {username}!</h1>

            <p><Link to="/">Go back home {data1}</Link></p>

            <p><Link to="/dash/notes/new">Add New techNotes</Link></p>

            {(isManager || isAdmin) && <p><Link to="/dash/users">View User Settings</Link></p>}

            {(isManager || isAdmin) && <p><Link to="/dash/users/new">Add New User</Link></p>}

        </section>
    )

    return content
}

export default Welcome
