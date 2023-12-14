"use client";
import { useSession } from "next-auth/react";
import React, { BaseSyntheticEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import useSWR from "swr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faExclamation } from "@fortawesome/free-solid-svg-icons/faExclamation";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons/faFloppyDisk";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminSettingPage() {
  const session: any = useSession();
  const [canLogin, setCanLogin] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openHours, setOpenHours] = useState("00:00:00");
  const [closeHours, setCloseHours] = useState("00:00:00");
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const { data, mutate } = useSWR(
    `/api/admins/${session.data?.user.username}/settings?license=${session.data?.user.license_key}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const handleSubmit = async () => {
    const res = await fetch(
      `/api/admins/${session?.data?.user.username}/settings?license=${session?.data?.user?.license_key}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          canCreate: canCreate,
          canLogin: canLogin,
          canUpdate: canUpdate,
          canDelete: canDelete,
          openHours: openHours,
          closeHours: closeHours,
        }),
      }
    );
    const result = await res.json();
    if (!res.ok && res.status !== 200) {
      setErrMsg(result?.message);
    }
    setIsLoading(false);
    mutate(data);
    setSettings();
    return setSuccess(res.ok && res.status === 200);
  };

  const ShowConfirm = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    Swal.fire({
      title: "Are you sure to change this Settings?",
      icon: "warning",
      width: 700,
      html: "After you change it, your all Employee will be configured with this Settings",
      showConfirmButton: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setSuccess(false);
        setIsLoading(true);
        setErrMsg("");
        return setTimeout(() => {
          return handleSubmit();
        }, 500);
      }
      if (result.isDismissed) {
        setSuccess(false);
        setIsLoading(false);
        setSettings();
        setErrMsg("");
      }
    });
  };

  const setSettings = () => {
    setCanLogin(data?.settings?.emp_can_login ?? false);
    setCanCreate(data?.settings?.emp_can_create ?? false);
    setCanUpdate(data?.settings?.emp_can_update ?? false);
    setCanDelete(data?.settings?.emp_can_delete ?? false);
    setOpenHours(data?.settings?.openHours ?? "00:00:00");
    setCloseHours(data?.settings?.closeHours ?? "00:00:00");
  };

  useEffect(() => {
    setSettings();
  }, [data]);
  return (
    <>
      <div className="flex flex-col justify-center mt-2 p-4 bg-white rounded-md shadow-lg">
        <div className="flex justify-start py-3 px-4">
          <p className="text-2xl font-semibold">Settings</p>
        </div>
        {success && (
          <div
            className="relative flex w-full items-center py-4 px-3 text-sm font-bold text-white bg-green-400 rounded-lg"
            role="alert"
          >
            <div className="w-4 h-4 mr-4">
              <FontAwesomeIcon icon={faCheck} />
            </div>
            <p>Saved Successfully</p>
          </div>
        )}
        {errMsg && (
          <div
            className="relative flex w-full items-center py-4 px-3 text-sm font-bold text-white bg-red-500 rounded-lg"
            role="alert"
          >
            <div className="w-4 h-4 mr-4">
              <FontAwesomeIcon icon={faExclamation} />
            </div>
            <p>{errMsg}</p>
          </div>
        )}
        <div className="flex flex-col justify-start px-4 py-3">
          <form action="" method="post" onSubmit={(e) => ShowConfirm(e)}>
            <div className="grid grid-cols-4 gap-5">
              <div className="col-span-2 flex flex-col">
                <div className="flex items-center gap-3">
                  <div className="rtl">
                    <label
                      className="relative inline-flex items-center me-5 cursor-pointer"
                      htmlFor="chk_emp_can_login"
                    >
                      <input
                        type="checkbox"
                        name="chk_emp_can_login"
                        className="sr-only peer"
                        onChange={(e) => setCanLogin(e.target.checked)}
                        checked={canLogin}
                        id="chk_emp_can_login"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                      <div className="ms-3 text-sm text-posgray">
                        Employee Can Login
                      </div>
                    </label>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-black/40 w-full">
                    This option make your all Employee can login in this Web App
                  </p>
                </div>
              </div>
              <div className="col-span-2 flex flex-col">
                <div className="flex items-center gap-3">
                  <div className="rtl">
                    <label
                      className="relative inline-flex items-center me-5 cursor-pointer"
                      htmlFor="chk_emp_can_create"
                    >
                      <input
                        type="checkbox"
                        name="chk_emp_can_create"
                        className="sr-only peer"
                        onChange={(e) => setCanCreate(e.target.checked)}
                        id="chk_emp_can_create"
                        checked={canCreate}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                      <div className="ms-3 text-sm text-posgray">
                        Employee Can Create Product
                      </div>
                    </label>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-black/40 w-full">
                    This option make your all Employee can Create the product in
                    Your Bussiness
                  </p>
                </div>
              </div>
              <div className="col-span-2 flex flex-col">
                <div className="flex items-center gap-3">
                  <label
                    className="relative inline-flex items-center me-5 cursor-pointer"
                    htmlFor="chk_emp_can_update"
                  >
                    <input
                      type="checkbox"
                      name="chk_emp_can_update"
                      className="sr-only peer"
                      onChange={(e) => setCanUpdate(e.target.checked)}
                      id="chk_emp_can_update"
                      checked={canUpdate}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                    <div className="ms-3 text-sm text-posgray">
                      Employee Can Update Product
                    </div>
                  </label>
                </div>
                <div>
                  <p className="text-sm text-black/40 w-full mt-2">
                    This option make your all Employee can Update the product in
                    Your Bussiness
                  </p>
                </div>
              </div>
              <div className="col-span-2 flex flex-col">
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center me-5 cursor-pointer">
                    <input
                      type="checkbox"
                      name="chk_emp_can_delete"
                      className="sr-only peer"
                      onChange={(e) => setCanDelete(e.target.checked)}
                      id="chk_emp_can_delete"
                      checked={canDelete}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                    <label
                      htmlFor="chk_emp_can_delete"
                      className="ms-3 text-sm text-posgray"
                    >
                      Employee Can{" "}
                      <span className="text-red-600">Delete Product</span>
                    </label>
                  </label>
                </div>
                <div>
                  <p className="text-sm text-black/40 w-full mt-2">
                    This option make your all Employee can Delete the product in
                    Your Bussiness.{" "}
                    <span className="text-red-600">
                      Please configure this option to avoid of{" "}
                      <span className="font-semibold">Deleted Products</span>
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-span-4 flex flex-col justify-center w-full mt-4">
                <div className="flex items-center gap-5">
                  <div className="col-span-2 flex flex-row w-full items-center">
                    <input
                      type="time"
                      name="shop-open-time"
                      value={openHours}
                      onChange={(e) => setOpenHours(e.target.value)}
                      className="outline outline-1 w-[120px] h-[40px] outline-gray-600 rounded p-3"
                      id=""
                    />
                    <span className="ml-4">Shop Open Time</span>
                  </div>
                  <div className="col-span-2 flex flex-row w-full items-center">
                    <input
                      type="time"
                      name="close-open-time"
                      value={closeHours}
                      onChange={(e) => setCloseHours(e.target.value)}
                      className="outline outline-1 w-[120px] h-[40px] outline-gray-600 rounded p-3"
                      id=""
                    />
                    <span className="ml-4">Close Open Time</span>
                  </div>
                </div>
                <span className="ml-2 mt-2">
                  This option make your shop open time configured,{" "}
                  <span className="text-red-600">
                    to restrict employee has login outside open time
                  </span>
                </span>
              </div>
              <div className="flex justify-start p-2 font-semibold">
                <button
                  disabled={isLoading}
                  className="w-[110px] h-[50px] flex items-center gap-3 justify-center rounded-full bg-posblue text-black hover:bg-teal-500 hover:text-white px-3 py-1  transition"
                  type="submit"
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
