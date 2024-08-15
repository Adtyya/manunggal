import React, { useMemo, useRef } from "react";
import { Printer, Whatsapp } from "react-bootstrap-icons";
// components
import {
  Preloader,
  Row,
  Column,
  Button,
  Card,
} from "@/components/reactdash-ui";
import { Link, useParams } from "react-router-dom";
import { toNumberFormat } from "@/utils/toNumber";
import { formatDate } from "@/utils/formatdate";
import useInformationUser from "./useInformationUser";
import { useReactToPrint } from "react-to-print";

export default function Invoice(props) {
  const userInfo = useInformationUser();

  // const handlePrint = () => window.print();
  const ref = useRef();
  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });
  const id = useMemo(() => {
    return Math.floor(Math.random() * 90000) + 10000;
  }, []);

  const getSubtotal = props.data?.items?.reduce(
    (accumulator, current) =>
      parseInt(accumulator) +
      parseInt(
        current.price * current.qty - current.discountPrice * current.qty
      ),
    0
  );

  const tax = Math.round((props.data?.tax / getSubtotal) * 100) || 0;

  const totalAmount =
    getSubtotal +
    parseInt(props.data?.consultationPrice || 0) +
    parseInt((getSubtotal * tax || 0) / 100);

  const invoice_text = {
    invoice: "Invoice",
    bill: "Bill to",
    invoiceid: "Invoice ID",
    date: "Invoice date",
    due: "Due date",
    status: "Status",
    payment: "Payment",
    product: "Products",
    qty: "Qty",
    price: "Unit price",
    total: "Total",
    sub: "Sub-Total",
    discount: "Consultation Fee",
    tax: "Tax",
    print: "Print Invoice",
  };

  const getTreatment = props?.data?.items?.filter(
    (val) => val.category === "treatment"
  );
  const getProduct = props?.data?.items?.filter(
    (val) => val.category !== "treatment"
  );

  const bodyMsg = useMemo(() => {
    return `
  Glamori Aesthetic Clinic. Jl. Diponegoro No.156, Enggal, Engal, Kota Bandar Lampung, Lampung 35118
  ${props?.data?.patient?.phone}

  Nomer Nota : 
  ${props.data?.transactionId?.replace("GT", "INV")}
    
  Pelanggan Yth : 
  ${props.data?.patient?.fullname}
  Terima : ${formatDate(new Date(props.data?.date))}
    
  ======================
  Detail pesanan:
  Treatment
    ${getTreatment?.map((val) => {
      return `
  ✅ ${val.name} @${val.qty}
  Rp. ${toNumberFormat(val.price)}
  Discount Rp. ${toNumberFormat(val.discountPrice)}
  Total Rp. ${toNumberFormat(val.price * val.qty)}
  `;
    })}
    
  Produk
  ${getProduct?.map((val) => {
    return `
  ✅ ${val.name} @${val.qty}
  Rp. ${toNumberFormat(val.price)}
  Discount ${toNumberFormat(val.discountPrice)}
  Total Rp. ${toNumberFormat(val.price * val.qty)}
  `;
  })}

  ==============
  Detail biaya : 
  Konsultasi Dokter : Rp ${toNumberFormat(props.data?.consultationPrice)}
  PPN : ${tax}%
  Point Discount : Rp ${toNumberFormat(props.data?.pointCurrency || 0)}
  Grand Total : Rp ${toNumberFormat(totalAmount)}
  Pembayaran: 
  💵 ${
    props.data?.payment === "bank transaction"
      ? "Card"
      : props.data?.payment === "e-wallet"
      ? "Transfer"
      : props.data?.payment
  } Rp ${toNumberFormat(totalAmount)}
  Status: ${props.data?.status}
    
  Note : 
  Barang yang sudah dibeli tidak dapat dikembalikan
   
  Terima kasih`;
  }, [props.data]);

  const sendInvoice = () => {
    let num = props?.data?.patient?.phone;
    if (props?.data?.patient?.phone.startsWith("08"))
      num = "62" + num?.slice(2);

    window.open(
      `https://api.whatsapp.com/send/?phone=${num}&text=${encodeURIComponent(
        bodyMsg
      )}`,
      "_blank"
    );
  };

  return (
    <>
      {/* page title  */}
      <div id="headpage" className="flex flex-wrap flex-row">
        <Column className="w-full px-4 flex items-center justify-between mb-4">
          <Link to="/dashboard/list-transactions">
            <Button color="gold">Back</Button>
          </Link>
          <p className="text-xl font-bold mt-3 mb-5">
            Invoice {props.data?.transactionId?.replace("GT", "")}
          </p>
          <div className="flex justify-end items-center space-x-5">
            <Button
              className="capitalize"
              color="outline-gold"
              onClick={() => sendInvoice()}
              disabled={!props?.data?.patient?.phone}
            >
              {props?.data?.patient?.phone ? (
                <>
                  <Whatsapp className="inline-block mr-1" />
                  <span>Send to Whatsapp</span>
                </>
              ) : (
                <span>This customer doesnt have phone number!</span>
              )}
            </Button>
            <Button
              onClick={handlePrint}
              color="gold"
              className="ltr:mr-2 rtl:ml-2 inline-block"
            >
              <Printer className="inline-block mr-1" />
              Print Invoice
            </Button>
          </div>
        </Column>
      </div>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          <Card className="relative p-6 mb-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-3">
              <div className="flex flex-col">
                <div className="text-3xl font-bold mb-1">
                  <img
                    className="inline-block w-36 h-auto ltr:mr-2 rtl:ml-2 object-contain"
                    src="/img/logos/tumurun_logo.png"
                    alt="logo"
                  />
                </div>
              </div>
              <div className="text-4xl uppercase font-bold">
                {invoice_text.invoice}
              </div>
            </div>

            <div className="flex flex-row justify-between py-3">
              <div className="flex-1">
                <p>
                  <strong>{invoice_text.bill}:</strong>
                  <br />
                  {props.data?.patient?.fullname}
                  <br />
                  {props.data?.transactionId}
                </p>
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <div className="flex-1 font-semibold">
                    {invoice_text.invoiceid} :
                  </div>
                  <div className="flex-1 ltr:text-right rtl:text-left">
                    {props.data?.transactionId?.replace("GT", "INV")}
                  </div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="flex-1 font-semibold">
                    {invoice_text.date}:
                  </div>
                  <div className="flex-1 ltr:text-right rtl:text-left">
                    {formatDate(new Date(props.data?.date))}
                  </div>
                </div>
                {/* <div className="flex justify-between mb-2">
                  <div className="flex-1 font-semibold">
                    {invoice_text.due}:
                  </div>
                  <div className="flex-1 ltr:text-right rtl:text-left">
                    {formatDate(new Date())}
                  </div>
                </div> */}
                <div className="flex justify-between mb-2">
                  <div className="flex-1 font-semibold">
                    {invoice_text.status} :
                  </div>
                  <div className="flex-1 ltr:text-right rtl:text-left capitalize">
                    {props.data?.status}
                  </div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="flex-1 font-semibold">
                    {invoice_text.payment} :
                  </div>
                  <div className="flex-1 ltr:text-right rtl:text-left capitalize">
                    {props.data?.payment}
                  </div>
                </div>
              </div>
            </div>

            <div className="py-4">
              <table className="table-bordered w-full ltr:text-left rtl:text-right text-gray-600">
                <thead className="border-b dark:border-gray-700 rounded-lg">
                  <tr className="bg-gray-100 dark:bg-gray-900 dark:bg-opacity-20">
                    <th>{invoice_text.product}</th>
                    <th className="text-center">{invoice_text.qty}</th>
                    <th className="text-center">Real Price</th>
                    <th className="text-center">Discount/pcs</th>
                    <th className="text-center">{invoice_text.price}</th>
                    <th className="text-center">{invoice_text.total}</th>
                  </tr>
                </thead>
                <tbody>
                  {props?.data?.items.map((product, index) => {
                    const total_price = product.price * product.qty;
                    return (
                      <tr key={index} className="border-b dark:border-gray-700">
                        <td>
                          <div className="flex flex-wrap flex-row items-center">
                            {/* <div className="self-center">
                              <img className="h-8 w-8" src={product.img} />
                            </div> */}
                            <div className="leading-5 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                              <p>{product.name}</p>
                              <br></br>
                              <p>{product?.subname}</p>
                              <br />
                              <p className="capitalize">{product.notes}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">{product.qty}</td>
                        <td className="text-center">
                          Rp. {toNumberFormat(product.price)}
                        </td>
                        <td className="text-center">
                          {`Rp. ${toNumberFormat(product.discountPrice)}`}
                        </td>
                        <td className="text-center">
                          Rp.
                          {toNumberFormat(
                            product.price - product.discountPrice
                          )}{" "}
                          x {product.qty}
                        </td>
                        <td className="text-center">
                          Rp.
                          {toNumberFormat(
                            total_price - product.discountPrice * product.qty
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                <tfoot>
                  <tr>
                    <td colSpan="4"></td>
                    <td className="text-center">
                      <b>{invoice_text.sub}</b>
                    </td>
                    <td className="text-center">
                      Rp. {toNumberFormat(getSubtotal)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4"></td>
                    <td className="text-center">
                      <b>{invoice_text.discount}</b>
                    </td>
                    <td className="text-center">
                      Rp. {toNumberFormat(props.data?.consultationPrice)}
                    </td>
                  </tr>
                  {props.data?.discount > 1 || props.data?.discountPrice > 1 ? (
                    <tr>
                      <td colSpan="3"></td>
                      <td className="text-center">
                        <b>{`Voucher used`}</b>
                      </td>
                      <td className="text-center">
                        <b>{`Grand total`}</b>
                      </td>
                      <td className="text-center">
                        Rp.{" "}
                        {toNumberFormat(
                          props.data?.totalPrice - props.data?.tax
                        )}
                      </td>
                    </tr>
                  ) : null}
                  <tr>
                    <td colSpan="4"></td>
                    <td className="text-center">
                      <b>{invoice_text.tax}</b>
                    </td>
                    <td className="text-center">{tax}%</td>
                  </tr>
                  <tr>
                    <td colSpan="4"></td>
                    <td className="text-center">
                      <b>Point Used</b>
                    </td>
                    <td className="text-center">
                      <p>{props.data?.point || 0} points</p> /{" "}
                      <p>
                        Rp. {toNumberFormat(props.data?.pointCurrency || 0)}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4"></td>
                    <td className="text-center">
                      <b>{invoice_text.total}</b>
                    </td>
                    <td className="text-center font-bold">
                      Rp. {toNumberFormat(props.data?.totalPrice)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </Column>
        <div className="hidden">
          <PrintUI
            ref={ref}
            data={props.data}
            subtotal={getSubtotal}
            total={totalAmount}
            tax={tax}
            by={userInfo.all?.fullname ?? ""}
          />
        </div>
      </Row>
    </>
  );
}

const PrintUI = React.forwardRef(({ data, subtotal, total, tax, by }, ref) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  const date = new Date(data?.date);
  const formattedDate = new Intl.DateTimeFormat("id-ID", options).format(date);
  return (
    <div ref={ref} className="bg-white pb-5 !text-xs">
      <p className="text-center text-black font-bold px-3.5 py-2">
        Glamori <br />
        Jl. Diponegoro No.156 <br />
        Tanjung Karang Pusat <br />
        Kota Bandar Lampung, 35118 <br /> Lampung, <br />
        0721252867
      </p>
      <br />
      <div className="border-t border-black border-dashed px-4 py-3">
        <div className="grid w-full grid-cols-2 text-black font-bold">
          <p>Kode Bayar</p>
          <p>: -</p>
        </div>
        <div className="grid grid-cols-2 text-black font-bold items-center">
          <p>Waktu</p>
          <p>: {formattedDate.replace("pukul", "")}</p>
        </div>
        <div className="grid grid-cols-2 text-black font-bold items-center">
          <p>No. Reg</p>
          <p>: -</p>
        </div>
        <div className="grid grid-cols-2 text-black font-bold items-center">
          <p>Pasien</p>
          <p>: {data?.patient?.fullname}</p>
        </div>
      </div>
      <div className="border-t border-b border-black border-dashed px-4 py-3">
        {data?.items?.map((item, i) => {
          return (
            <div
              key={i}
              className="flex justify-between text-black font-bold items-center"
            >
              <div>
                <p>{item.name}</p>
                <p>{item?.notes?.substring(0, 45)}</p>
                <p
                  className={item.discountPrice ? "line-through italic" : null}
                >
                  @{item.qty} x {toNumberFormat(item.price)}
                </p>
                {item.discountPrice ? (
                  <>
                    <p className="italic">
                      Discount/pcs {toNumberFormat(item.discountPrice)}
                    </p>
                    <p>
                      @{item.qty} x{" "}
                      {toNumberFormat(item.price - item.discountPrice)}
                    </p>
                  </>
                ) : null}
              </div>
              <p className="font-bold">
                {toNumberFormat(
                  item.qty * item.price - item.discountPrice * item.qty
                )}
              </p>
            </div>
          );
        })}
      </div>
      <div className="border-b border-black border-dashed px-4 py-3">
        <div className="flex justify-between text-black font-bold items-center">
          <p>Consultation Fee</p>
          <p className="font-bold">{toNumberFormat(data?.consultationPrice)}</p>
        </div>
        <div className="flex justify-between text-black font-bold items-center">
          <p>Sub total</p>
          <p className="font-bold">{toNumberFormat(subtotal)}</p>
        </div>
        {data?.discount > 1 || data?.discountPrice > 1 ? (
          <div className="flex justify-between text-black font-bold items-center">
            <p>Voucher discount</p>
            <p className="font-bold">
              {toNumberFormat(data?.totalPrice - data?.tax)}
            </p>
          </div>
        ) : null}
        <div className="flex justify-between text-black font-bold items-center">
          <p>PPN</p>
          <p className="font-bold">{tax}%</p>
        </div>
        <div className="flex justify-between text-black font-bold items-center">
          <p>Point Discount</p>
          <p className="font-bold">
            {toNumberFormat(data?.pointCurrency || 0)}
          </p>
        </div>
        <div className="flex justify-between text-black font-bold items-center">
          <p>Total</p>
          <p className="font-bold">{toNumberFormat(data?.totalPrice)}</p>
        </div>
      </div>
      <div className="py-4 px-3">
        <div className="flex justify-between text-black font-bold items-center">
          <p>Tunai</p>
          <p className="font-bold">{toNumberFormat(data?.totalPrice)}</p>
        </div>
        <div className="flex justify-between text-black font-bold items-center">
          <p>Dicetak oleh</p>
          <p className="font-bold">{by}</p>
        </div>
      </div>
      <br></br>
      <p className="text-black font-bold text-center">
        <span className="font-bold">Note:</span>
        <br />
        Barang yang sudah dibeli tidak <br /> dapat dikembalikan
      </p>
      <br />
      <h3 className="font-bold text-black text-center">Terimakasih</h3>
    </div>
  );
});
