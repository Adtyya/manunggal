import React, { useEffect } from "react";
// components
import { Row, Column, Card } from "@/components/reactdash-ui";
import TableVariants from "./table";
import useVariant from "./hook/useVariants";
import { Alert } from "@/components/reactdash-ui";

export default function Variants() {
  const variant = useVariant();

  useEffect(() => {
    setTimeout(() => {
      variant.setSuccess(false);
      variant.setEdit(false);
      variant.setDelete(false);
    }, 6000);
  }, [variant.success, variant.edit, variant.delete]);

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Manage Variants</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {variant.success ? (
            <Alert color="success" setState={() => variant.setSuccess(false)}>
              Sukses menambahkan variant. Mohon refresh jika variant belum tampil
              dalam list!
            </Alert>
          ) : null}
          {variant.edit ? (
            <Alert color="success" setState={() => variant.setEdit(false)}>
              Sukses mengedit variant. Mohon refresh jika variant belum terupdate!
            </Alert>
          ) : null}
          {variant.delete ? (
            <Alert color="success" setState={() => variant.setDelete(false)}>
              Sukses menghapus variant. Mohon refresh jika variant belum
              terupdate!
            </Alert>
          ) : null}
          <Card className="relative mb-6">
            <Row className="-mx-4">
              <Column className="w-full px-4">
                <TableVariants />
              </Column>
            </Row>
          </Card>
        </Column>
      </Row>
    </>
  );
}
