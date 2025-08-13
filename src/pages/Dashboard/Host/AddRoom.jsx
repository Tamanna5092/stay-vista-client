import React, { useState } from "react";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import useAuth from "../../../hooks/useAuth";
import { imageUpload } from "../../../api/utils";

const AddRoom = () => {
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState();
  const [imageText, setImageText] = useState("Upload Image");
  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: null,
    key: "selection",
  });

  const handleDates = (item) => {
    console.log(item.selection);
    setDates(item.selection);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const location = form.location.value;
    const category = form.category.value;
    const title = form.title.value;
    const image = form.image.files[0];
    const from = dates.startDate;
    const to = dates.endDate;
    const price = form.price.value;
    const total_guest = form.total_guest.value;
    const bedrooms = form.bedrooms.value;
    const bathrooms = form.bathrooms.value;
    const description = form.description.value;
    const host = {
      name: user?.displayName,
      email: user?.email,
      photoURL: user?.photoURL,
    };

    try {
      const image_url = await imageUpload(image);
      console.log(image_url);

      const roomData = {
        location,
        category,
        title,
        image: image_url,
        from,
        to,
        price: parseFloat(price),
        total_guest: parseInt(total_guest, 10),
        bedrooms: parseInt(bedrooms, 10),
        bathrooms: parseInt(bathrooms, 10),
        description,
        host,
      };
      console.table(roomData);
    } catch (error) {}
    console.log(error)
  };

    // Handle image change
    const handleImage = image => {
        setImagePreview(URL.createObjectURL(image));
        setImageText(image.name)
    }

  return (
    <div>
      <AddRoomForm
        dates={dates}
        handleDates={handleDates}
        handleSubmit={handleSubmit}
        imagePreview={imagePreview}
        handleImage={handleImage}
        imageText={imageText}
      />
    </div>
  );
};

export default AddRoom;
