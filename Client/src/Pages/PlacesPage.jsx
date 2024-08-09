import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import AccountNav from "../AccountNav";
import axios from "axios";

function PlacesPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      console.log(data);
      setPlaces(data);
    });
  }, []);
  const { action } = useParams();
  return (
    <div>
      <AccountNav />

      <div className="text-center mt-2">
        <Link
          className="bg-primary inline-flex text-white py-2 gap-1 px-6 rounded-full"
          to={"/account/places/new"}
        >
          <FaPlus className="mt-1" />
          Add new place
        </Link>
      </div>
      <div>
        {places.length > 0 &&
          places.map((place) => {
            return (
              <Link
                to={`/account/places/` + place._id}
                className="bg-gray-100 gap-4 flex p-4 rounded-2xl"
                key={place._id}
              >
                <div className=" bg-gray-300 flex h-32 w-40 ">
                  {place.photos.length > 0 && (
                    <img
                      className="object-cover "
                      src={"http://localhost:4000/uploads/" + place.photos[1]}
                      alt=""
                    />
                  )}
                </div>
                <div className="grow-0 shrink">
                  <h2 className="text-xl">{place.title}</h2>
                  <p className="text-sm mt-2">{place.description}</p>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

export default PlacesPage;
