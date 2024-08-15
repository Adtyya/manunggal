import React, { useState, useEffect } from "react";
import {
  BoxArrowRight,
  List,
  FilterLeft,
} from "react-bootstrap-icons";
import { DropdownUser } from "@/components/reactdash-ui";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "react-query";
import { api } from "@/utils/axios";
import useInformationUser from "../global/useInformationUser";

export default function NavbarAdmin(props) {
  // Set toggle dark
  const hook = useInformationUser();
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Menggunakan useEffect untuk memantau perubahan token dan memperbarui state token
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  // Menggunakan useQuery untuk mengambil data pengguna
  const { data } = useQuery(
    "userInfo",
    async () => {
      try {
        if (!token) return; // Jangan jalankan query jika token tidak tersedia
        const res = await api.get(`/user/${jwtDecode(token)?._id}`);
        hook.setRole(res?.data?.role);
        hook.setAll(res?.data);
        return res?.data;
      } catch (error) {
        return error;
      }
    },
    {
      enabled: !!token, // Hanya menjalankan query jika token ada
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: "always", // Selalu muat ulang data saat komponen dipasang
    }
  );

  // Daftar dropdown user
  const data_dropdown_user = [
    { title: "Sign Out", url: "#", icon: <BoxArrowRight /> },
  ];

  return (
    <nav
      className="navtop-area z-50 fixed flex flex-row flex-nowrap items-center justify-between mt-0 py-1 px-6 bg-white dark:bg-gray-800 shadow-sm transition-all duration-500 ease-in-out"
      id="desktop-menu"
    >
      {/* Tombol toggle */}
      <button
        onClick={props.dataToggle}
        id="navbartoggle"
        type="button"
        className="inline-flex items-center justify-center text-gray-800 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none focus:ring-0"
      >
        <span className="sr-only">Mobile menu</span>
        <List className="sidenav-hidden h-8 w-8" />
        <FilterLeft className="sidenav-block h-8 w-8" />
      </button>

      {/* Menu atas */}
      <ul className="flex ltr:ml-auto rtl:mr-auto mt-2">
        <li className="relative">
          <DropdownUser data={data_dropdown_user} user={data} />
        </li>
      </ul>
    </nav>
  );
}
