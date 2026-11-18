"use client";

import { notFound, useParams } from "next/navigation";
import { ResourceForm } from "@/components/admin/resource-form";
import { resources } from "@/lib/admin/resources";

export default function ResourceEditPage() {
  const { resource, id } = useParams<{ resource: string; id: string }>();
  const def = resources[resource];
  if (!def) notFound();
  return <ResourceForm key={`${resource}-${id}`} resource={def} id={id} />;
}
