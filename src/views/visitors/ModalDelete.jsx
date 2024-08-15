import ModalBase from "@/components/global/Modal";
import { Button } from "@/components/reactdash-ui";
import useVisitor from "./hook/useVisitors";
import { deleteVisitorsById } from "./service";
import { useState } from "react";
import { useQueryClient } from "react-query";

export default function ModalDelete({ open, setOpen, selected }) {
  const visitor = useVisitor();
  const client = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteVisitorsById(selected);
      visitor.setDelete(true);
      client.invalidateQueries("visitors");
    } catch (error) {
      console.warn("Something went wrong");
    } finally {
      visitor.setModalDelete(false);
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={open} closeModal={setOpen}>
      <div className="bg-white w-full max-w-md flex flex-col items-center justify-center p-3.5 rounded-lg">
        <p className="font-semibold text-lg">
          Anda yakin ingin menghapus data ini ?
        </p>
        <div className="pb-2.5" />
        <div className="flex justify-center items-center w-full space-x-5 my-2.5">
          <Button
            color="outline-gold"
            onClick={() => visitor.setModalDelete(false)}
          >
            Tidak
          </Button>
          <Button
            color="gold"
            onClick={() => handleDelete()}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Ya"}
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}
