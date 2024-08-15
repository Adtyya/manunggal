import { useState } from "react";
import { Camera } from "react-bootstrap-icons";

export default function ProfileWidgetCustom(props) {
  const profile = {
    img: "/img/avatar/avatar.png",
  };

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file instanceof Blob) {
      const previewURL = URL.createObjectURL(file);
      setSelectedImage(Object.assign(file, { preview: previewURL }));
      props.state([Object.assign(file, { preview: previewURL })]);
    }
  };

  const currentImage =
    props.currentImage && props.currentImage !== "undefined"
      ? props.currentImage
      : profile.img;

  return (
    <div className="h-max mb-4">
      <div className="flex justify-center relative">
        <label htmlFor="upload-avatar" className="z-30 group cursor-pointer">
          <img
            src={selectedImage?.preview || currentImage}
            alt="profile-picture"
            className="rounded-full w-24 h-24 bg-gray-200 border-solid border-white shadow border-2 object-contain"
          />
          {!props.readOnly ? (
            <>
              <div className="absolute w-24 h-24 bg-transparent group-hover:bg-black/30 top-0 rounded-full duration-200 ease-out"></div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white dark:text-gray-900">
                <Camera className="w-6 h-6" />
              </div>
            </>
          ) : null}
        </label>
        {!props.readOnly ? (
          <input
            type="file"
            id="upload-avatar"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        ) : null}
      </div>
    </div>
  );
}
