import { ServiceModule } from "@/components/service-module";
import { getServiceModule } from "@/lib/service-module";

export default async function Home() {
  const service = await getServiceModule();

  return (
    <main>
      <ServiceModule service={service} />
    </main>
  );
}
