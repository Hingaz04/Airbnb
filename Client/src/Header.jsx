import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaAirbnb } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { GiHamburgerMenu } from "react-icons/gi";
import { CiUser } from "react-icons/ci";
import { UserContext } from "./UserContext";

function Header() {
  const { user } = useContext(UserContext);
  return (
    <header className=" flex justify-between">
      <Link to="/" className="flex items-center gap-1 ">
        <FaAirbnb className="w-8 h-8" />{" "}
        <span className="font-bold text-xl ">Airbnb</span>
      </Link>
      <div className="flex gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300">
        <div>Anywhere</div>
        <div className="border-l border-gray-300"></div>
        <div>Any week</div>
        <div className="border-l border-gray-300"></div>
        <div>Add guests</div>
        <button className="bg-primary text-white p-2 rounded-full">
          <CiSearch className="w-4 h-4" />
        </button>
      </div>
      <Link
        to={user ? "/account" : "/login"}
        className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4"
      >
        <GiHamburgerMenu />
        <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
          <CiUser />
        </div>
        {!!user && <div>{user.name}</div>}
      </Link>
    </header>
  );
}

export default Header;
