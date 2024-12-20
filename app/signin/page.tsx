"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { LuLoaderCircle } from "react-icons/lu";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const { data: session } = useSession();
  if (session) {
    redirect("/");
  }
  return (
    <div
      className={
        "h-screen w-full flex items-center justify-center flex-col gap-y-5"
      }
    >
      <form
        action={async (formData) => {
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;
          await signIn.email({
            email,
            password,
            callbackURL: "/dashboard",
            fetchOptions: {
              onResponse: () => {
                setLoading(false);
              },
              onRequest: () => {
                setLoading(true);
              },
              onError: (ctx) => {
                toast.error(ctx.error.message);
              },
            },
          });
        }}
        className={"flex flex-col gap-5 w-[30%]"}
      >
        <Input placeholder="Email" type={"email"} name="email" required />
        <Input
          placeholder="Password"
          type={"password"}
          name="password"
          required
        />
        <Button type={"submit"} disabled={loading}>
          {loading ? <LuLoaderCircle className="animate-spin" /> : "Sign in"}
        </Button>
      </form>
      <div className="w-[30%] flex flex-col gap-y-3">
        <form
          action={async () => {
            await signIn.social({
              provider: "google",
              callbackURL: "/dashboard",
              fetchOptions: {
                onResponse: () => {
                  setLoadingGoogle(false);
                },
                onRequest: () => {
                  setLoadingGoogle(true);
                },
                onError: (ctx) => {
                  toast.error(ctx.error.message);
                },
              },
            });
          }}
        >
          <Button
            type="submit"
            className="w-full"
            disabled={loadingGoogle}
            variant={"secondary"}
          >
            {loadingGoogle ? (
              <LuLoaderCircle className="animate-spin" />
            ) : (
              "Sign in with Google"
            )}
          </Button>
        </form>
        <form
          action={async () => {
            await signIn.social({
              provider: "github",
              callbackURL: "/dashboard",
              fetchOptions: {
                onResponse: () => {
                  setLoadingGithub(false);
                },
                onRequest: () => {
                  setLoadingGithub(true);
                },
                onError: (ctx) => {
                  toast.error(ctx.error.message);
                },
              },
            });
          }}
        >
          <Button
            type="submit"
            className="w-full"
            variant={"secondary"}
            disabled={loadingGithub}
          >
            {loadingGithub ? (
              <LuLoaderCircle className="animate-spin" />
            ) : (
              "Sign in with GitHub"
            )}
          </Button>
        </form>
      </div>
      <h1>
        Dont have an account?<Link href="/signup"> Sign up</Link>
      </h1>
    </div>
  );
};

export default Page;
