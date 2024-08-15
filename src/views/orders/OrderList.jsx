import React, { useEffect } from "react";
// components
import { Preloader, Row, Column, Card } from "@/components/reactdash-ui";
import TableProducts from "./table";
import useOrder from "./hook/useOrders";
import { Alert } from "@/components/reactdash-ui";

export default function Products() {
  const order = useOrder();

  useEffect(() => {
    setTimeout(() => {
      order.setSuccess(false);
      order.setEdit(false);
      order.setDelete(false);
      order.setPaid(false);
    }, 6000);
  }, [order.success, order.edit, order.delete, order.paid]);

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Manage Orders</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {order.success ? (
            <Alert color="success" setState={() => order.setSuccess(false)}>
              Sukses menambahkan order. Mohon refresh jika order belum tampil
              dalam list!
            </Alert>
          ) : null}
          {order.edit ? (
            <Alert color="success" setState={() => order.setEdit(false)}>
              Sukses mengedit order. Mohon refresh jika order belum terupdate!
            </Alert>
          ) : null}
          {order.delete ? (
            <Alert color="success" setState={() => order.setDelete(false)}>
              Sukses menghapus order. Mohon refresh jika order belum
              terupdate!
            </Alert>
          ) : null}
          {order.paid ? (
            <Alert color="success" setState={() => order.setPaid(false)}>
              Sukses edit status order. Mohon refresh jika order belum
              terupdate!
            </Alert>
          ) : null}
          <Card className="relative mb-6">
            <Row className="-mx-4">
              <Column className="w-full px-4">
                <TableProducts />
              </Column>
            </Row>
          </Card>
        </Column>
      </Row>
    </>
  );
}
