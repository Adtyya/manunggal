import React, { useState, useEffect } from "react";
import QRCode from 'qrcode';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Files,
  Check2All
} from "react-bootstrap-icons";
import useVisitor from "./hook/useVisitors";
import { formatDateTime } from "@/utils/formatdate";
import ModalBase from "@/components/global/Modal";
import { Button } from "@/components/reactdash-ui";

export default function ModalDetail({ open, setOpen, selected }) {
  const visitor = useVisitor();
  const [image, setImage] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  }

  useEffect(() => {
    if (selected?.visitId) {
      QRCode.toDataURL(selected?.visitId)
        .then(url => {
          setImage(url);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [selected]);

  const bgStatus = (val) => {
    if (val === "pending") return "text-yellow-600";
    if (val === "cancel") return "text-red-600";
    if (val === "paid") return "text-green-600";
    return "text-gray-600";
  }

  const bgTicket = (val) => {
    if (val === "open") return "text-yellow-600";
    if (val === "combo" || val === "half used") return "text-indigo-600";
    return "text-green-600";
  }

  return (
    <ModalBase isOpen={open} closeModal={setOpen}>
      <div className="bg-white w-full max-w-4xl flex flex-col items-center justify-center p-3.5 rounded-lg">
        <div className="mt-5 flex flex-row gap-1">
          <h3 className="font-bold text-xl">Ticket Status:</h3>
          <p className={`font-bold text-xl capitalize ${bgTicket(selected?.ticketStatus)}`}>
            {selected?.ticketStatus}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div className="flex flex-col items-center">
            {image && (
              <img alt="Image" src={image} width="250" />
            )}
            <h3 className="text-sm">Ticket ID</h3>
            <div className="flex flex-row gap-1">
              <CopyToClipboard text={selected?.visitId} onCopy={handleCopy}>
                <button disabled={copied ? true : false}>
                  {copied ? (
                    <Check2All />
                  ) : (
                    <Files />
                  )}
                </button>
              </CopyToClipboard>
              <p className="font-bold">{selected?.visitId}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:mt-7">
            <div>
              <h3 className="text-sm">Nama</h3>
              <p className="font-bold">{selected?.customer?.name}</p>
            </div>
            <div>
              <h3 className="text-sm">Gender / Usia</h3>
              <p className="font-bold capitalize">{selected?.customer?.gender} / {selected?.customer?.ageGroup}</p>
            </div>
            <div>
              <h3 className="text-sm">Email</h3>
              <p className="font-bold font-bold">{selected?.customer?.email || "-"}</p>
            </div>
            <div>
              <h3 className="text-sm">Telepon</h3>
              <p className="font-bold">{selected?.customer?.phone || "-"}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:mt-7">
            <div>
              <h3 className="text-sm">Event</h3>
              <p className="font-bold">{selected?.event}</p>
            </div>
            <div>
              <h3 className="text-sm">Visit Date</h3>
              <p className="font-bold">{formatDateTime(selected?.visitDate)}</p>
            </div>
            <div>
              <h3 className="text-sm">Jumlah</h3>
              <p className="font-bold">{selected?.visitor}</p>
            </div>
            <div>
              <h3 className="text-sm">Status</h3>
              <p className={`font-bold capitalize ${bgStatus(selected?.status)}`}>
                {selected?.status}
              </p>
            </div>
            <div>
              <h3 className="text-sm">Payment</h3>
              <p className="font-bold capitalize">{selected?.payment || "-"}</p>
            </div>
          </div>
        </div>
        <div className="my-5">
          <Button
            color="gold"
            onClick={() => visitor.setModalDetail(false)}
          >
            Close
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}
