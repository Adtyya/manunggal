import ModalBase from "@/components/global/Modal";
import { Button } from "@/components/reactdash-ui";
import usePendingVisitor from "./hook/usePendingVisitors";
import { followUpPendingVisitorsById } from "./service";
import { useState } from "react";
import { useQueryClient } from "react-query";

export default function ModalFollowUp({ open, setOpen, selected }) {
  const pendingVisitor = usePendingVisitor();
  const client = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleFollowUp = async () => {
    try {
      setLoading(true);
      await followUpPendingVisitorsById(selected);
      pendingVisitor.setFollowUp(true);
      client.invalidateQueries("pendingVisitors");
    } catch (error) {
      console.warn("Something went wrong");
    } finally {
      pendingVisitor.setModalFollowUp(false);
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={open} closeModal={setOpen}>
      <div className="bg-white w-full max-w-md flex flex-col items-center justify-center p-3.5 rounded-lg">
        <p className="font-semibold text-lg">
          Anda yakin ingin menambah data ini ke daftar pengunjung ?
        </p>
        <div className="pb-2.5" />
        <div className="flex justify-center items-center w-full space-x-5 my-2.5">
          <Button
            color="outline-gold"
            onClick={() => pendingVisitor.setModalFollowUp(false)}
          >
            Tidak
          </Button>
          <Button
            color="gold"
            onClick={() => handleFollowUp()}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Ya"}
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}
