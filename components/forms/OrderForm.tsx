"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  orderSchema,
  concreteGrades,
  type OrderInput,
} from "@/lib/forms/schemas";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function OrderForm() {
  const t = useTranslations("order.form");
  const tErr = useTranslations("order.form.errors");
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderInput>({
    resolver: zodResolver(orderSchema),
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (data) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/order", {
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
        <p className="mt-3 max-w-[58ch] text-base text-fg-muted">
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
    <form noValidate onSubmit={onSubmit} className="space-y-12">
      <Fieldset legend={t("sections.project")}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="order-projectName" required>
              {t("projectName")}
            </Label>
            <Input
              id="order-projectName"
              type="text"
              invalid={!!errors.projectName}
              {...register("projectName")}
            />
            <FieldError
              message={
                errors.projectName ? tErr(errors.projectName.message ?? "generic") : undefined
              }
            />
          </div>
          <div>
            <Label htmlFor="order-projectLocation" required>
              {t("projectLocation")}
            </Label>
            <Input
              id="order-projectLocation"
              type="text"
              autoComplete="street-address"
              invalid={!!errors.projectLocation}
              {...register("projectLocation")}
            />
            <FieldError
              message={
                errors.projectLocation
                  ? tErr(errors.projectLocation.message ?? "generic")
                  : undefined
              }
            />
          </div>
          <div>
            <Label htmlFor="order-contractor">{t("contractor")}</Label>
            <Input
              id="order-contractor"
              type="text"
              autoComplete="organization"
              {...register("contractor")}
            />
          </div>
        </div>
      </Fieldset>

      <Fieldset legend={t("sections.spec")}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <Label htmlFor="order-grade" required>
              {t("grade")}
            </Label>
            <Select id="order-grade" invalid={!!errors.grade} {...register("grade")}>
              <option value="">{t("gradePlaceholder")}</option>
              {concreteGrades.map((g) => (
                <option key={g} value={g}>
                  {g === "other" ? t("gradeOther") : g}
                </option>
              ))}
            </Select>
            <FieldError
              message={errors.grade ? tErr(errors.grade.message ?? "generic") : undefined}
            />
          </div>
          <div>
            <Label htmlFor="order-volumeM3" required>
              {t("volume")}
            </Label>
            <Input
              id="order-volumeM3"
              type="number"
              min={1}
              step="1"
              inputMode="numeric"
              dir="ltr"
              placeholder="e.g. 80"
              invalid={!!errors.volumeM3}
              {...register("volumeM3", { valueAsNumber: true })}
            />
            <FieldError
              message={errors.volumeM3 ? tErr(errors.volumeM3.message ?? "generic") : undefined}
            />
          </div>
          <div>
            <Label htmlFor="order-slump">{t("slump")}</Label>
            <Input
              id="order-slump"
              type="text"
              dir="ltr"
              placeholder="e.g. 12 cm"
              {...register("slump")}
            />
          </div>
        </div>
      </Fieldset>

      <Fieldset legend={t("sections.schedule")}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="order-date" required>
              {t("date")}
            </Label>
            <Input
              id="order-date"
              type="date"
              dir="ltr"
              invalid={!!errors.date}
              {...register("date")}
            />
            <FieldError
              message={errors.date ? tErr(errors.date.message ?? "generic") : undefined}
            />
          </div>
          <div>
            <Label htmlFor="order-timeWindow">{t("timeWindow")}</Label>
            <Input
              id="order-timeWindow"
              type="text"
              dir="ltr"
              placeholder="e.g. 06:00 – 10:00"
              {...register("timeWindow")}
            />
          </div>
        </div>
      </Fieldset>

      <Fieldset legend={t("sections.contact")}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <Label htmlFor="order-contactName" required>
              {t("contactName")}
            </Label>
            <Input
              id="order-contactName"
              type="text"
              autoComplete="name"
              invalid={!!errors.contactName}
              {...register("contactName")}
            />
            <FieldError
              message={
                errors.contactName ? tErr(errors.contactName.message ?? "generic") : undefined
              }
            />
          </div>
          <div>
            <Label htmlFor="order-contactPhone" required>
              {t("contactPhone")}
            </Label>
            <Input
              id="order-contactPhone"
              type="tel"
              dir="ltr"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+20 100 000 0000"
              invalid={!!errors.contactPhone}
              {...register("contactPhone")}
            />
            <FieldError
              message={
                errors.contactPhone ? tErr(errors.contactPhone.message ?? "generic") : undefined
              }
            />
          </div>
          <div>
            <Label htmlFor="order-contactEmail" required>
              {t("contactEmail")}
            </Label>
            <Input
              id="order-contactEmail"
              type="email"
              autoComplete="email"
              inputMode="email"
              invalid={!!errors.contactEmail}
              {...register("contactEmail")}
            />
            <FieldError
              message={
                errors.contactEmail ? tErr(errors.contactEmail.message ?? "generic") : undefined
              }
            />
          </div>
        </div>
      </Fieldset>

      <Fieldset legend={t("sections.notes")}>
        <div>
          <Label htmlFor="order-notes">{t("notes")}</Label>
          <Textarea
            id="order-notes"
            rows={5}
            placeholder={t("notesPlaceholder")}
            {...register("notes")}
          />
        </div>
      </Fieldset>

      <div className="flex flex-wrap items-center gap-6">
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

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-border pt-8">
      <legend className="float-start -mt-12 me-4 bg-bg pe-4 text-xs font-medium uppercase tracking-[0.22em] text-accent">
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}
