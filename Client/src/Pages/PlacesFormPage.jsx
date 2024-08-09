import React, { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa6";
import Perks from "../Perks";
import axios from "axios";
import AccountNav from "../AccountNav";
import { FaRegTrashAlt } from "react-icons/fa";
import { Navigate, useParams } from "react-router-dom";

function PlacesFormPage() {
  const { _id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [price, setPrice] = useState(100);
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!_id) {
      return;
    }

    axios
      .get(`/places/${_id}`)
      .then((response) => {
        const { data } = response;
        if (!data) {
          console.error("No place found with the given ID");
          return;
        }
        setTitle(data.title);
        setAddress(data.address);
        setAddedPhotos(data.photos);
        setDescription(data.description);
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
      })
      .catch((error) => {
        console.error("Error fetching place data:", error);
      });
  }, [_id]);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function addPhotoByLink(ev) {
    ev.preventDefault();
    const { data: filename } = await axios.post("/upload-by-link", {
      link: photoLink,
    });
    setAddedPhotos((prev) => [...prev, filename]);
    setPhotoLink("");
  }

  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    axios
      .post("http://localhost:4000/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const filenames = response.data;
        setAddedPhotos((prev) => [...prev, ...filenames]);
      })
      .catch((error) => {
        console.error("Error uploading photos:", error);
      });
  }

  async function savePlace(ev) {
    ev.preventDefault();
    if (_id) {
      await axios.put("/places", {
        _id,
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      setRedirect(true);
    } else {
      await axios.post("/places", {
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  function removePhoto(filename) {
    setAddedPhotos((prevPhotos) =>
      prevPhotos.filter((photo) => photo !== filename)
    );
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput("Title", "Title for your place")}
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="Title, eg: My Lovely Apartment"
        />
        {preInput("Address", "Address to your place")}
        <input
          type="text"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="Address"
        />
        {preInput("Photos", "The more the better")}
        <div className="flex gap-2">
          <input
            type="text"
            value={photoLink}
            onChange={(ev) => setPhotoLink(ev.target.value)}
            placeholder={"Add using a link.....jpg"}
          />
          <button
            onClick={addPhotoByLink}
            className="bg-gray-200 px-4 rounded-2xl"
          >
            Add Photo
          </button>
        </div>

        <div className="gap-2 mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {addedPhotos.length > 0 &&
            addedPhotos.map((link, index) => (
              <div key={index} className="h-32 flex relative">
                <img
                  className="rounded-2xl w-full object-cover"
                  src={"http://localhost:4000/uploads/" + link}
                  alt=""
                />
                <button
                  onClick={() => removePhoto(link)}
                  className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3"
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            ))}

          <label className="flex h-32 gap-2 cursor-pointer justify-center items-center border bg-transparent rounded-2xl p-8 text-2x text-gray-500">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={uploadPhoto}
            />
            Upload <FaUpload />
          </label>
        </div>
        {preInput("Description", "Description of the place")}
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        ></textarea>
        {preInput("Perks", "Select all the perks of the place")}
        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks} />
        </div>
        {preInput("Extra info", "House rules, etc")}
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        ></textarea>
        {preInput(
          "Check in & out times",
          "Add the check in and out times, remember to have some time window for cleaning the room between guests"
        )}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check in time</h3>
            <input
              type="text"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              placeholder="00:00"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check out time</h3>
            <input
              type="text"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              placeholder="17:00"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input
              type="text"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input
              type="text"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
            />
          </div>
        </div>
        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
}

export default PlacesFormPage;
