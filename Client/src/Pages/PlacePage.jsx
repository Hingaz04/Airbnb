import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    axios
      .get(`/places/${id}`)
      .then((response) => {
        setPlace(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the place data:", error);
      });
  }, [id]);

  if (!place) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <a
        className="block font-semibold underline my-2 "
        target="_blank"
        href={"https://maps.google.com/?q" + place.address}
      >
        {place.address}
      </a>
      <div className="grid gap-2 grid-cols-[2fr_1fr]">
        <div>
          {place.photos?.[0] && (
            <img
              className="object-cover aspect-square"
              src={"http://localhost:4000/uploads/" + place.photos?.[0]}
              alt=""
            />
          )}
        </div>
        <div className="grid gap-2">
          {place.photos?.[0] && (
            <img
              className="object-cover aspect-square"
              src={"http://localhost:4000/uploads/" + place.photos?.[0]}
              alt=""
            />
          )}
          {place.photos?.[1] && (
            <img
              className="object-cover aspect-square"
              src={"http://localhost:4000/uploads/" + place.photos?.[1]}
              alt=""
            />
          )}
        </div>
      </div>
      <div className="my-4">
        {" "}
        <h2 className="font-semibold text-2xl">Description</h2>
        {place.description}
      </div>
      <div className="grid grid-cols-2">
        <div>
          Check-in:
          {place.checkIn}
          <br />
          Check-out:
          {place.checkOut}
          <br />
          Max number of guests:{place.maxGuests}
          <br />
        </div>
        <div className="bg-gray-300 p-4 rounded-2xl">
          <div className="text-2xl text-center">
            Price: ${place.price} / per night
          </div>
          <div className="my-4 bg-gray-100 py-4 px-4 rounded-2xl">
            <label>Check In: </label>
            <input type="date" />
          </div>
          <div className="my-4 bg-gray-100 py-4 px-4 rounded-2xl">
            <label>Check Out: </label>
            <input type="date" />
          </div>
          <button className="primary">Book this place</button>
        </div>
      </div>
    </div>
  );
}

export default PlacePage;
