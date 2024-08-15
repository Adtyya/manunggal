import { Trash } from "react-bootstrap-icons";

export default function PreviewImage(props) {
  const handleChangeInput = () => {
    props.setNewImage(true);
  };

  return (
    <>
      <p>Current Image</p>
      <div className="border border-gray-300 rounded-lg mt-3 flex justify-center group relative overflow-hidden">
        <img
          src={props.currentImage}
          width={300}
          height={150}
          className="object-contain"
        />
        <button
          className="absolute bottom-3 right-3 p-1 rounded bg-primary-color text-white"
          title="delete"
          onClick={handleChangeInput}
          type="button"
        >
          <Trash />
        </button>
      </div>
    </>
  );
}
