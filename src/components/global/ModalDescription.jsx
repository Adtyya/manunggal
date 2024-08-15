import ModalBase from "@/components/global/Modal";
import { X } from "react-bootstrap-icons";

export default function ModalDescription({
  open,
  setOpen,
  content,
  title = "deskripsi",
  isCustom = false,
}) {
  return (
    <ModalBase isOpen={open} closeModal={setOpen}>
      <div className="w-full max-w-lg rounded-lg bg-white p-3.5">
        <div className="w-full text-center relative">
          <p className="font-semibold text-lg capitalize">{title}</p>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2"
            onClick={setOpen}
          >
            <X className="text-2xl" />
          </button>
        </div>
        <div>
          {isCustom ? content : <p className="line-clamp-5">{content}</p>}
        </div>
      </div>
    </ModalBase>
  );
}
