import ModalBase from "@/components/global/Modal";
import { X } from "react-bootstrap-icons";
import { toNumberFormat } from "@/utils/toNumber";

export default function ModalDetail({ open, setOpen, content }) {
  return (
    <ModalBase isOpen={open} closeModal={setOpen}>
      <div className="w-full max-w-md rounded-lg bg-white p-3.5">
        <div className="w-full text-center relative">
          <p className="font-semibold text-lg">Detail</p>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2"
            onClick={setOpen}
          >
            <X className="text-2xl" />
          </button>
        </div>
        <div>
          <table width="100%">
            <thead>
              <tr>
                <th align="left">Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {content?.map((item, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex flex-col mb-1">
                      <span>{item.name}</span>
                      {item.variant && (
                        <span className="text-sm italic">
                          {`${item.variant} ${item.subvariant}`}
                        </span>
                      )}
                    </div>
                  </td>
                  <td align="center">{item.qty}</td>
                  <td align="center">Rp. {toNumberFormat(item.price - item.discount.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ModalBase>
  );
}
