import React, { useEffect } from "react";
// components
import { Preloader, Row, Column, Card } from "@/components/reactdash-ui";
import Tabletickets from "./table";
import useTicket from "./hook/useTickets";
import { Alert } from "@/components/reactdash-ui";

export default function Agents() {
  const ticket = useTicket();

  useEffect(() => {
    setTimeout(() => {
      ticket.setSuccess(false);
      ticket.setEdit(false);
      ticket.setDelete(false);
    }, 6000);
  }, [ticket.success, ticket.edit, ticket.delete]);

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Manage Customer</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {ticket.success && (
            <Alert color="success" setState={() => ticket.setSuccess(false)}>
              Sukses menambahkan data. Mohon refresh jika data belum tampil
              dalam list!
            </Alert>
          )}
          {ticket.edit && (
            <Alert color="success" setState={() => ticket.setEdit(false)}>
              Sukses mengedit data. Mohon refresh jika data belum terupdate!
            </Alert>
          )}
          {ticket.delete && (
            <Alert color="success" setState={() => ticket.setDelete(false)}>
              Sukses menghapus data. Mohon refresh jika data belum terupdate!
            </Alert>
          )}
          <Card className="relative mb-6">
            <Row className="-mx-4">
              <Column className="w-full px-4">
                <Tabletickets />
              </Column>
            </Row>
          </Card>
        </Column>
      </Row>
    </>
  );
}
