import React, { useState, useCallback } from "react";
// components
import {
  Preloader,
  Row,
  Column,
  Card,
  Button,
  InputLabel,
  Textarea,
  InputGroup,
  Input,
  Uploader,
  Switch,
} from "@/components/reactdash-ui";
import SimpleMDE from "react-simplemde-editor";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/utils/axios";
import { Link, useNavigate } from "react-router-dom";
import useArticle from "./hook/useArticle";
import { Alert } from "@/components/reactdash-ui";
import PreviewImage from "@/components/global/PreviewImage";

const schema = yup.object().shape({
  title: yup.string().required(),
  // videoUrl: yup.string(),
});

export default function CreateArticle() {
  const article = useArticle();
  const navigate = useNavigate();
  const [status, setStatus] = useState(true);
  const [content, setContent] = useState("");
  const [image, setImage] = useState([]);
  const [error, setError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data) {
    const form = new FormData();

    form.append("title", data.title);
    form.append("description", content);
    // form.append("videoUrl", data.videoUrl);
    form.append("image", image[0]);

    const res = await api.post("/article", form);
    if (res.data?.status === 201 || res.data?.status === 200) {
      navigate("/dashboard/list-articles");
      article.setSuccess(true);
    } else {
      setError(true);
    }
  }

  const onChange = useCallback((value) => {
    setContent(value);
  }, []);

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Create Article</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {error ? (
            <Alert color="danger">
              Terjadi kesalahan saat membuat artikel baru. Mohon coba beberapa
              saat lagi
            </Alert>
          ) : null}
          <Card className="relative p-6">
            <form
              className="w-full"
              onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
            >
              <InputLabel
                name="title"
                id="protitle"
                label="Title"
                required
                register={register}
                error={errors?.title?.message}
              />
              {/* <InputLabel
                name="videoUrl"
                id="a"
                label="Video Url"
                register={register}
                error={errors.title?.message}
              /> */}
              <div>
                <p>Content</p>
                <SimpleMDE value={content} onChange={onChange} />
              </div>
              <Row className="sm:-mx-4">
                <Column className="w-full sm:w-1/2 sm:px-4">
                  {image.length === 0 ? (
                    <Uploader
                      state={(props) => {
                        setImage(props);
                      }}
                    />
                  ) : (
                    <PreviewImage
                      currentImage={image[0]?.preview}
                      setNewImage={() => setImage([])}
                    />
                  )}
                  {image.length === 0 ? (
                    <small className="text-red-500">Please insert image!</small>
                  ) : null}
                </Column>
                <Column className="w-full sm:w-1/2 sm:px-4">
                  <div className="flex justify-between items-center">
                    <p>Status</p>
                    <Switch
                      onChange={() => setStatus((prev) => !prev)}
                      checked={status}
                    />
                  </div>
                </Column>
              </Row>
              <div className="flex justify-end items-center mt-8 space-x-3.5">
                <Link to="/dashboard/list-articles">
                  <Button color="outline-gold">Back</Button>
                </Link>
                <Button
                  type="submit"
                  color="gold"
                  disabled={
                    isSubmitting || image.length === 0 || content.length === 0
                  }
                >
                  {isSubmitting ? "Please wait..." : "Save"}
                </Button>
              </div>
            </form>
          </Card>
        </Column>
      </Row>
    </>
  );
}
