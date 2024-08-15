import React, { useMemo, useState, useEffect, useCallback } from "react";
// components
import {
  Row,
  Column,
  Card,
  Button,
  InputLabel,
  Uploader,
} from "@/components/reactdash-ui";
import SimpleMDE from "react-simplemde-editor";
import { useQuery } from "react-query";
import { getBannersAvailable } from "./service";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/utils/axios";
import useBanner from "./hook/useBanners";
import { Alert } from "@/components/reactdash-ui";
import PreviewImage from "@/components/global/PreviewImage";

export default function ReplaceBanner() {
  const banner = useBanner();

  const { data, isLoading } = useQuery(
    ["bannerAvailable"],
    getBannersAvailable
  );

  const [error, setError] = useState(false);
  const [image, setImage] = useState([]);
  const [insertNewImage, setInsertNewImage] = useState(false);
  const [content, setContent] = useState("");
  const [contentEnglish, setContentEnglish] = useState("");

  const schema = yup.object().shape({
    title: yup.string().required(),
    curatedBy: yup.string(),
    video: yup.string(),
  });

  const initializeValue = useMemo(() => {
    if (!isLoading && data) {
      setContent(data.description);
      setContentEnglish(data.descriptionEN);
      return {
        title: data.title,
        curatedBy: data.curatedBy,
        video: data.video,
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
      form.append("description", content);
      form.append("descriptionEN", contentEnglish);

      await api.post("/banner/replace", form);
      banner.setReplace(true);
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
          <p className="text-xl font-bold mt-3 mb-5">Edit Banner</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {banner.replace && (
            <Alert color="success" setState={() => banner.setReplace(false)}>
              Sukses mengedit data. Mohon refresh jika data belum terupdate!
            </Alert>
          )}
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
                          {data?.image ? (
                            <button
                              type="button"
                              onClick={() => setInsertNewImage(false)}
                              className="text-sm underline text-primary-color"
                            >
                              Use Current Image
                            </button>
                          ) : (
                            <small className="text-red-500">Please insert image!</small>
                          )}
                        </>
                      ) : (
                        <PreviewImage
                          currentImage={data?.image}
                          setNewImage={(e) => setInsertNewImage(e)}
                        />
                      )}
                    </div>
                    <InputLabel
                      name="video"
                      id="video"
                      label="Video (Url/Link)"
                      register={register}
                      error={errors?.video?.message}
                    />
                    <InputLabel
                      name="curatedBy"
                      id="curatedBy"
                      label="Curated By"
                      register={register}
                      error={errors?.curatedBy?.message}
                    />
                  </div>
                  <div className="col-span-full lg:col-span-6">
                    <div>
                      <p>Description</p>
                      <SimpleMDE value={content} onChange={onChangeContent} />
                    </div>
                    <div>
                      <p>Description (English Version)</p>
                      <SimpleMDE value={contentEnglish} onChange={onChangeContentEnglish} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end items-center space-x-3.5 mt-8">
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
