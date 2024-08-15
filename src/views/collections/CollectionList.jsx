import React, { useEffect } from "react";
// components
import { Row, Column, Card } from "@/components/reactdash-ui";
import TableCollection from "./table";
import useCollection from "./hook/useCollections";
import { Alert } from "@/components/reactdash-ui";

export default function Blogs() {
  const collection = useCollection();

  useEffect(() => {
    setTimeout(() => {
      collection.setSuccess(false);
      collection.setEdit(false);
      collection.setDelete(false);
    }, 6000);
  }, [collection.success, collection.edit, collection.delete]);

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Manage Collections</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {collection.success && (
            <Alert color="success" setState={() => collection.setSuccess(false)}>
              Sukses menambahkan data. Mohon refresh jika data belum tampil
              dalam list!
            </Alert>
          )}
          {collection.edit && (
            <Alert color="success" setState={() => collection.setEdit(false)}>
              Sukses mengedit data. Mohon refresh jika data belum terupdate!
            </Alert>
          )}
          {collection.delete && (
            <Alert color="success" setState={() => collection.setDelete(false)}>
              Sukses menghapus data. Mohon refresh jika data belum
              terupdate!
            </Alert>
          )}
          <Card className="relative mb-6">
            <Row className="-mx-4">
              <Column className="w-full px-4">
                <TableCollection />
              </Column>
            </Row>
          </Card>
        </Column>
      </Row>
    </>
  );
}
