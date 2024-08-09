import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

function ProfilePage() {
  const { user, ready, setUser } = useContext(UserContext);
  const { subpage } = useParams();
  const [redirect, setRedirect] = useState(null);

  async function logout() {
    await axios.post("/logout");

    setRedirect("/");
    setUser(null);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  if (!ready) {
    return "Loading....";
  }
  if (ready && !user && !redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <AccountNav />
      {(!subpage || subpage === "profile") && (
        <div className="text-center max-w-lg mx-auto mt-4">
          Logged in as {user.name} ({user.email})
          <button onClick={logout} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}
      {subpage === "places" && <PlacesPage />}
    </div>
  );
}

export default ProfilePage;
