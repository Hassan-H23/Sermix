"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { contactSchema, type ContactInput } from "@/lib/forms/schemas";
import { Input, Textarea, Label, FieldError } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const tErr = useTranslations("contact.form.errors");
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (data) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("submit_failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  });

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border border-border bg-surface p-8"
      >
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
          {t("successEyebrow")}
        </p>
        <h3
          className="mt-3 text-fg font-extrabold leading-[1.1]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-h2)",
            letterSpacing: "-0.02em",
          }}
        >
          {t("successTitle")}
        </h3>
        <p className="mt-3 max-w-[52ch] text-base text-fg-muted">
          {t("successBody")}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex h-12 items-center border-b border-fg/30 pb-1 text-sm font-medium tracking-tight text-fg hover:border-accent hover:text-accent transition-colors"
        >
          {t("successReset")}
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name" required>
            {t("name")}
          </Label>
          <Input
            id="contact-name"
            type="text"
            autoComplete="name"
            invalid={!!errors.name}
            {...register("name")}
          />
          <FieldError
            message={errors.name ? tErr(errors.name.message ?? "generic") : undefined}
          />
        </div>
        <div>
          <Label htmlFor="contact-company">{t("company")}</Label>
          <Input
            id="contact-company"
            type="text"
            autoComplete="organization"
            {...register("company")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-email" required>
            {t("email")}
          </Label>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError
            message={errors.email ? tErr(errors.email.message ?? "generic") : undefined}
          />
        </div>
        <div>
          <Label htmlFor="contact-phone" required>
            {t("phone")}
          </Label>
          <Input
            id="contact-phone"
            type="tel"
            dir="ltr"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+20 100 000 0000"
            invalid={!!errors.phone}
            {...register("phone")}
          />
          <FieldError
            message={errors.phone ? tErr(errors.phone.message ?? "generic") : undefined}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="contact-message" required>
          {t("message")}
        </Label>
        <Textarea
          id="contact-message"
          rows={6}
          invalid={!!errors.message}
          {...register("message")}
        />
        <FieldError
          message={errors.message ? tErr(errors.message.message ?? "generic") : undefined}
        />
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? t("submitting") : t("submit")}
        </Button>
        {status === "error" && (
          <p role="alert" className="text-sm text-accent">
            {t("errors.submitFailed")}
          </p>
        )}
      </div>
    </form>
  );
}
