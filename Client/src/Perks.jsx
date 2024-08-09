import React from "react";
import { FaWifi } from "react-icons/fa";
import { FaCar } from "react-icons/fa";
import { PiTelevisionSimpleBold } from "react-icons/pi";
import { FaDog } from "react-icons/fa";
import { GiCryptEntrance } from "react-icons/gi";
import { FaRadio } from "react-icons/fa6";

function Perks({ selected, onChange }) {
  function handleCbClick(ev) {
    const { checked, name } = ev.target;
    if (checked) {
      onChange([...selected, name]);
    } else {
      onChange([...selected.filter((selectedName) => selectedName)]);
    }
  }
  return (
    <div>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer ">
        <input
          type="checkbox"
          checked={selected.includes("wifi")}
          name="wifi"
          onChange={handleCbClick}
        />
        <FaWifi />
        <span>Wifi</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer ">
        <input
          type="checkbox"
          checked={selected.includes("Free parking spot")}
          name="Free parking spot"
          onChange={handleCbClick}
        />
        <FaCar />
        <span>Free parking spot</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
        <input
          type="checkbox"
          checked={selected.includes("Tv")}
          name="Tv"
          onChange={handleCbClick}
        />
        <PiTelevisionSimpleBold />
        <span>TV</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer ">
        <input
          type="checkbox"
          checked={selected.includes("radio")}
          name="radio"
          onChange={handleCbClick}
        />
        <FaRadio />
        <span>Radio</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer ">
        <input
          type="checkbox"
          checked={selected.includes("pets")}
          name="pets"
          onChange={handleCbClick}
        />
        <FaDog />
        <span>Pets</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
        <input
          type="checkbox"
          checked={selected.includes("private entrance")}
          name="private entrance"
          onChange={handleCbClick}
        />
        <GiCryptEntrance />
        <span>Private entrance</span>
      </label>
    </div>
  );
}

export default Perks;
