import React, { useMemo, useState, useEffect, useCallback } from "react";
// components
import {
  Row,
  Column,
  Card,
  Button,
  InputLabel,
  Select,
  Uploader,
  Switch,
} from "@/components/reactdash-ui";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { getProductsById, getProCategories, getProVariant } from "./service";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/utils/axios";
import useProduct from "./hook/useProducts";
import { Alert } from "@/components/reactdash-ui";
import SimpleMDE from "react-simplemde-editor";
import PreviewImage from "@/components/global/PreviewImage";
import InputPrice from "@/components/global/InputPrice";
import ModalCategory from "./ModalCategory";
import { Trash, PlusLg } from "react-bootstrap-icons";

export default function EditProduct() {
  const param = useParams();
  const product = useProduct();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery(
    ["productById", { id: param.id }],
    getProductsById
  );

  const { data: categories, isLoading: loadingCategories } = useQuery(
    ["categories", { page: 1, limit: 20 }],
    getProCategories
  );

  const { data: variants, isLoading: loadingVariants } = useQuery(
    ["variants", { page: 1, limit: 20 }],
    getProVariant
  );

  const [image, setImage] = useState([]);
  const [insertNewImage, setInsertNewImage] = useState(false);
  const [error, setError] = useState(false);
  const [available, setAvailable] = useState(true);
  const [description, setDescription] = useState("");
  const [variantLabel, setVariantLabel] = useState([]);
  const [variantList, setVariantList] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState([]);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [galleryRemove, setGalleryRemove] = useState([]);

  const schema = yup.object().shape({
    name: yup.string().required(),
    price: yup.number().required(),
    stock: yup.number().required(),
    category: yup.string().required(),
    discountPercentage: yup.string(),
    discountAmount: yup.number(),
    variantLabelName1: yup.string(),
    variantLabelName2: yup.string(),
    variantLabelOption1: yup.string(),
    variantLabelOption2: yup.string(),
    isAvailable: yup.bool(),
  });

  const initializeValue = useMemo(() => {
    if (!isLoading && data) {
      setDescription(data.description);
      setAvailable(data.isAvailable);
      setVariantLabel(data?.variantLabel || []);
      setVariantList(data?.variant || []);
      setGalleryPreview(data?.gallery || []);
      return {
        name: data.name,
        price: data.price,
        stock: data.stock,
        category: data.category,
        discountPercentage: data.discount.percentage,
        discountAmount: data.discount.amount,
        variantLabelName1: data?.variantLabel[0]?.name || "",
        variantLabelName2: data?.variantLabel[1]?.name || "",
        variantLabelOption1: data?.variantLabel[0]?.options?.join(", ") || "",
        variantLabelOption2: data?.variantLabel[1]?.options?.join(", ") || "",
      };
    }
    return null;
  }, [data, isLoading]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
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

  const currData = watch();

  const onChangeContent = useCallback((value) => {
    setDescription(value);
  }, []);

  const listCategories =
    categories?.docs?.length > 0
      ? categories.docs.map((option) => ({
          title: option.name,
          value: option.name.toLowerCase(),
        }))
      : [];

  const listVariants =
    variants?.docs?.length > 0
      ? variants.docs.map((op) => ({
          title: `${op.name} (${op.options.join(", ")})`,
          value: op.options.join(", "),
        }))
      : [];

  useEffect(() => {
    setValue(
      "discountAmount",
      (Number(currData?.price || 0) *
        Number(currData?.discountPercentage || 0)) /
        100
    );
  }, [currData.discountPercentage, currData.price]);

  const handleChangeVariant = (val, variantIndex) => {
    setVariantList((prev) => {
      const updated = [...prev];
      updated[variantIndex].stock = val;
      return updated;
    });
  };

  const handleChangeSubVariant = (val, variantIndex, subvariantIndex) => {
    setVariantList((prev) => {
      const updated = [...prev];
      updated[variantIndex].subvariant[subvariantIndex].stock = val;
      return updated;
    });
  };

  const calculateTotalStock = () => {
    let totalStock = 0;
    if (variantList.length > 0) {
      variantList.forEach((variant) => {
        if (variant.subvariant.length > 0) {
          variant.subvariant.forEach((sub) => {
            totalStock += sub.stock;
          });
        } else {
          totalStock += variant.stock;
        }
      });
    }
    return totalStock;
  };

  useEffect(() => {
    if (variantList.length > 0) {
      setValue("stock", calculateTotalStock());
    }
  }, [variantList]);

  const generateVariantStatus = () => {
    if (variantList.length > 0) {
      return false;
    }
    if (
      currData.variantLabelName1 &&
      currData.variantLabelOption1 &&
      !currData.variantLabelName2 &&
      !currData.variantLabelOption2
    ) {
      return true;
    }
    if (currData.variantLabelName2 && currData.variantLabelOption2) {
      return true;
    }
    return false;
  };

  const handleGenerateVariant = () => {
    const varop1 = currData.variantLabelOption1
      ? currData.variantLabelOption1.split(", ")
      : [];
    const varop2 = currData.variantLabelOption2
      ? currData.variantLabelOption2.split(", ")
      : [];

    let initialVariantLabel = [
      {
        name: currData.variantLabelName1,
        options: varop1,
      },
    ];

    if (varop2.length > 0) {
      initialVariantLabel = [
        ...initialVariantLabel,
        {
          name: currData.variantLabelName2,
          options: varop2,
        },
      ];
    }

    const initialListVariant = varop1.map((item) => ({
      name: item,
      price: 0,
      stock: 0,
      discount: {
        percentage: 0,
        amount: 0,
      },
      subvariant:
        varop2.length > 0
          ? varop2.map((suv) => ({
              name: suv,
              discount: {
                percentage: 0,
                amount: 0,
              },
              price: 0,
              stock: 0,
            }))
          : [],
    }));

    setVariantLabel(initialVariantLabel);

    setVariantList(initialListVariant);
  };

  const handleResetVariant = () => {
    setVariantLabel([]);
    setVariantList([]);
    setValue("stock", "");
  };

  async function onSubmit(data) {
    try {
      const form = new FormData();
      for (let key in data) {
        form.append(key, data[key]);
      }
      if (image.length > 0) {
        form.append("image", image[0]);
      }
      if (selectedGallery.length > 0) {
        selectedGallery.forEach((file) => {
          form.append("uploadGallery", file);
        });
      }
      if (galleryRemove.length > 0) {
        galleryRemove.forEach((item, i) => {
          form.append(`removeGallery[${i}]`, item);
        });
      }
      form.append("description", description);
      form.append("isAvailable", available);
      form.append("discount.percentage", Number(data.discountPercentage));
      form.append("discount.amount", data.discountAmount);
      if (variantLabel.length > 0 && variantList.length > 0) {
        variantLabel.forEach((item, i) => {
          form.append(`variantLabel[${i}][name]`, item.name);
          if (item.options.length > 0) {
            item.options.forEach((opt, n) => {
              form.append(`variantLabel[${i}][options][${n}]`, opt);
            });
          }
        });
      } else {
        form.append("variantLabel", "reset");
      }
      if (variantList.length > 0) {
        variantList.forEach((item, i) => {
          form.append(`variant[${i}][name]`, item.name);
          form.append(
            `variant[${i}][discount][percentage]`,
            item.discount.percentage
          );
          form.append(`variant[${i}][discount][amount]`, item.discount.amount);
          form.append(`variant[${i}][price]`, item.price);
          form.append(`variant[${i}][stock]`, Number(item.stock));
          if (item.subvariant.length > 0) {
            item.subvariant.forEach((sub, n) => {
              form.append(`variant[${i}][subvariant][${n}][name]`, sub.name);
              form.append(
                `variant[${i}][subvariant][${n}][discount][percentage]`,
                sub.discount.percentage
              );
              form.append(
                `variant[${i}][subvariant][${n}][discount][amount]`,
                sub.discount.amount
              );
              form.append(`variant[${i}][subvariant][${n}][price]`, sub.price);
              form.append(
                `variant[${i}][subvariant][${n}][stock]`,
                Number(sub.stock)
              );
            });
          }
        });
      } else {
        form.append("variant", "reset");
      }

      await api.patch(`/product/${param.id}`, form);
      navigate("/dashboard/list-products");
      product.setEdit(true);
    } catch (error) {
      console.warn("Something went wrong");
      setError(true);
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedGallery((prevFiles) => [...prevFiles, ...files]);

    const filePreviews = files.map((file) => ({
      name: file.name,
      image: URL.createObjectURL(file),
      imageId: "",
    }));
    setGalleryPreview((prevPreviews) => [...prevPreviews, ...filePreviews]);
  };

  const handleRemoveGallery = (file, index) => {
    if (file.name) {
      setSelectedGallery((prev) =>
        prev.filter((item) => item.name !== file.name)
      );
    }

    if (file.imageId) {
      setGalleryRemove((prevFiles) => [...prevFiles, file.imageId]);
    }

    setGalleryPreview((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Edit Product</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {error ? (
            <Alert color="danger">
              Terjadi kesalahan saat mengedit produk. Mohon coba beberapa saat
              lagi
            </Alert>
          ) : null}
          <Card className="relative p-6">
            {isLoading || loadingCategories ? (
              <p>Loading...</p>
            ) : (
              <form
                className="w-full"
                onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
              >
                <div className="grid grid-cols-12 gap-5">
                  <div className="col-span-full lg:col-span-6">
                    <InputLabel
                      name="name"
                      id="name"
                      label="Product name"
                      register={register}
                      required
                      error={errors?.name?.message}
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
                    <div className="col-span-full lg:col-span-6">
                      <div>
                        <div className="flex flex-col items-start md:flex-row md:items-center gap-1 mb-1 md:mb-0">
                          <p>Upload Gallery (Max Size: 3MB)</p>
                          <button
                            type="button"
                            onClick={() => {
                              setGalleryPreview(initializeValue.initialPreview);
                              setGalleryRemove([]);
                              setSelectedGallery([]);
                            }}
                            className="text-sm underline text-primary-color"
                          >
                            Reset Changes
                          </button>
                        </div>
                        <div className="flex flex-row gap-2 flex-wrap">
                          {galleryPreview.length > 0 &&
                            galleryPreview.map((item, g) => (
                              <div
                                key={g}
                                className="relative flex items-center justify-center"
                              >
                                <img
                                  src={item.image}
                                  className="border-2 border-gray-200 rounded-md w-48 h-48 object-cover"
                                />
                                <button
                                  className="absolute right-2 bottom-2 p-1 h-6 rounded bg-primary-color text-white"
                                  type="button"
                                  onClick={() => handleRemoveGallery(item, g)}
                                >
                                  <Trash />
                                </button>
                              </div>
                            ))}
                          {galleryPreview.length < 10 && (
                            <label
                              htmlFor="image-upload"
                              className="cursor-pointer"
                            >
                              <div className="flex items-center justify-center border-2 border-gray-200 rounded-md w-48 h-48">
                                <input
                                  id="image-upload"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="hidden"
                                />
                                <PlusLg size={30} />
                              </div>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p>Description</p>
                      <SimpleMDE
                        value={description}
                        onChange={onChangeContent}
                      />
                    </div>
                  </div>
                  <div className="col-span-full lg:col-span-6">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
                      <InputLabel
                        name="stock"
                        id="stock"
                        label="Stock"
                        register={register}
                        type="number"
                        required
                        disabled={variantList.length > 0 ? true : false}
                        error={errors?.stock?.message}
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-5">
                          <Switch
                            onChange={() => setAvailable((prev) => !prev)}
                            checked={available}
                          />
                          <div className="flex flex-col">
                            <p>Ready Stock</p>
                            <span className="opacity-70">
                              Out-of-stock items not shown on site.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <InputPrice
                      label="Price"
                      required
                      onChange={(val) =>
                        setValue(
                          "price",
                          parseInt(
                            val.target.value
                              .replace("Rp.", "")
                              .replace(/\./g, "")
                          )
                        )
                      }
                      value={currData.price}
                    />
                    <div>
                      <label className="mb-2 capitalize">Discount %</label>
                      <div className="flex flex-row gap-2">
                        <InputLabel
                          className="mt-2"
                          name="discountPercentage"
                          id="discountPercentage"
                          register={register}
                          type="number"
                          error={errors?.discountPercentage?.message}
                          min={0}
                          max={100}
                        />
                        <InputPrice disabled value={currData.discountAmount} />
                      </div>
                    </div>
                    <div className="flex flex-row gap-3 items-center">
                      <Select
                        label="Category"
                        id="category"
                        name="category"
                        register={register}
                        className="w-full"
                        showInitialValue
                        options={listCategories}
                        required
                      />
                      <div className="mt-4">
                        <Button
                          className="w-24"
                          color="gold"
                          onClick={() => product.setModalCategory(true)}
                        >
                          <PlusLg className="inline-block mr-1" />
                          New
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-row gap-3 items-center">
                      <div className="w-[50%]">
                        <InputLabel
                          label="Variant 1"
                          name="variantLabelName1"
                          id="variantLabelName1"
                          placeholder="Variant Name"
                          register={register}
                          error={errors?.variantLabelName1?.message}
                        />
                      </div>
                      <Select
                        className="w-[50%] mt-8"
                        name="variantLabelOption1"
                        id="variantLabelOption1"
                        register={register}
                        showInitialValue
                        options={listVariants}
                      />
                    </div>
                    <div className="flex flex-row gap-3 items-center">
                      <div className="w-[50%]">
                        <InputLabel
                          label="Variant 2"
                          name="variantLabelName2"
                          id="variantLabelName2"
                          placeholder="Variant Name"
                          register={register}
                          error={errors?.variantLabelName2?.message}
                        />
                      </div>
                      <Select
                        className="w-[50%] mt-8"
                        name="variantLabelOption2"
                        id="variantLabelOption2"
                        register={register}
                        showInitialValue
                        options={listVariants}
                      />
                    </div>
                    <div className="flex space-x-3.5">
                      <Button
                        color={generateVariantStatus() ? "gold" : "gray"}
                        disabled={!generateVariantStatus()}
                        onClick={handleGenerateVariant}
                      >
                        Generate Variant
                      </Button>
                      <Button color="outline-gold" onClick={handleResetVariant}>
                        Reset Variant
                      </Button>
                    </div>
                    <div className="mt-4">
                      <p>List of Variant</p>
                      <div className="overflow-x-auto">
                        <table width="100%">
                          <thead>
                            <tr>
                              <td className="text-center px-2 py-4 bg-secondary-color border-b-2 border-pink-300">
                                Variant
                              </td>
                              <td className="text-center px-2 py-4 bg-secondary-color border-b-2 border-pink-300">
                                Stock
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            {variantList.length > 0 ? (
                              variantList.map((item, index) =>
                                item.subvariant.length > 0 ? (
                                  item.subvariant.map((sub, subindex) => (
                                    <tr key={subindex}>
                                      <td className="p-2 border-b-2 border-gray-300">
                                        <div className="flex flex-row flex-wrap gap-3">
                                          <div className="text-center outline outline-1 outline-primary-color text-black py-2 px-4 rounded">
                                            <div className="flex flex-row items-center gap-2">
                                              <span>{item.name}</span>
                                            </div>
                                          </div>
                                          <div className="text-center outline outline-1 outline-primary-color text-black py-2 px-4 rounded">
                                            <div className="flex flex-row items-center gap-2">
                                              <span>{sub.name}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="p-2 border-b-2 border-gray-300 text-center">
                                        <input
                                          placeholder="Stock"
                                          className="w-28 leading-5 py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600"
                                          type="number"
                                          min={0}
                                          value={sub.stock}
                                          onChange={(e) =>
                                            handleChangeSubVariant(
                                              e.target.value,
                                              index,
                                              subindex
                                            )
                                          }
                                        />
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr key={index}>
                                    <td className="p-2 border-b-2 border-gray-300">
                                      <div className="flex flex-row flex-wrap gap-3">
                                        <div className="text-center outline outline-1 outline-primary-color text-black py-2 px-4 rounded">
                                          <div className="flex flex-row items-center gap-2">
                                            <span>{item.name}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-2 border-b-2 border-gray-300 text-center">
                                      <input
                                        placeholder="Stock"
                                        className="w-28 leading-5 py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600"
                                        type="number"
                                        min={0}
                                        value={item.stock}
                                        onChange={(e) =>
                                          handleChangeVariant(
                                            e.target.value,
                                            index
                                          )
                                        }
                                      />
                                    </td>
                                  </tr>
                                )
                              )
                            ) : (
                              <tr>
                                <td
                                  className="p-2 border-b-2 border-gray-300 text-center"
                                  colSpan={2}
                                >
                                  <em>No data</em>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end items-center space-x-3.5 mt-8">
                  <Link to="/dashboard/list-products">
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

      <ModalCategory
        open={product.modalCategory}
        setOpen={() => product.setModalCategory(false)}
      />
    </>
  );
}
