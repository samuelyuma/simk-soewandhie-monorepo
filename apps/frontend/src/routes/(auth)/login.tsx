import { createFileRoute, redirect } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";

import { useLoginMutation } from "@/api/mutation/login";
import InputForm from "@/components/form/InputForm";
import { Button } from "@/components/ui/button";
import type { AuthRequest } from "@/types/user";

export const Route = createFileRoute("/(auth)/login")({
  beforeLoad: ({ context }) => {
    if (context.auth.status === "AUTHENTICATED") {
      if (context.auth.user.role === "ADMIN") {
        throw redirect({
          to: "/pptk",
        });
      } else {
        throw redirect({
          to: "/superadmin",
        });
      }
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const methods = useForm<AuthRequest>({
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { handleSubmit, reset } = methods;

  const { mutateAsync, isPending } = useLoginMutation();

  function onSubmit(data: AuthRequest) {
    mutateAsync(data);
    reset();
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-[0.7] lg:flex">
        <img
          src="/imgs/bg-login.png"
          alt="surabaya-bg-login"
          className="object-cover"
        />
      </div>
      <div
        className="flex w-full flex-col items-center justify-center lg:flex-[0.3]"
        style={{ backgroundImage: "url(/imgs/pattern-login.png)" }}
      >
        <img src="/imgs/logo-pemkot-sby.png" alt="logo-pemkot-surabaya" />
        <p className="my-5 text-center font-bold text-3xl text-blue-600">
          E-Payment
          <br />
          Surabaya
        </p>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center justify-center gap-4 px-20"
          >
            <InputForm
              name="username"
              label="Username"
              type="text"
              isRequired
              classNames={{
                wrapper: "w-full",
                content: "bg-white",
              }}
            />
            <InputForm
              name="password"
              label="Password"
              type="password"
              isRequired
              classNames={{
                wrapper: "w-full",
                content: "bg-white",
              }}
            />
            <Button
              className="w-full"
              variant={"blue"}
              isLoading={isPending}
              disabled={isPending}
            >
              Login
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
