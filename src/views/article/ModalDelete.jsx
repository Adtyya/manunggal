import ModalBase from "@/components/global/Modal";
import { Button } from "@/components/reactdash-ui";
import useArticle from "./hook/useArticle";
import { useQueryClient } from "react-query";
import { useState } from "react";
import { deleteArticlesById } from "./service";

export default function ModalDelete({ open, setOpen, selected }) {
  const article = useArticle();
  const client = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteArticlesById(selected);
      article.setDelete(true);
      client.invalidateQueries("articles");
    } catch (error) {
      console.warn("Something went wrong");
    } finally {
      article.setModalDelete(false);
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={open} closeModal={setOpen}>
      <div className="bg-white w-full max-w-md flex flex-col items-center justify-center p-3.5 rounded-lg">
        {/* <img alt="modal-delete" src="/img/ilustration/delete.png" /> */}
        <p className="font-semibold text-lg">
          Anda yakin ingin menghapus data ini ?
        </p>
        <div className="pb-2.5" />
        <div className="flex justify-center items-center w-full space-x-5 my-2.5">
          <Button
            color="outline-gold"
            onClick={() => article.setModalDelete(false)}
          >
            Tidak
          </Button>
          <Button
            color="gold"
            onClick={() => handleDelete()}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Ya"}
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}
