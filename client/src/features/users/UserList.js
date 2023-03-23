import { useGetUsersQuery } from "./userApiSlice"
import "../../css/userlist.css"
import User from "./User"
import { Link } from "react-router-dom"


const UsersList = () => {

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery(null, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {

    const { ids } = users

    const tableContent = ids?.length
      ? ids.map(userId => <User key={userId} userId={userId} />)
      : null

    content = (
      <div className="Userlist__Title">
        <p><Link to="/dash">儀表板</Link> {'>'} 用戶名單</p>
        <Link to="/dash/users/new"><button type="button" className="btn btn-success">新增用戶</button></Link>
        <div className="userlisttable">
          <table className="table">
            <thead className="table__display">
              <tr>
                <th scope="col" className="table__th user_username">Username</th>
                <th scope="col" className="table__th user_email">Email</th>
                <th scope="col" className="table__th user_phonenumber">Phone</th>
                <th scope="col" className="table__th user_roles">Roles</th>
                <th scope="col" className="table__th user_edit">Edit</th>
              </tr>
            </thead>
            <tbody>
              {tableContent}
            </tbody>
          </table>
        </div>
      </div>

    )
  }

  return content
}

export default UsersList
