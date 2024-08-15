import React, { useMemo, useState, useEffect, useCallback } from "react";
// components
import {
  Alert,
  Row,
  Column,
  Card,
  Button,
  InputLabel,
  Uploader,
  Switch,
} from "@/components/reactdash-ui";
import { useNavigate, useParams } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";
import { useQuery } from "react-query";
import { getTicketsById } from "./service";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-date-picker";
import { api } from "@/utils/axios";
import { formatDate } from "@/utils/formatdate";
import useTicket from "./hook/useTickets";
import PreviewImage from "@/components/global/PreviewImage";
import { Link } from "react-router-dom";
import InputPrice from "@/components/global/InputPrice";
import { Trash, PlusLg } from "react-bootstrap-icons";

export default function EditTicket() {
  const param = useParams();
  const ticket = useTicket();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery(
    ["ticketById", { id: param.id }],
    getTicketsById
  );

  const [error, setError] = useState(false);
  const [image, setImage] = useState([]);
  const [imageSquare, setImageSquare] = useState([]);
  const [insertNewImage, setInsertNewImage] = useState(false);
  const [insertNewImageSquare, setInsertNewImageSquare] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState([]);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [galleryRemove, setGalleryRemove] = useState([]);
  const [content, setContent] = useState("");
  const [contentEnglish, setContentEnglish] = useState("");
  const [unlimited, setUnlimited] = useState(false);
  const [freeTicket, setFreeTicket] = useState(false);
  const [available, setAvailable] = useState(true);
  const [anytime, setAnytime] = useState(true);
  const [everyday, setEveryday] = useState(true);
  const [saleFrom, setSaleFrom] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCombo, setIsCombo] = useState(false);
  const [comboNotes, setComboNotes] = useState("");
  // schedules
  const [scheduleNotes, setScheduleNotes] = useState("");
  const [selectedDay, setSelectedDay] = useState([]);
  const [monday, setMonday] = useState([]);
  const [tuesday, setTuesday] = useState([]);
  const [wednesday, setWednesday] = useState([]);
  const [thursday, setThursday] = useState([]);
  const [friday, setFriday] = useState([]);
  const [saturday, setSaturday] = useState([]);
  const [sunday, setSunday] = useState([]);
  const [specialDate, setSpecialDate] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [special, setSpecial] = useState([]);
  const [dayOffDate, setDayOffDate] = useState("");
  const [dayOff, setDayOff] = useState([]);
  const validFor = "Valid for 7 Days";

  const [sche, setSche] = useState({
    start: ["", "00"], end: ["", "00"]
  });

  const [specSche, setSpecSche] = useState({
    start: ["", "00"], end: ["", "00"]
  });

  const choiceOfDays = [
    { value: 1, label: "Senin" },
    { value: 2, label: "Selasa" },
    { value: 3, label: "Rabu" },
    { value: 4, label: "Kamis" },
    { value: 5, label: "Jumat" },
    { value: 6, label: "Sabtu" },
    { value: 0, label: "Minggu" },
  ]

  const schema = yup.object().shape({
    name: yup.string().required(),
    subname: yup.string(),
    notes1: yup.string(),
    notes2: yup.string(),
    price: !freeTicket ? yup.number().required() : yup.number(),
    quota: unlimited ? yup.number().required() : yup.number(),
    isAnytime: yup.bool(),
    isEveryday: yup.bool(),
    isUnlimited: yup.bool(),
    isFree: yup.bool(),
    isCombo: yup.bool(),
    isAvailable: yup.bool(),
    initialPreview: yup.array()
  });

  const initializeValue = useMemo(() => {
    if (!isLoading && data) {
      setContent(data.description);
      setContentEnglish(data.descriptionEN);
      setSunday(data?.schedules[0]?.times || []);
      setMonday(data?.schedules[1]?.times || []);
      setTuesday(data?.schedules[2]?.times || []);
      setWednesday(data?.schedules[3]?.times || []);
      setThursday(data?.schedules[4]?.times || []);
      setFriday(data?.schedules[5]?.times || []);
      setSaturday(data?.schedules[6]?.times || []);
      setAnytime(data.isAnytime);
      setEveryday(data.isEveryday);
      setUnlimited(data.isUnlimited);
      setFreeTicket(data.isFree);
      setIsCombo(data.isCombo);
      setComboNotes(data.comboNotes);
      setAvailable(data.isAvailable);
      setSaleFrom(data?.onSaleFrom || "");
      setStartDate(data?.startDate || "");
      setEndDate(data?.endDate || "");
      setSpecial(data?.specialSchedules || []);
      setDayOff(data?.dayOff || []);
      setGalleryPreview(data?.gallery || []);
      return {
        name: data.name,
        subname: data.subname,
        notes1: data.notes1,
        notes2: data.notes2,
        price: data.price,
        quota: data.quota,
        initialPreview: data?.gallery || []
      };
    }
    return null;
  }, [data, isLoading]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
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
    setContent(value);
  }, []);

  const onChangeContentEnglish = useCallback((value) => {
    setContentEnglish(value);
  }, []);

  const onChangeComboNotes = useCallback((value) => {
    setComboNotes(value);
  }, []);

  const handleSelectedDay = (val) => {
    const check = selectedDay.includes(val);
    if (check) {
      setSelectedDay((prev) =>
        prev.filter((d) => Number(d) !== Number(val))
      );
    } else {
      setSelectedDay((prev) => [...prev, Number(val)]);
    }
  };

  const hours = (start = 0, end = 24) => {
    const times = [];
    for (let hour = start; hour < end; hour++) {
      const formattedHour = String(hour).padStart(2, '0');
      times.push(formattedHour);
    }
    return times;
  };

  const minutes = (interval = 15) => {
    const times = [];
    for (let minute = 0; minute < 60; minute += interval) {
      const formattedMinute = String(minute).padStart(2, '0');
      times.push(formattedMinute);
    }
    return times;
  };

  const SelectOptions = ({ options, value, handleChange }) => {
    return (
      <select
        className="inline-block w-20 leading-5 relative py-2 pl-3 pr-8 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600 select-caret appearance-none capitalize"
        onChange={handleChange}
        value={value}
      >
        <option value="">--</option>
        {options?.map((option, index) => {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    )
  }

  const handleAddSchedules = () => {
    let selectedTime = {
      startTime: "",
      endTime: "",
      notes: ""
    }
    if (isCombo) {
      selectedTime = {
        startTime: "00:00",
        endTime: "00:00",
        notes: ""
      }
    }
    if (!isCombo) {
      if (sche.start[0] && sche.start[1] && sche.end[0] && sche.end[1]) {
        selectedTime = {
          startTime: `${sche.start[0]}:${sche.start[1]}`,
          endTime: `${sche.end[0]}:${sche.end[1]}`,
          notes: scheduleNotes
        }
      }
    }

    if (selectedTime.startTime && selectedTime.endTime) {
      if (selectedDay.includes(1)) {
        if (!monday.find(item => item.startTime === selectedTime.startTime && item.endTime === selectedTime.endTime)) {
          const updatedData = [
            ...monday,
            selectedTime
          ];
          updatedData.sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
          setMonday(updatedData);
        }
      }
      if (selectedDay.includes(2)) {
        if (!tuesday.find(item => item.startTime === selectedTime.startTime && item.endTime === selectedTime.endTime)) {
          const updatedData = [
            ...tuesday,
            selectedTime
          ];
          updatedData.sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
          setTuesday(updatedData);
        }
      }
      if (selectedDay.includes(3)) {
        if (!wednesday.find(item => item.startTime === selectedTime.startTime && item.endTime === selectedTime.endTime)) {
          const updatedData = [
            ...wednesday,
            selectedTime
          ];
          updatedData.sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
          setWednesday(updatedData);
        }
      }
      if (selectedDay.includes(4)) {
        if (!thursday.find(item => item.startTime === selectedTime.startTime && item.endTime === selectedTime.endTime)) {
          const updatedData = [
            ...thursday,
            selectedTime
          ];
          updatedData.sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
          setThursday(updatedData);
        }
      }
      if (selectedDay.includes(5)) {
        if (!friday.find(item => item.startTime === selectedTime.startTime && item.endTime === selectedTime.endTime)) {
          const updatedData = [
            ...friday,
            selectedTime
          ];
          updatedData.sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
          setFriday(updatedData);
        }
      }
      if (selectedDay.includes(6)) {
        if (!saturday.find(item => item.startTime === selectedTime.startTime && item.endTime === selectedTime.endTime)) {
          const updatedData = [
            ...saturday,
            selectedTime
          ];
          updatedData.sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
          setSaturday(updatedData);
        }
      }
      if (selectedDay.includes(0)) {
        if (!sunday.find(item => item.startTime === selectedTime.startTime && item.endTime === selectedTime.endTime)) {
          const updatedData = [
            ...sunday,
            selectedTime
          ];
          updatedData.sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
          setSunday(updatedData);
        }
      }
    }
  };

  const showSchedules = (d) => {
    let show = null;
    if (d === 1) {
      show = monday;
    }
    if (d === 2) {
      show = tuesday;
    }
    if (d === 3) {
      show = wednesday;
    }
    if (d === 4) {
      show = thursday;
    }
    if (d === 5) {
      show = friday;
    }
    if (d === 6) {
      show = saturday;
    }
    if (d === 0) {
      show = sunday;
    }
    return show;
  };

  const deleteSchedules = (d, idx) => {
    if (d === 1) {
      setMonday(prevData => prevData.filter((_, i) => i !== idx));
    }
    if (d === 2) {
      setTuesday(prevData => prevData.filter((_, i) => i !== idx));
    }
    if (d === 3) {
      setWednesday(prevData => prevData.filter((_, i) => i !== idx));
    }
    if (d === 4) {
      setThursday(prevData => prevData.filter((_, i) => i !== idx));
    }
    if (d === 5) {
      setFriday(prevData => prevData.filter((_, i) => i !== idx));
    }
    if (d === 6) {
      setSaturday(prevData => prevData.filter((_, i) => i !== idx));
    }
    if (d === 0) {
      setSunday(prevData => prevData.filter((_, i) => i !== idx));
    }
  };

  const handleAddSpecialSchedules = () => {
    let selectedTime = {
      startTime: "",
      endTime: "",
      notes: ""
    }
    if (isCombo) {
      selectedTime = {
        startTime: "00:00",
        endTime: "00:00",
        notes: ""
      }
    }
    if (!isCombo) {
      if (specialDate && specSche.start[0] && specSche.start[1] && specSche.end[0] && specSche.end[1]) {
        selectedTime = {
          startTime: `${specSche.start[0]}:${specSche.start[1]}`,
          endTime: `${specSche.end[0]}:${specSche.end[1]}`,
          notes: specialNotes
        }
      }
    }

    if (specialDate && selectedTime.startTime && selectedTime.endTime) {
      const newData = {
        date: new Date(specialDate).toISOString(),
        times: [
          {
            startTime: selectedTime.startTime,
            endTime: selectedTime.endTime,
            notes: selectedTime.notes
          },
        ],
      };

      // Check if the date already exists
      const dateIndex = special.findIndex((item) => item.date === newData.date);

      if (dateIndex !== -1) {
        // If date exists, add new time to the existing times array and sort times
        const updatedData = [...special];
        if (!updatedData[dateIndex].times.find(item => item.startTime === selectedTime.startTime && item.endTime === selectedTime.endTime)) {
          updatedData[dateIndex].times = [...updatedData[dateIndex].times, ...newData.times].sort(
            (a, b) => a.startTime.localeCompare(b.startTime)
          );
          setSpecial(updatedData);
        }
      } else {
        // If date does not exist, add the new data and sort by date
        const updatedData = [...special, newData].sort((a, b) => new Date(a.date) - new Date(b.date));
        setSpecial(updatedData);
      }
    }
  };

  const deleteSpecialSchedules = (data, idx, idt) => {
    if (data.times.length > 1) {
      const updatedData = [...special];
      updatedData[idx].times = updatedData[idx].times.filter((_, i) => i !== idt);
      setSpecial(updatedData);
    } else {
      setSpecial(prev => prev.filter((item) => item.date !== data.date));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedGallery((prevFiles) => [...prevFiles, ...files]);

    const filePreviews = files.map(file => ({ name: file.name, image: URL.createObjectURL(file), imageId: "" }));
    setGalleryPreview((prevPreviews) => [...prevPreviews, ...filePreviews]);
  };

  const handleRemoveGallery = (file, index) => {
    if (file.name) {
      setSelectedGallery(prev => prev.filter((item) => item.name !== file.name));
    }

    if (file.imageId) {
      setGalleryRemove((prevFiles) => [...prevFiles, file.imageId]);
    }

    setGalleryPreview(prev => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(data) {
    try {
      const dataSchedules = [
        { day: 0, times: sunday },
        { day: 1, times: monday },
        { day: 2, times: tuesday },
        { day: 3, times: wednesday },
        { day: 4, times: thursday },
        { day: 5, times: friday },
        { day: 6, times: saturday },
      ];

      const form = new FormData();
      for (let key in data) {
        form.append(key, data[key]);
      }
      if (image.length > 0) {
        form.append("image", image[0]);
      }
      if (imageSquare.length > 0) {
        form.append("imageSquare", imageSquare[0]);
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
      form.append("description", content);
      form.append("descriptionEN", contentEnglish);
      dataSchedules.forEach(item => {
        form.append(`schedules[${item.day}][day]`, item.day);
        item.times.forEach((time, index) => {
          form.append(`schedules[${item.day}][times][${index}][startTime]`, time.startTime);
          form.append(`schedules[${item.day}][times][${index}][endTime]`, time.endTime);
          form.append(`schedules[${item.day}][times][${index}][notes]`, time.notes);
        });
      });
      if (special.length > 0) {
        special.forEach((item, i) => {
          form.append(`specialSchedules[${i}][date]`, item.date);
          item.times.forEach((time, index) => {
            form.append(`specialSchedules[${i}][times][${index}][startTime]`, time.startTime);
            form.append(`specialSchedules[${i}][times][${index}][endTime]`, time.endTime);
            form.append(`specialSchedules[${i}][times][${index}][notes]`, time.notes);
          });
        });
      } else {
        form.append("specialSchedules", "reset");
      }
      if (dayOff.length > 0) {
        dayOff.forEach((item, i) => {
          form.append(`dayOff[${i}]`, item);
        });
      } else {
        form.append("dayOff", "reset");
      }
      form.append("isAnytime", anytime);
      form.append("isEveryday", everyday);
      form.append("isUnlimited", unlimited);
      form.append("isFree", freeTicket);
      form.append("isCombo", isCombo);
      form.append("comboNotes", isCombo ? comboNotes : "");
      form.append("isAvailable", available);
      form.append("onSaleFrom", saleFrom);
      form.append("startDate", startDate);
      form.append("endDate", endDate);

      await api.patch(`/ticket/${param.id}`, form);
      navigate("/dashboard/list-tickets");
      ticket.setEdit(true);
    } catch (error) {
      console.warn("Something went wrong");
      console.log(error);
      setError(true);
    }
  }

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Edit Ticket</p>
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
                <h3 className="font-bold text-xl mb-5">Informasi Tiket</h3>
                <div className="grid grid-cols-12 gap-5">
                  <div className="col-span-full lg:col-span-6">
                    <InputLabel
                      name="name"
                      id="name"
                      label="Ticket Name"
                      register={register}
                      required
                      error={errors?.name?.message}
                    />
                    <InputLabel
                      name="subname"
                      id="subname"
                      label="Subname"
                      register={register}
                      error={errors?.subname?.message}
                    />
                    <InputLabel
                      name="notes1"
                      id="notes1"
                      label="Notes 1"
                      register={register}
                      error={errors?.notes1?.message}
                    />
                    <InputLabel
                      name="notes2"
                      id="notes2"
                      label="Notes 2"
                      register={register}
                      error={errors?.notes2?.message}
                    />
                    <div className="flex justify-between items-center">
                      <p>Availability</p>
                      <Switch
                        onChange={() => setAvailable((prev) => !prev)}
                        checked={available}
                      />
                    </div>
                  </div>
                  <div className="col-span-full lg:col-span-6">
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
                    <div className="mb-3">
                      <p>Image for Mobile View (Max Size: 3MB)</p>
                      {insertNewImageSquare ? (
                        <>
                          <Uploader
                            state={(props) => {
                              setImageSquare(props);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setInsertNewImageSquare(false)}
                            className="text-sm underline text-primary-color"
                          >
                            Use Current Image
                          </button>
                        </>
                      ) : (
                        <PreviewImage
                          currentImage={data?.imageSquare}
                          setNewImage={(e) => setInsertNewImageSquare(e)}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-200 rounded my-5" />
                <h3 className="font-bold text-xl mb-5">Kuota dan Waktu</h3>
                <div className="grid grid-cols-12 gap-5">
                  <div className="col-span-full lg:col-span-6">
                    <div className="flex flex-col mb-1">
                      <p>Free Ticket</p>
                      <div className="flex items-center gap-5">
                        <Switch
                          onChange={(e) => {
                            setFreeTicket(e.target.checked);
                            if (e.target.checked) {
                              setValue("price", 0);
                            } else {
                              setValue("price", initializeValue.price);
                            }
                          }}
                          checked={freeTicket}
                        />
                        <div className="flex flex-col">
                          <p>Is Free?</p>
                          <span className="opacity-70">Activate this for free tickets</span>
                        </div>
                      </div>
                    </div>
                    <InputPrice
                      label="Price"
                      required={!freeTicket ? Boolean(true) : Boolean(false)}
                      disabled={freeTicket ? Boolean(true) : Boolean(false)}
                      onChange={(val) =>
                        setValue(
                          "price",
                          parseInt(
                            val.target.value.replace("Rp.", "").replace(/\./g, "")
                          )
                        )
                      }
                      value={currData.price}
                    />
                    <div className="flex flex-col mb-1">
                      <p>Quota</p>
                      <div className="flex items-center gap-5">
                        <Switch
                          onChange={(e) => {
                            setUnlimited(e.target.checked);
                            if (!e.target.checked) {
                              if (initializeValue.quota > 0) {
                                setValue("quota", initializeValue.quota);
                              }
                            } else {
                              setValue("quota", 0);
                            }
                          }}
                          checked={unlimited}
                        />
                        <div className="flex flex-col">
                          <p>Unlimited</p>
                          <span className="opacity-70">Activate this for unlimited tickets</span>
                        </div>
                      </div>
                    </div>
                    {unlimited ? (
                      <InputLabel
                        name="quota"
                        id="quota"
                        label="Insert Quantity"
                        value=""
                        disabled
                      />
                    ) : (
                      <InputLabel
                        name="quota"
                        id="quota"
                        label="Insert Quantity"
                        register={register}
                        type="number"
                        min={1}
                        required
                        error={errors?.quota?.message}
                      />
                    )}
                    <div className="my-5">
                      <div className="flex flex-col mb-1">
                        <p>Exhibition Period</p>
                        <div className="flex items-center gap-5">
                          <Switch
                            onChange={(e) => {
                              setEveryday(e.target.checked);
                            }}
                            checked={everyday}
                          />
                          <div className="flex flex-col">
                            <p>Is Everyday?</p>
                            <span className="opacity-70">Activate this if it's open every day</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row flex-wrap gap-3">
                        <div className="w-48">
                          <label htmlFor="startDate" className="inline-block mb-2 capitalize">
                            Start Date{" "}
                            {!everyday && <span className="text-red-500">*</span>}
                          </label>
                          <DatePicker
                            id="startDate"
                            className="w-full"
                            format="dd/MM/yyyy"
                            value={startDate}
                            onChange={(e) => setStartDate(e)}
                            clearIcon={null}
                            required={!everyday ? true : false}
                            disabled={everyday ? true : false}
                          />
                        </div>
                        <div className="w-48">
                          <label htmlFor="endDate" className="inline-block mb-2 capitalize">
                            End Date{" "}
                            {!everyday && <span className="text-red-500">*</span>}
                          </label>
                          <DatePicker
                            id="endDate"
                            className="w-full"
                            format="dd/MM/yyyy"
                            value={endDate}
                            onChange={(e) => setEndDate(e)}
                            clearIcon={null}
                            required={!everyday ? true : false}
                            disabled={everyday ? true : false}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-row flex-wrap items-end xl:justify-between gap-3">
                        <div className="flex flex-col mb-1">
                          <p>Tickets On Sale</p>
                          <div className="flex items-center gap-5">
                            <Switch
                              onChange={(e) => {
                                setAnytime(e.target.checked);
                                if (!e.target.checked) {
                                  setSaleFrom(initializeValue.onSaleFrom);
                                } else {
                                  setSaleFrom("");
                                }
                              }}
                              checked={anytime}
                            />
                            <div className="flex flex-col">
                              <p>Is Anytime?</p>
                              <span className="opacity-70">Activate this if tickets can be booked at any time</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-48">
                          <label htmlFor="saleFrom" className="inline-block mb-2 capitalize">
                            On Sale From{" "}
                            {!anytime && <span className="text-red-500">*</span>}
                          </label>
                          <DatePicker
                            id="saleFrom"
                            className="w-full"
                            format="dd/MM/yyyy"
                            value={saleFrom}
                            onChange={(e) => setSaleFrom(e)}
                            clearIcon={null}
                            required={!anytime ? true : false}
                            disabled={anytime ? true : false}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="my-3">
                      <div className="flex flex-col">
                        <p>Combo Ticket</p>
                        <div className="flex items-center gap-5">
                          <Switch
                            onChange={(e) => setIsCombo(e.target.checked)}
                            checked={isCombo}
                          />
                          <div className="flex flex-col">
                            <p>Is Combo?</p>
                            <span className="opacity-70">Activate this for combo ticket</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {isCombo && (
                      <div>
                        <p>Combo Notes</p>
                        <SimpleMDE
                          value={comboNotes}
                          onChange={onChangeComboNotes}
                        />
                      </div>
                    )}
                  </div>
                  <div className="col-span-full lg:col-span-6">
                    <div>
                      <p>Schedules</p>
                      <div className="mb-2">
                        <div className="flex flex-row flex-wrap gap-3 mb-3">
                          {choiceOfDays.map((item, i) => (
                            <button
                              key={i}
                              className={
                                `py-2 px-4 w-24 rounded
                                  ${selectedDay.includes(Number(item.value)) ?
                                  " bg-primary-color text-white" :
                                  " outline outline-1 outline-primary-color text-black"}`
                              }
                              type="button"
                              onClick={() => handleSelectedDay(item.value)}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-row flex-wrap items-center gap-1">
                          {isCombo ? (
                            <input
                              className="leading-5 relative py-2 px-4 rounded text-gray-800 bg-gray-200 border border-gray-300 overflow-x-auto dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600"
                              disabled
                              value={validFor}
                            />
                          ) : (
                            <>
                              <input
                                className="w-80 leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600"
                                id="scheduleNotes"
                                name="scheduleNotes"
                                placeholder="Notes (Max 30 Char)"
                                maxLength={30}
                                onChange={(e) => setScheduleNotes(e.target.value)}
                              />
                              <SelectOptions
                                options={hours(7, 24)}
                                handleChange={(e) => {
                                  setSche(prev => {
                                    const newData = [...prev.start];
                                    newData[0] = e.target.value;
                                    return { ...prev, start: newData };
                                  });
                                }}
                                value={sche.start[0]}
                              />
                              <SelectOptions
                                options={minutes()}
                                handleChange={(e) => {
                                  setSche(prev => {
                                    const newData = [...prev.start];
                                    newData[1] = e.target.value;
                                    return { ...prev, start: newData };
                                  });
                                }}
                                value={sche.start[1]}
                              />
                              <p className="mx-2">to</p>
                              <SelectOptions
                                options={hours(7, 24)}
                                handleChange={(e) => {
                                  setSche(prev => {
                                    const newData = [...prev.end];
                                    newData[0] = e.target.value;
                                    return { ...prev, end: newData };
                                  });
                                }}
                                value={sche.end[0]}
                              />
                              <SelectOptions
                                options={minutes()}
                                handleChange={(e) => {
                                  setSche(prev => {
                                    const newData = [...prev.end];
                                    newData[1] = e.target.value;
                                    return { ...prev, end: newData };
                                  });
                                }}
                                value={sche.end[1]}
                              />
                            </>
                          )}
                          <Button
                            color="gold"
                            onClick={() => handleAddSchedules()}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div>
                        <table width="100%">
                          <tbody>
                            {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                              <tr key={d}>
                                <td className="text-center px-2 py-4 w-20 bg-secondary-color border-b-2 border-pink-300">
                                  {choiceOfDays.find((c) => c.value === d)?.label}
                                </td>
                                <td className="p-2 border-b-2 border-gray-300">
                                  <div className="flex flex-row flex-wrap gap-3">
                                    {showSchedules(d).length > 0 ? (
                                      showSchedules(d).map((item, index) => (
                                        <div key={index} className="text-center outline outline-1 outline-primary-color text-black py-2 px-4 rounded">
                                          <div className="flex flex-row items-center gap-2">
                                            {isCombo ? (
                                              <span>{validFor}</span>
                                            ) : (
                                              <span>{`${item.startTime} - ${item.endTime} ${item.notes && `| ${item.notes}`}`}</span>
                                            )}
                                            <button
                                              className="p-1 h-6 rounded bg-primary-color text-white"
                                              type="button"
                                              onClick={() => deleteSchedules(d, index)}
                                            >
                                              <Trash />
                                            </button>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <em>No data</em>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="my-5">
                      <p>Special Schedules</p>
                      <div className="mb-2">
                        <div className="flex flex-row flex-wrap items-center gap-1 mb-2">
                          <DatePicker
                            id="specialDate"
                            className="w-48"
                            format="dd/MM/yyyy"
                            value={specialDate}
                            onChange={(e) => setSpecialDate(e)}
                          />
                          {isCombo ? (
                            <>
                              <input
                                className="leading-5 relative py-2 px-4 rounded text-gray-800 bg-gray-200 border border-gray-300 overflow-x-auto dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600"
                                disabled
                                value={validFor}
                              />
                              <Button
                                color="gold"
                                onClick={() => handleAddSpecialSchedules()}
                              >
                                +
                              </Button>
                            </>
                          ) : (
                            <input
                              className="w-80 leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600"
                              id="scheduleNotes"
                              name="scheduleNotes"
                              placeholder="Notes (Max 30 Char)"
                              maxLength={30}
                              onChange={(e) => setSpecialNotes(e.target.value)}
                            />
                          )}
                        </div>
                        {!isCombo && (
                          <div className="flex flex-row flex-wrap items-center gap-1">
                            <SelectOptions
                              options={hours(7, 24)}
                              handleChange={(e) => {
                                setSpecSche(prev => {
                                  const newData = [...prev.start];
                                  newData[0] = e.target.value;
                                  return { ...prev, start: newData };
                                });
                              }}
                              value={specSche.start[0]}
                            />
                            <SelectOptions
                              options={minutes()}
                              handleChange={(e) => {
                                setSpecSche(prev => {
                                  const newData = [...prev.start];
                                  newData[1] = e.target.value;
                                  return { ...prev, start: newData };
                                });
                              }}
                              value={specSche.start[1]}
                            />
                            <p className="mx-2">to</p>
                            <SelectOptions
                              options={hours(7, 24)}
                              handleChange={(e) => {
                                setSpecSche(prev => {
                                  const newData = [...prev.end];
                                  newData[0] = e.target.value;
                                  return { ...prev, end: newData };
                                });
                              }}
                              value={specSche.end[0]}
                            />
                            <SelectOptions
                              options={minutes()}
                              handleChange={(e) => {
                                setSpecSche(prev => {
                                  const newData = [...prev.end];
                                  newData[1] = e.target.value;
                                  return { ...prev, end: newData };
                                });
                              }}
                              value={specSche.end[1]}
                            />

                            <Button
                              color="gold"
                              onClick={() => handleAddSpecialSchedules()}
                            >
                              +
                            </Button>
                          </div>
                        )}
                      </div>
                      <div>
                        <table width="100%">
                          <tbody>
                            {special.length > 0 ? (
                              special.map((sd, idx) => (
                                <tr key={idx}>
                                  <td className="text-center px-2 py-4 w-20 bg-secondary-color border-b-2 border-pink-300">
                                    {formatDate(sd.date)}
                                  </td>
                                  <td className="p-2 border-b-2 border-gray-300">
                                    <div className="flex flex-row flex-wrap gap-3">
                                      {sd.times.map((item, index) => (
                                        <div key={index} className="text-center outline outline-1 outline-primary-color text-black py-2 px-4 rounded">
                                          <div className="flex flex-row items-center gap-2">
                                            {isCombo ? (
                                              <span>{validFor}</span>
                                            ) : (
                                              <span>{`${item.startTime} - ${item.endTime} ${item.notes && `| ${item.notes}`}`}</span>
                                            )}
                                            <button
                                              className="p-1 h-6 rounded bg-primary-color text-white"
                                              type="button"
                                              onClick={() => deleteSpecialSchedules(sd, idx, index)}
                                            >
                                              <Trash />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td className="text-center px-2 py-4 w-20 bg-secondary-color border-b-2 border-pink-300">
                                  -
                                </td>
                                <td className="p-2 border-b-2 border-gray-300">
                                  <em>No data</em>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="my-5">
                      <p>Special Day Off</p>
                      <div className="mb-2">
                        <div className="flex flex-row flex-wrap items-center gap-1 mb-2">
                          <DatePicker
                            id="specialDate"
                            className="w-48"
                            format="dd/MM/yyyy"
                            value={dayOffDate}
                            onChange={(e) => setDayOffDate(e)}
                          />
                          <Button
                            color="gold"
                            onClick={() => {
                              if (dayOffDate) {
                                if (!dayOff.includes(new Date(dayOffDate).toISOString())) {
                                  setDayOff(prev => {
                                    const newDates = [...prev, new Date(dayOffDate).toISOString()];
                                    return newDates.sort((a, b) => new Date(a) - new Date(b));
                                  });
                                }
                              }
                            }}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div>
                        <table width="100%">
                          <tbody>
                            <tr>
                              <td className="text-center px-2 py-4 w-20 bg-secondary-color border-b-2 border-pink-300">
                                Dates
                              </td>
                              <td className="p-2 border-b-2 border-gray-300">
                                <div className="flex flex-row flex-wrap gap-3">
                                  {dayOff.length > 0 ? (
                                    dayOff.map((item, index) => (
                                      <div key={index} className="text-center outline outline-1 outline-primary-color text-black py-2 px-4 rounded">
                                        <div className="flex flex-row items-center gap-2">
                                          <span>{formatDate(item)}</span>
                                          <button
                                            className="p-1 h-6 rounded bg-primary-color text-white"
                                            type="button"
                                            onClick={() => setDayOff(prev => prev.filter((_, i) => i !== index))}
                                          >
                                            <Trash />
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <em>No data</em>
                                  )}
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-200 rounded my-5" />
                <h3 className="font-bold text-xl mb-5">Detail Tiket</h3>
                <div className="grid grid-cols-12 gap-5">
                  <div className="col-span-full lg:col-span-6">
                    <div>
                      <p>Description</p>
                      <SimpleMDE
                        value={content}
                        onChange={onChangeContent}
                      />
                    </div>
                    <div>
                      <p>Description (English Version)</p>
                      <SimpleMDE
                        value={contentEnglish}
                        onChange={onChangeContentEnglish}
                      />
                    </div>
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
                        {galleryPreview.length > 0 && (
                          galleryPreview.map((item, g) => (
                            <div key={g} className="relative flex items-center justify-center">
                              <img src={item.image} className="border-2 border-gray-200 rounded-md w-48 h-48 object-cover" />
                              <button
                                className="absolute right-2 bottom-2 p-1 h-6 rounded bg-primary-color text-white"
                                type="button"
                                onClick={() => handleRemoveGallery(item, g)}
                              >
                                <Trash />
                              </button>
                            </div>
                          ))
                        )}
                        {galleryPreview.length < 10 && (
                          <label htmlFor="image-upload" className="cursor-pointer">
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
                </div>

                <div className="flex justify-end items-center space-x-3.5 mt-8">
                  <Link to="/dashboard/list-tickets">
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
