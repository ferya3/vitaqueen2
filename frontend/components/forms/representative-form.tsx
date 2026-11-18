"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormSuccess, Honeypot } from "@/components/forms/form-shell";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/input";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { iranProvinces } from "@/lib/forms/provinces";
import { normalizePhone, phonePattern, submitLead } from "@/lib/forms/submit";
import { cn } from "@/lib/utils";

const activityTypes = ["distributor", "wholesaler", "retailer", "exporter", "organization"] as const;

export function RepresentativeForm({ locale, dict, className }: { locale: Locale; dict: Dictionary["form"]; className?: string }) {
  const schema = useMemo(
    () =>
      z.object({
        full_name: z.string().trim().min(3, dict.errors.required),
        company_name: z.string().optional(),
        phone: z.string().refine((v) => phonePattern.test(normalizePhone(v)), dict.errors.phone),
        email: z.union([z.literal(""), z.email(dict.errors.email)]).optional(),
        province: z.string().trim().min(2, dict.errors.required),
        city: z.string().trim().min(2, dict.errors.required),
        activity_type: z.enum(activityTypes, { error: dict.errors.required }),
        distribution_capacity: z.string().optional(),
        has_warehouse: z.boolean().optional(),
        vehicle_count: z.string().optional(),
        message: z.string().max(3000).optional(),
        website: z.string().optional(),
      }),
    [dict],
  );
  type Values = z.infer<typeof schema>;

  // Time of the first interaction with the form (spam check: humans need a few seconds).
  const [startedAt, setStartedAt] = useState(0);
  const [result, setResult] = useState<{ reference: string; message: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { has_warehouse: false } });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const res = await submitLead("representatives", locale, {
      ...values,
      phone: normalizePhone(values.phone),
      vehicle_count: values.vehicle_count ? Number(values.vehicle_count.replace(/\D/g, "")) || undefined : undefined,
      form_started_at: startedAt,
    });
    if (res.ok) {
      setResult({ reference: res.reference, message: res.message });
      return;
    }
    if (res.status === 422 && res.errors) {
      Object.entries(res.errors).forEach(([field, messages]) =>
        field in schema.shape ? setError(field as keyof Values, { message: messages[0] }) : setFormError(messages[0]),
      );
      return;
    }
    setFormError(res.status === 429 ? dict.tooMany : (res.message ?? dict.genericError));
  });

  if (result) {
    return (
      <FormSuccess
        title={dict.successTitle}
        message={result.message}
        reference={result.reference}
        referenceLabel={dict.reference}
        resetLabel={dict.newRequest}
        onReset={() => {
          reset();
          setResult(null);
          setStartedAt(0);
        }}
      />
    );
  }

  const field = (name: keyof Values) => ({ id: `rep-${name}`, "aria-invalid": !!errors[name] || undefined, "aria-describedby": errors[name] ? `rep-${name}-error` : undefined });

  return (
    <form onSubmit={onSubmit} onFocusCapture={() => startedAt === 0 && setStartedAt(Date.now())} noValidate className={cn("relative grid gap-5 sm:grid-cols-2", className)}>
      <Honeypot register={register as never} />

      <div>
        <Label htmlFor="rep-full_name">{dict.fullName} *</Label>
        <Input {...field("full_name")} autoComplete="name" {...register("full_name")} />
        <FieldError message={errors.full_name?.message} />
      </div>
      <div>
        <Label htmlFor="rep-company_name">
          {dict.companyName} <span className="font-normal text-muted">({dict.optional})</span>
        </Label>
        <Input {...field("company_name")} autoComplete="organization" {...register("company_name")} />
      </div>
      <div>
        <Label htmlFor="rep-phone">{dict.phone} *</Label>
        <Input {...field("phone")} type="tel" inputMode="tel" dir="ltr" autoComplete="tel" placeholder="09xx xxx xxxx" className="text-start" {...register("phone")} />
        <FieldError message={errors.phone?.message} />
      </div>
      <div>
        <Label htmlFor="rep-email">
          {dict.email} <span className="font-normal text-muted">({dict.optional})</span>
        </Label>
        <Input {...field("email")} type="email" dir="ltr" autoComplete="email" className="text-start" {...register("email")} />
        <FieldError message={errors.email?.message} />
      </div>
      <div>
        <Label htmlFor="rep-province">{dict.province} *</Label>
        <Input {...field("province")} list="rep-provinces" autoComplete="address-level1" {...register("province")} />
        <datalist id="rep-provinces">
          {iranProvinces.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
        <FieldError message={errors.province?.message} />
      </div>
      <div>
        <Label htmlFor="rep-city">{dict.city} *</Label>
        <Input {...field("city")} autoComplete="address-level2" {...register("city")} />
        <FieldError message={errors.city?.message} />
      </div>
      <div>
        <Label htmlFor="rep-activity_type">{dict.activityType} *</Label>
        <Select {...field("activity_type")} defaultValue="" {...register("activity_type")}>
          <option value="" disabled>
            {dict.select}
          </option>
          {activityTypes.map((t) => (
            <option key={t} value={t}>
              {dict.activityTypes[t]}
            </option>
          ))}
        </Select>
        <FieldError message={errors.activity_type?.message} />
      </div>
      <div>
        <Label htmlFor="rep-distribution_capacity">{dict.capacity}</Label>
        <Input {...field("distribution_capacity")} placeholder={dict.capacityPlaceholder} {...register("distribution_capacity")} />
      </div>
      <div>
        <Label htmlFor="rep-vehicle_count">{dict.vehicleCount}</Label>
        <Input {...field("vehicle_count")} inputMode="numeric" {...register("vehicle_count")} />
      </div>
      <label className="flex cursor-pointer items-center gap-3 self-end rounded-2xl border border-line px-4 py-3.5 text-sm font-medium text-deep-600 hover:border-water-300">
        <input type="checkbox" className="size-5 accent-water-500" {...register("has_warehouse")} />
        {dict.hasWarehouse}
      </label>
      <div className="sm:col-span-2">
        <Label htmlFor="rep-message">{dict.message}</Label>
        <Textarea {...field("message")} rows={4} {...register("message")} />
      </div>

      {formError && (
        <p role="alert" className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger sm:col-span-2">
          {formError}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">{dict.privacy}</p>
        <Button type="submit" size="lg" disabled={isSubmitting} className="min-w-48">
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="ltr:-scale-x-100" />}
          {isSubmitting ? dict.sending : dict.submit}
        </Button>
      </div>
    </form>
  );
}
