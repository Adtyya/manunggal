import React, { useEffect } from "react";
// components
import { Row, Column, Card } from "@/components/reactdash-ui";
import TableUsers from "./table";
import useUser from "./hook/useUser";
import { Alert } from "@/components/reactdash-ui";

export default function CommisionDoctor() {
  const user = useUser();

  useEffect(() => {
    setTimeout(() => {
      user.setSuccess(false);
      user.setEdit(false);
      user.setDelete(false);
    }, 6000);
    return () => {
      user.setSuccess(false);
      user.setEdit(false);
      user.setDelete(false);
    };
  }, [user.success, user.edit, user.delete]);

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Manage Users</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {user.success ? (
            <Alert color="success" setState={() => user.setSuccess(false)}>
              Sukses menambahkan user. Mohon refresh jika user belum tampil
              dalam list!
            </Alert>
          ) : null}
          {user.edit ? (
            <Alert color="success" setState={() => user.setEdit(false)}>
              Sukses mengedit user. Mohon refresh jika user belum terupdate!
            </Alert>
          ) : null}
          {user.delete ? (
            <Alert color="success" setState={() => user.setDelete(false)}>
              Sukses menghapus user. Mohon refresh jika user belum terupdate!
            </Alert>
          ) : null}
          <Card className="relative mb-6">
            <Row className="-mx-4">
              <Column className="w-full px-4">
                <TableUsers />
              </Column>
            </Row>
          </Card>
        </Column>
      </Row>
    </>
  );
}
