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
import { normalizePhone, phonePattern, submitLead } from "@/lib/forms/submit";
import { cn } from "@/lib/utils";

const requestTypes = ["general", "wholesale", "export", "organization", "complaint"] as const;

export function ContactForm({ locale, dict, compact = false, defaultType, className }: { locale: Locale; dict: Dictionary["form"]; compact?: boolean; defaultType?: (typeof requestTypes)[number]; className?: string }) {
  const schema = useMemo(
    () =>
      z
        .object({
          name: z.string().trim().min(2, dict.errors.required),
          phone: z.string().optional(),
          email: z.string().optional(),
          request_type: z.enum(requestTypes).optional(),
          subject: z.string().max(150).optional(),
          message: z.string().trim().min(10, dict.errors.min).max(5000),
          website: z.string().optional(),
        })
        .superRefine((v, ctx) => {
          const phone = normalizePhone(v.phone ?? "");
          const email = (v.email ?? "").trim();
          if (!phone && !email) ctx.addIssue({ code: "custom", path: ["phone"], message: dict.errors.phoneOrEmail });
          if (phone && !phonePattern.test(phone)) ctx.addIssue({ code: "custom", path: ["phone"], message: dict.errors.phone });
          if (email && !z.email().safeParse(email).success) ctx.addIssue({ code: "custom", path: ["email"], message: dict.errors.email });
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
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { request_type: defaultType ?? "general" } });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const res = await submitLead("contact", locale, { ...values, phone: normalizePhone(values.phone ?? ""), form_started_at: startedAt });
    if (res.ok) return setResult({ reference: res.reference, message: res.message });
    if (res.status === 422 && res.errors) {
      Object.entries(res.errors).forEach(([f, m]) => (["name", "phone", "email", "subject", "message"].includes(f) ? setError(f as keyof Values, { message: m[0] }) : setFormError(m[0])));
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

  const id = (n: string) => `contact-${n}${compact ? "-c" : ""}`;
  const aria = (n: keyof Values) => ({ id: id(n), "aria-invalid": !!errors[n] || undefined });

  return (
    <form onSubmit={onSubmit} onFocusCapture={() => startedAt === 0 && setStartedAt(Date.now())} noValidate className={cn("relative grid gap-4", !compact && "sm:grid-cols-2 sm:gap-5", className)}>
      <Honeypot register={register as never} />
      <div className={cn(!compact && "sm:col-span-2")}>
        <Label htmlFor={id("name")}>{dict.fullName} *</Label>
        <Input {...aria("name")} autoComplete="name" {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>
      <div>
        <Label htmlFor={id("phone")}>{dict.phone}</Label>
        <Input {...aria("phone")} type="tel" dir="ltr" inputMode="tel" autoComplete="tel" className="text-start" {...register("phone")} />
        <FieldError message={errors.phone?.message} />
      </div>
      <div>
        <Label htmlFor={id("email")}>{dict.email}</Label>
        <Input {...aria("email")} type="email" dir="ltr" autoComplete="email" className="text-start" {...register("email")} />
        <FieldError message={errors.email?.message} />
      </div>
      {!compact && (
        <>
          <div>
            <Label htmlFor={id("request_type")}>{dict.requestType}</Label>
            <Select {...aria("request_type")} {...register("request_type")}>
              {requestTypes.map((t) => (
                <option key={t} value={t}>
                  {dict.requestTypes[t]}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor={id("subject")}>{dict.subject}</Label>
            <Input {...aria("subject")} {...register("subject")} />
          </div>
        </>
      )}
      <div className={cn(!compact && "sm:col-span-2")}>
        <Label htmlFor={id("message")}>{dict.message} *</Label>
        <Textarea {...aria("message")} rows={compact ? 4 : 6} {...register("message")} />
        <FieldError message={errors.message?.message} />
      </div>
      {formError && (
        <p role="alert" className={cn("rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger", !compact && "sm:col-span-2")}>
          {formError}
        </p>
      )}
      <Button type="submit" size="lg" disabled={isSubmitting} className={cn("w-full", !compact && "sm:col-span-2 sm:w-auto sm:justify-self-end")}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="ltr:-scale-x-100" />}
        {isSubmitting ? dict.sending : dict.send}
      </Button>
    </form>
  );
}
