import { redirect } from "@/i18n/navigation";

export default function LocaleHome({
  params: { locale },
}: {
  params: { locale: string };
}) {
  redirect({ href: "/projects", locale });
}
