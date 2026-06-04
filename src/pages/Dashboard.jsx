import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <h1>Dashboard</h1>
      <p>{user?.email}</p>
    </>
  );
}

export default Dashboard;
