import React, { useEffect } from "react";
// components
import { Preloader, Row, Column, Card } from "@/components/reactdash-ui";
import TableVisitors from "./table";
import useVisitor from "./hook/useVisitors";
import { Alert } from "@/components/reactdash-ui";

export default function Visitors() {
  const visitor = useVisitor();

  useEffect(() => {
    setTimeout(() => {
      visitor.setSuccess(false);
      visitor.setEdit(false);
      visitor.setDelete(false);
    }, 6000);
  }, [visitor.success, visitor.edit, visitor.delete]);

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Manage Visitors</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {visitor.success && (
            <Alert color="success" setState={() => visitor.setSuccess(false)}>
              Sukses menambahkan data. Mohon refresh jika data belum tampil
              dalam list!
            </Alert>
          )}
          {visitor.edit && (
            <Alert color="success" setState={() => visitor.setEdit(false)}>
              Sukses mengedit data. Mohon refresh jika data belum terupdate!
            </Alert>
          )}
          {visitor.delete && (
            <Alert color="success" setState={() => visitor.setDelete(false)}>
              Sukses menghapus data. Mohon refresh jika data belum
              terupdate!
            </Alert>
          )}
          <Card className="relative mb-6">
            <Row className="-mx-4">
              <Column className="w-full px-4">
                <TableVisitors />
              </Column>
            </Row>
          </Card>
        </Column>
      </Row>
    </>
  );
}
