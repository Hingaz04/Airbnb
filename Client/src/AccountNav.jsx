import React from "react";
import { CgProfile } from "react-icons/cg";
import { CiBoxList } from "react-icons/ci";
import { FaBuilding } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function AccountNav() {
  const { pathname } = useLocation();
  let subpage = pathname.split("/")?.[2];
  if (!subpage) {
    subpage = "profile";
  }

  function linkClasses(type) {
    let classes = "inline-flex gap-1 py-2 px-6 rounded-full";
    if (subpage === type) {
      classes += " bg-primary text-white";
    } else {
      classes += " bg-gray-200";
    }
    return classes;
  }
  return (
    <nav className="w-full flex mt-4 gap-2 justify-center">
      <Link className={linkClasses("profile")} to="/account">
        <CgProfile className="mt-1 " />
        My Profile
      </Link>
      <Link className={linkClasses("bookings")} to="/account/bookings">
        <CiBoxList className="mt-1 " />
        My bookings
      </Link>
      <Link className={linkClasses("places")} to="/account/places">
        <FaBuilding className="mt-1 " />
        My accommodations
      </Link>
    </nav>
  );
}

export default AccountNav;
