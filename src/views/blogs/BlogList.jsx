import React, { useEffect } from "react";
// components
import { Row, Column, Card } from "@/components/reactdash-ui";
import TableBlog from "./table";
import useBlog from "./hook/useBlogs";
import { Alert } from "@/components/reactdash-ui";

export default function Blogs() {
  const blog = useBlog();

  useEffect(() => {
    setTimeout(() => {
      blog.setSuccess(false);
      blog.setEdit(false);
      blog.setDelete(false);
    }, 6000);
  }, [blog.success, blog.edit, blog.delete]);

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Manage Blogs</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {blog.success && (
            <Alert color="success" setState={() => blog.setSuccess(false)}>
              Sukses menambahkan data. Mohon refresh jika data belum tampil
              dalam list!
            </Alert>
          )}
          {blog.edit && (
            <Alert color="success" setState={() => blog.setEdit(false)}>
              Sukses mengedit data. Mohon refresh jika data belum terupdate!
            </Alert>
          )}
          {blog.delete && (
            <Alert color="success" setState={() => blog.setDelete(false)}>
              Sukses menghapus data. Mohon refresh jika data belum
              terupdate!
            </Alert>
          )}
          <Card className="relative mb-6">
            <Row className="-mx-4">
              <Column className="w-full px-4">
                <TableBlog />
              </Column>
            </Row>
          </Card>
        </Column>
      </Row>
    </>
  );
}
