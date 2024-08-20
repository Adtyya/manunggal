import ModalBase from "@/components/global/Modal";
import { Button } from "@/components/reactdash-ui";
import useTicket from "./hook/useTickets";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { api } from "@/utils/axios";
import { useNavigate } from "react-router-dom";

export default function ModalSetAsPaid({ open, setOpen, selected }) {
  const ticket = useTicket();
  const client = useQueryClient();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePaid = async () => {
    try {
      setLoading(true);
      await api.patch(`/sales-order/${selected}`, {
        status: "paid",
      });
      ticket.setEdit(true);
      client.invalidateQueries("salesOrder");
    } catch (error) {
      console.warn("Something went wrong");
    } finally {
      setLoading(false);
      navigate("/dashboard/list-sales-order");
    }
  };

  return (
    <ModalBase isOpen={open} closeModal={setOpen}>
      <div className="bg-white w-full max-w-md flex flex-col items-center justify-center p-3.5 rounded-lg">
        <p className="font-semibold text-lg text-center">
          Anda yakin ingin mengubah status pembayaran menjadi{" "}
          <b>Terbayar/Paid</b>
        </p>
        <div className="pb-2.5" />
        <div className="flex justify-center items-center w-full space-x-5 my-2.5">
          <Button color="outline-gold" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button color="gold" onClick={() => handlePaid()} disabled={loading}>
            {loading ? "Please wait..." : "Ya"}
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}
