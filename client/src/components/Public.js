//import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from 'react-helmet-async';

import React from 'react'
import "../css/login.css"
import Login from '../features/auth/Login';

const Public = () => {
    const content = (

        <body className="public">
        <HelmetProvider>
            <div className="logincontent">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>WarGame-HK</title>
                </Helmet>
                <Login />

                <main className="public_main">
                </main>
            </div>
        </HelmetProvider>
        </body>

    )
    return content
}
export default Public
