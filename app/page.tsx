"use client";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [role, setRole] = useState("employee");
  const [wrong, setWrong] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLicense, setHasLicense] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const router = useRouter();
  const handleSelectRole = (string: string) => {
    if (role === string) return;
    return setRole(string);
  };
  const handleSubmit = async (data: FormData) => {
    const res = await signIn("credentials", {
      username: data.get("username"),
      password: data.get("password"),
      license_key: localStorage.getItem("license_key"),
      role: role,
      redirect: false,
    });
    setWrong(!res?.ok ?? false);
    if (res?.ok && res.status === 200) return router.push("admins/dashboard");
    setIsLoading(false);
    return checkLicenseKey();
  };

  const handleLicenseKey = async () => {
    const key = !licenseKey ? localStorage.getItem("license_key") : licenseKey;
    const res = await fetch("/api/license", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        license_key: key,
      }),
    });
    setIsLoading(false);
    setIsLogin(true);
    const result = await res.json();
    if (!res.ok && res.status !== 200) {
      setHasLicense(res.status === 200);
      return setErrMsg(result?.message ?? "Internal Server Error");
    }

    localStorage.setItem("license_key", result?.client.license_key);
    localStorage.setItem("client_code", result?.client.client_code);
    setHasLicense(true);
    return;
  };

  const checkLicenseKey = () => {
    if (!localStorage.getItem("license_key")) return setHasLicense(false);
    return handleLicenseKey();
  };
  useEffect(() => {
    checkLicenseKey();
  }, []);

  return (
    <>
      <main className="bg-poslight flex justify-center w-screen h-screen static">
        {!hasLicense && (
          <div className="absolute top-0 left-0 w-screen h-screen z-999 bg-gray-900/40 rounded p-3 backdrop-blur-sm ">
            <div className="flex flex-col justify-center items-center h-full gap-5">
              {!localStorage.getItem("license_key") && (
                <span className="font-bold text-white">
                  I think you has a first time use this web app. to Confirm your
                  identity, please insert your license key
                </span>
              )}
              <form
                action=""
                method="post"
                onSubmit={(e) => {
                  e.preventDefault();
                  setErrMsg("");
                  setIsLogin(false);
                  setIsLoading(true);
                  setTimeout(() => {
                    return handleLicenseKey();
                  }, 500);
                }}
              >
                {errMsg && (
                  <span className="bg-red-600 text-white rounded">
                    {errMsg}
                  </span>
                )}
                <div className="flex justify-center">
                  <input
                    type="text"
                    required
                    name="license_key"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                    className="bg-white w-[500px] shadow-md rounded-l px-3 p-3 outline  outline-blue-600 focus:outline-gray-600 transition outline-1"
                    placeholder="Input your License Key"
                    autoFocus
                  />
                  <button
                    className="justify-center bg-green-600 rounded-r p-3 hover:bg-green-700 transition disabled:bg-green-700 text-white"
                    disabled={isLoading && !isLogin}
                  >
                    {isLoading && !isLogin ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <section className="flex items-center text-white inline-block">
          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              setIsLoading(true);
              const formdata = new FormData(e.currentTarget);
              setTimeout(() => {
                return handleSubmit(formdata);
              }, 500);
            }}
          >
            <div className="flex flex-col w-[500px] h-[460px] justify-center items-center rounded-[10px] shadow-md  p-3 bg-posgray gap-3">
              <div className="w-[45px] h-[60px] relative">
                <Image
                  src="/images/logo.png"
                  alt="Logo Last Station"
                  width={45}
                  height={61}
                />
              </div>
              <h1 className="text-center text-white text-2xl font-semibold font-['Montserrat']">
                Login
              </h1>
              {wrong && (
                <div
                  className=" w-[420px] h-[35px] relative flex items-center px-4 py-2 text-sm font-bold text-white bg-red-500 rounded"
                  role="alert"
                >
                  <p>Username or Password is Wrong</p>
                </div>
              )}
              <div className="flex flex-col w-[400px] h-[160px] gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="username"
                    className="text-white text-medium font-semibold font-['montserrat']"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className="w-[400px] h-[35px] rounded-[5px] bg-poslight px-3 outline outline-1 outline-posblue text-black"
                    placeholder="Input your Username"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="password"
                    className="text-white text-base font-semibold font-['montserrat']"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="w-[400px] h-[35px] rounded-[5px] bg-poslight  px-3 outline outline-1 outline-posblue text-black"
                    placeholder="Input your Password"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-x-8 ">
                <div
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={(e) => handleSelectRole("employee")}
                >
                  <input
                    type="checkbox"
                    name="employee"
                    className="focus:ring-0"
                    id="chk-emp"
                    checked={role === "employee"}
                    readOnly
                  />
                  <label htmlFor="chk-emp">As Employee</label>
                </div>
                <div
                  className="flex gap-2 items-center  cursor-pointer"
                  onClick={(e) => handleSelectRole("admin")}
                >
                  <input
                    type="checkbox"
                    name="admin"
                    className="focus:ring-0"
                    id="chk-adm"
                    checked={role === "admin"}
                    readOnly
                  />
                  <label htmlFor="chk-adm">As Admin</label>
                </div>
              </div>
              <button
                className="justify-center bg-posblue rounded-xl w-[400px] px-4 py-2 text-center text-white text-base font-medium font-['montserrat']"
                disabled={isLoading && isLogin}
              >
                {isLoading && isLogin ? "Signing..." : "Sign In"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
