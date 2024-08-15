import React, { useMemo, useState, useEffect, useCallback } from "react";
// components
import {
  Row,
  Column,
  Card,
  Checkbox,
  Button,
  InputLabel,
  Textarea,
  Uploader,
  Switch,
} from "@/components/reactdash-ui";
import { useNavigate, useParams } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";
import { useQuery } from "react-query";
import { getBlogsById } from "./service";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/utils/axios";
import useBlog from "./hook/useBlogs";
import { Alert } from "@/components/reactdash-ui";
import PreviewImage from "@/components/global/PreviewImage";
import { Link } from "react-router-dom";

export default function EditBlog() {
  const param = useParams();
  const blog = useBlog();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery(
    ["blogById", { id: param.id }],
    getBlogsById
  );

  const [error, setError] = useState(false);
  const [image, setImage] = useState([]);
  const [insertNewImage, setInsertNewImage] = useState(false);
  const [content, setContent] = useState("");
  const [contentEnglish, setContentEnglish] = useState("");
  const [active, setActive] = useState(true);

  const schema = yup.object().shape({
    title: yup.string().required(),
    spoiler: yup.string().required(),
    spoilerEN: yup.string().required(),
    isActive: yup.bool(),
  });

  const initializeValue = useMemo(() => {
    if (!isLoading && data) {
      setContent(data.content);
      setContentEnglish(data.contentEN);
      setActive(data.isActive);
      return {
        title: data.title,
        spoiler: data.spoiler,
        spoilerEN: data.spoilerEN,
      };
    }
    return null;
  }, [data, isLoading]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initializeValue,
  });

  useEffect(() => {
    if (initializeValue) {
      Object.keys(initializeValue).forEach((key) => {
        setValue(key, initializeValue[key]);
      });
    }
  }, [initializeValue, setValue]);

  const onChangeContent = useCallback((value) => {
    setContent(value);
  }, []);

  const onChangeContentEnglish = useCallback((value) => {
    setContentEnglish(value);
  }, []);

  async function onSubmit(data) {
    try {
      const form = new FormData();
      for (let key in data) {
        form.append(key, data[key]);
      }
      if (image.length > 0) {
        form.append("image", image[0]);
      }
      form.append("content", content);
      form.append("contentEN", contentEnglish);
      form.append("isActive", active);

      await api.patch(`/blog/${param.id}`, form);
      navigate("/dashboard/list-blogs");
      blog.setEdit(true);
    } catch (error) {
      console.warn("Something went wrong");
      setError(true);
    }
  }

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Edit Blog</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {error && (
            <Alert color="danger">
              Terjadi kesalahan saat mengedit data. Mohon coba beberapa saat
              lagi
            </Alert>
          )}
          <Card className="relative p-6">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <form
                className="w-full"
                onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
              >
                <div className="grid grid-cols-12 gap-5">
                  <div className="col-span-full lg:col-span-6">
                    <InputLabel
                      name="title"
                      id="title"
                      label="Title"
                      register={register}
                      required
                      error={errors?.title?.message}
                    />
                    <div className="mb-3">
                      <p>Image (Max Size: 3MB)</p>
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
                    </div>
                    <Textarea
                      name="spoiler"
                      id="spoiler"
                      label="Spoiler"
                      rows={6}
                      required
                      register={register}
                      error={errors?.spoiler?.message}
                    />
                    <Textarea
                      name="spoilerEN"
                      id="spoilerEN"
                      label="Spoiler (English Version)"
                      rows={6}
                      required
                      register={register}
                      error={errors?.spoilerEN?.message}
                    />
                  </div>
                  <div className="col-span-full lg:col-span-6">
                    <div>
                      <p>Content</p>
                      <SimpleMDE
                        value={content}
                        onChange={onChangeContent}
                      />
                    </div>
                    <div>
                      <p>Content (English Version)</p>
                      <SimpleMDE
                        value={contentEnglish}
                        onChange={onChangeContentEnglish}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <p>Active</p>
                      <Switch
                        onChange={() => setActive((prev) => !prev)}
                        checked={active}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end items-center space-x-3.5 mt-8">
                  <Link to="/dashboard/list-blogs">
                    <Button color="outline-gold">Back</Button>
                  </Link>
                  <Button
                    type="submit"
                    color="gold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Please wait..." : "Save"}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </Column>
      </Row>
    </>
  );
}
