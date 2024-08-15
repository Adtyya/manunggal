import React, { useCallback, useMemo, useState, useEffect } from "react";
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
import { useQuery } from "react-query";
import { getArticlesById } from "./service";
import { useParams } from "react-router-dom";
import PreviewImage from "@/components/global/PreviewImage";

const schema = yup.object().shape({
  title: yup.string().required(),
  // videoUrl: yup.string(),
});

export default function EditArticle() {
  const article = useArticle();
  const navigate = useNavigate();
  const param = useParams();
  const [status, setStatus] = useState(true);
  const [content, setContent] = useState("");
  const [image, setImage] = useState([]);
  const [error, setError] = useState(false);
  const [insertNewImage, setInsertNewImage] = useState(false);

  const { data, isLoading } = useQuery(
    ["articlesById", { id: param.id }],
    getArticlesById
  );

  const initializeValue = useMemo(() => {
    if (!isLoading && data && data.data) {
      return {
        title: data.data.title,
        // videoUrl: data.data.videoUrl,
      };
    }
  }, [data, isLoading]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (initializeValue) {
      setContent(data?.description);
      setStatus(data?.isActive);
      Object.keys(initializeValue).forEach((key) => {
        setValue(key, initializeValue[key]);
      });
    }
  }, [initializeValue, setValue]);

  async function onSubmit(data) {
    const form = new FormData();

    form.append("title", data.title);
    // form.append("videoUrl", data.videoUrl);
    form.append("description", content);
    form.append("image", image[0]);
    form.append("isActive", status);

    const res = await api.patch(`/article/${param.id}`, form);
    if (res.data?.status === 201 || res.data?.status === 200) {
      navigate("/dashboard/list-articles");
      article.setEdit(true);
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
          <p className="text-xl font-bold mt-3 mb-5">Edit Article</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
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
                  {insertNewImage ? (
                    <>
                      <Uploader
                        state={(props) => {
                          setImage(props);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setInsertNewImage(false)}
                        className="text-sm underline text-primary-color"
                      >
                        Use Current Image
                      </button>
                    </>
                  ) : (
                    <PreviewImage
                      currentImage={data?.image}
                      setNewImage={(e) => setInsertNewImage(e)}
                    />
                  )}
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
                <Button type="submit" color="gold" disabled={isSubmitting}>
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
