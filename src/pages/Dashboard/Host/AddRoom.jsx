import React, { useState } from "react";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import useAuth from "../../../hooks/useAuth";
import { imageUpload } from "../../../api/utils";
import { Helmet } from "react-helmet-async";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const AddRoom = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState();
  const [imageText, setImageText] = useState("Upload Image");
  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const handleDates = (item) => {
    // console.log(item.selection);
    setDates(item.selection);
  };

  const { mutateAsync } = useMutation({
    mutationFn: async (roomData) => {
      const {data} = await axiosSecure.post(`/room`, roomData)
      return data
    },
    onSuccess: () => {
      toast.success("Room data added successfully");
      navigate('/dashboard/my-listings')
      setLoading(false);
    }
  })

  const handleSubmit = async (e) => {
    setLoading(true);
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
      // console.log(image_url);

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
      await mutateAsync(roomData)

    } catch (error) {
      // console.log(error.message)
      toast.error("Failed to add room data");
      setLoading(false);
    }
    
  };

    // Handle image change
    const handleImage = image => {
        setImagePreview(URL.createObjectURL(image));
        setImageText(image.name)
    }

  return (
    <div>
      <Helmet>
        <title>Add Room | Dashboard</title>
      </Helmet>
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
