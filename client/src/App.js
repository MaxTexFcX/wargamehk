import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import NotesList from './features/notes/NotesList'
import UserList from './features/users/UserList'
import EditUser from './features/users/EditUser'
import NewUserForm from './features/users/NewUserForm'
import EditNote from './features/notes/EditNote'
import NewNote from './features/notes/NewNote'
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'
import Register from './features/users/Register'
import GamesList from './features/game/GameList'
import GameInformation from './features/game/GameInformation'
import Selecttimer from './features/timer/Selecttimer'


function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route index element={<Public />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />


                {/* Protected Routes */}
                <Route element={<PersistLogin />}>
                    <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
                        <Route element={<Prefetch />}>

                            <Route path="dash" element={<DashLayout />}>

                                <Route index element={<Welcome />} />

                                <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                                    <Route path="users">
                                        <Route index element={<UserList />} />
                                        <Route path=':id' element={<EditUser />} />
                                        <Route path='new' element={<NewUserForm />} />
                                    </Route>
                                </Route>

                                <Route path="games">
                                    <Route index element={<GamesList />} />
                                    <Route path=':id' element={<GameInformation />} />
                                </Route>


                                <Route path="notes">
                                    <Route index element={<NotesList />} />
                                    <Route path=':id' element={<EditNote />} />
                                    <Route path='new' element={<NewNote />} />
                                </Route>

                                <Route path="timer">
                                    <Route index element={<Selecttimer />} />
                                </Route>

                            </Route> {/* End Dash */}
                        </Route>
                    </Route>
                </Route>{/* End Protected Routes */}
            </Route>
        </Routes >
    );
}

export default App;