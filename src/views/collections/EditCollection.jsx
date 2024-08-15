import React, { useMemo, useState, useEffect, useCallback } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";
import { useQuery } from "react-query";
import { getCollectionsById } from "./service";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/utils/axios";
import useCollection from "./hook/useCollections";
import { Alert } from "@/components/reactdash-ui";
import PreviewImage from "@/components/global/PreviewImage";
import { Link } from "react-router-dom";

export default function EditCollection() {
  const param = useParams();
  const collection = useCollection();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery(
    ["collectiongById", { id: param.id }],
    getCollectionsById
  );

  const [error, setError] = useState(false);
  const [image, setImage] = useState([]);
  const [insertNewImage, setInsertNewImage] = useState(false);
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

  const initializeValue = useMemo(() => {
    if (!isLoading && data) {
      setContent(data.content);
      setContentEnglish(data.contentEN);
      setShow(data.isActive);
      return {
        title: data.title,
        notes: data.notes,
        artworkBy: data.artworkBy,
        year: data.year,
        category: data.category,
        collectionType: data.collectionType,
        subtitle: data.subtitle,
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
      form.append("isActive", show);

      await api.patch(`/collection/${param.id}`, form);
      navigate("/dashboard/list-collections");
      collection.setEdit(true);
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
          <p className="text-xl font-bold mt-3 mb-5">Edit Collection</p>
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
                <div className="flex justify-end items-center space-x-3.5 mt-8">
                  <Link to="/dashboard/list-collections">
                    <Button color="outline-gold">Back</Button>
                  </Link>
                  <Button type="submit" color="gold" disabled={isSubmitting}>
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
