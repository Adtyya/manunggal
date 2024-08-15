import React, { useEffect } from "react";
// components
import { Preloader, Row, Column, Card } from "@/components/reactdash-ui";
import TableArticles from "./table";
import useArticle from "./hook/useArticle";
import { Alert } from "@/components/reactdash-ui";

export default function Article() {
  const article = useArticle();
  useEffect(() => {
    setTimeout(() => {
      article.setSuccess(false);
      article.setEdit(false);
      article.setDelete(false);
    }, 6000);
  }, [article.edit, article.success, article.delete]);

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Manage Articles</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {article.success ? (
            <Alert color="success" setState={() => article.setSuccess(false)}>
              Sukses menambahkan artikel. Mohon refresh jika artikel belum
              tampil dalam list!
            </Alert>
          ) : null}
          {article.edit ? (
            <Alert color="success" setState={() => article.setEdit(false)}>
              Sukses mengedit artikel. Mohon refresh jika artikel belum
              terupdate!
            </Alert>
          ) : null}
          {article.delete ? (
            <Alert color="success" setState={() => article.setDelete(false)}>
              Sukses menghapus artikel. Mohon refresh jika artikel belum
              terupdate!
            </Alert>
          ) : null}
          <Card className="relative mb-6">
            <Row className="-mx-4">
              <Column className="w-full px-4">
                <TableArticles />
              </Column>
            </Row>
          </Card>
        </Column>
      </Row>
    </>
  );
}
