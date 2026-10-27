import { Suspense } from "react";
import { ServiceModule } from "@/components/service-module";
import { getServiceModule } from "@/lib/service-module";

async function ServiceModuleData() {
  const service = await getServiceModule();

  return <ServiceModule service={service} />;
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={null}>
        <ServiceModuleData />
      </Suspense>
    </main>
  );
}
