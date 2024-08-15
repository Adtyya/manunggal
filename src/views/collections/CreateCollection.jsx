import React, { useState, useCallback } from "react";
// components
import {
  Row,
  Column,
  Card,
  Button,
  InputLabel,
  Select,
  Switch,
  Textarea,
  Uploader,
} from "@/components/reactdash-ui";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/utils/axios";
import { useNavigate } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";
import useCollection from "./hook/useCollections";
import { Alert } from "@/components/reactdash-ui";
import { Link } from "react-router-dom";
import PreviewImage from "@/components/global/PreviewImage";

export default function CreateCollection() {
  const navigate = useNavigate();
  const collection = useCollection();

  const [error, setError] = useState(false);
  const [image, setImage] = useState([]);
  const [content, setContent] = useState("");
  const [contentEnglish, setContentEnglish] = useState("");
  const [show, setShow] = useState(true);

  const schema = yup.object().shape({
    title: yup.string().required(),
    notes: yup.string(),
    artworkBy: yup.string(),
    year: yup.string(),
    category: yup.string(),
    collectionType: yup.string(),
    isActive: yup.bool(),
    subtitle: yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onChangeContent = useCallback((value) => {
    setContent(value);
  }, []);

  const onChangeContentEnglish = useCallback((value) => {
    setContentEnglish(value);
  }, []);

  async function onSubmit(data) {
    const form = new FormData();

    for (let key in data) {
      form.append(key, data[key]);
    }
    form.append("image", image[0]);
    form.append("content", content);
    form.append("contentEN", contentEnglish);
    form.append("isActive", show);
    const res = await api.post("/collection", form);
    if (res?.status === 201 || res?.status === 200) {
      navigate("/dashboard/list-collections");
      collection.setSuccess(true);
    } else {
      setError(true);
    }
  }

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Create Collection</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {error && (
            <Alert color="danger">
              Terjadi kesalahan saat membuat data baru. Mohon coba beberapa saat
              lagi
            </Alert>
          )}
          <Card className="relative p-6">
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
                  <InputLabel
                    name="subtitle"
                    id="subtitle"
                    label="Subtitle"
                    register={register}
                    error={errors?.subtitle?.message}
                  />
                  <InputLabel
                    name="artworkBy"
                    id="artworkBy"
                    label="Artwork By"
                    register={register}
                    required
                    error={errors?.artworkBy?.message}
                  />
                  <InputLabel
                    name="year"
                    id="year"
                    label="Year"
                    register={register}
                    error={errors?.year?.message}
                    type="number"
                    min={0}
                  />
                  <Select
                    label="Type"
                    name="collectionType"
                    register={register}
                    className="w-full"
                    options={[
                      {
                        title: "Contemporary",
                        value: "contemporary",
                      },
                      {
                        title: "Modern",
                        value: "modern",
                      },
                    ]}
                    required
                  />
                  <Select
                    label="Category"
                    name="category"
                    register={register}
                    className="w-full"
                    options={[
                      {
                        title: "Lukisan",
                        value: "lukisan",
                      },
                      {
                        title: "Seni Kriya",
                        value: "seni kriya",
                      },
                      {
                        title: "Seni Grafis",
                        value: "seni grafis",
                      },
                      {
                        title: "Patung",
                        value: "patung",
                      },
                      {
                        title: "Fotografi",
                        value: "fotografi",
                      },
                    ]}
                    required
                  />
                  <div className="mb-3">
                    <p>Image (Max Size: 3MB)</p>
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
                    {image.length === 0 && (
                      <small className="text-red-500">
                        Please insert image!
                      </small>
                    )}
                  </div>
                  <Textarea
                    name="notes"
                    id="notes"
                    label="Notes"
                    rows={6}
                    required
                    register={register}
                    error={errors?.notes?.message}
                  />
                  <div className="flex flex-col mb-1">
                    <p>Active</p>
                    <div className="flex items-center gap-5">
                      <Switch
                        onChange={() => setShow((prev) => !prev)}
                        checked={show}
                      />
                      <div className="flex flex-col">
                        <p>Is Active?</p>
                        <span className="opacity-70">
                          Enable this to display on websites
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-full lg:col-span-6">
                  <div>
                    <p>Content</p>
                    <SimpleMDE value={content} onChange={onChangeContent} />
                  </div>
                  <div>
                    <p>Content (English Version)</p>
                    <SimpleMDE
                      value={contentEnglish}
                      onChange={onChangeContentEnglish}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center mt-8 space-x-3.5">
                <Link to="/dashboard/list-tickets">
                  <Button color="outline-gold">Back</Button>
                </Link>
                <Button
                  type="submit"
                  color="gold"
                  disabled={isSubmitting || image.length === 0}
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
