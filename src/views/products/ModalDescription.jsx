import ModalBase from "@/components/global/Modal";
import { X } from "react-bootstrap-icons";

export default function ModalDescription({ open, setOpen, content }) {
  return (
    <ModalBase isOpen={open} closeModal={setOpen}>
      <div className="w-full max-w-md rounded-lg bg-white p-3.5">
        <div className="w-full text-center relative">
          <p className="font-semibold text-lg">Deskripsi</p>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2"
            onClick={setOpen}
          >
            <X className="text-2xl" />
          </button>
        </div>
        <div>
          <p>{content}</p>
        </div>
      </div>
    </ModalBase>
  );
}
