"use client";

import { notFound, useParams } from "next/navigation";
import { ResourceList } from "@/components/admin/resource-list";
import { resources } from "@/lib/admin/resources";

export default function ResourceIndexPage() {
  const { resource } = useParams<{ resource: string }>();
  const def = resources[resource];
  if (!def) notFound();
  return <ResourceList key={resource} resource={def} />;
}
