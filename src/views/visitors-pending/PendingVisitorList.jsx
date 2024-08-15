import React, { useEffect } from "react";
import {
  InfoCircleFill,
} from "react-bootstrap-icons";
// components
import { Row, Column, Card } from "@/components/reactdash-ui";
import TablePendingVisitors from "./table";
import usePendingVisitor from "./hook/usePendingVisitors";
import { Alert } from "@/components/reactdash-ui";

export default function Visitors() {
  const pendingVisitor = usePendingVisitor();

  useEffect(() => {
    setTimeout(() => {
      pendingVisitor.setSuccess(false);
      pendingVisitor.setEdit(false);
      pendingVisitor.setDelete(false);
      pendingVisitor.setFollowUp(false);
    }, 6000);
  }, [pendingVisitor.success, pendingVisitor.edit, pendingVisitor.delete, pendingVisitor.followUp]);

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Manage Pending Visitors</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          <div className="flex items-center gap-1 py-3 px-6 rounded mb-4 bg-yellow-100 text-primary-color">
            <InfoCircleFill className="inline text-primary-color" />
            <div>
              <b>Follow Up</b> digunakan untuk menambahkan data ke <b>Daftar Pengunjung</b> jika terjadi kesalahan teknis saat pembelian tiket via website.
            </div>
          </div>
          {pendingVisitor.success && (
            <Alert color="success" setState={() => pendingVisitor.setSuccess(false)}>
              Sukses menambahkan data. Mohon refresh jika data belum tampil
              dalam list!
            </Alert>
          )}
          {pendingVisitor.edit && (
            <Alert color="success" setState={() => pendingVisitor.setEdit(false)}>
              Sukses mengedit data. Mohon refresh jika data belum terupdate!
            </Alert>
          )}
          {pendingVisitor.delete && (
            <Alert color="success" setState={() => pendingVisitor.setDelete(false)}>
              Sukses menghapus data. Mohon refresh jika data belum
              terupdate!
            </Alert>
          )}
          {pendingVisitor.followUp && (
            <Alert color="success" setState={() => pendingVisitor.setFollowUp(false)}>
              Follow Up data berhasil. Silakan cek data di modul <b>Daftar Pengunjung!</b>
            </Alert>
          )}
          <Card className="relative mb-6">
            <Row className="-mx-4">
              <Column className="w-full px-4">
                <TablePendingVisitors />
              </Column>
            </Row>
          </Card>
        </Column>
      </Row>
    </>
  );
}
