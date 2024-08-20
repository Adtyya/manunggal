import ModalBase from "@/components/global/Modal";
import { Button } from "@/components/reactdash-ui";
import useTicket from "./hook/useTickets";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { api } from "@/utils/axios";
import { useNavigate } from "react-router-dom";

export default function ModalSetAsPaidPost({ open, setOpen, data }) {
  const ticket = useTicket();
  const client = useQueryClient();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePaid = async () => {
    let res;
    try {
      setLoading(true);
      data.status = "paid";
      res = await api.post(`/sales-order`, data);
      setMessage(res?.data?.message);
      ticket.setEdit(true);
      client.invalidateQueries("salesOrder");
    } catch (error) {
      console.warn("Something went wrong");
    } finally {
      setLoading(false);
      if (res.status === 200 || res.status === 201) {
        setMessage("");
        navigate("/dashboard/list-sales-contract");
      }
    }
  };

  return (
    <ModalBase isOpen={open} closeModal={setOpen}>
      <div className="bg-white w-full max-w-md flex flex-col items-center justify-center p-3.5 rounded-lg">
        <p className="font-semibold text-lg text-center">
          Anda yakin ingin menyimpan sales order dengan status{" "}
          <b>Terbayar/Paid</b>
        </p>
        <div className="pt-2.5"></div>
        {message ? (
          <div className="text-red-500">
            <p>Error saat membuat data.</p>
            <ul className="list-disc list-inside">
              <li>{message}</li>
            </ul>
          </div>
        ) : null}
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
