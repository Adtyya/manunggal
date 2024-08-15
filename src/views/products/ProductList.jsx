import React, { useEffect } from "react";
// components
import { Preloader, Row, Column, Card } from "@/components/reactdash-ui";
import TableProducts from "./table";
import useProduct from "./hook/useProducts";
import { Alert } from "@/components/reactdash-ui";

export default function Products() {
  const product = useProduct();

  useEffect(() => {
    setTimeout(() => {
      product.setSuccess(false);
      product.setEdit(false);
      product.setDelete(false);
    }, 6000);
  }, [product.success, product.edit, product.delete]);

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Manage Products</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {product.success ? (
            <Alert color="success" setState={() => product.setSuccess(false)}>
              Sukses menambahkan produk. Mohon refresh jika produk belum tampil
              dalam list!
            </Alert>
          ) : null}
          {product.edit ? (
            <Alert color="success" setState={() => product.setEdit(false)}>
              Sukses mengedit produk. Mohon refresh jika produk belum terupdate!
            </Alert>
          ) : null}
          {product.delete ? (
            <Alert color="success" setState={() => product.setDelete(false)}>
              Sukses menghapus produk. Mohon refresh jika produk belum
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
