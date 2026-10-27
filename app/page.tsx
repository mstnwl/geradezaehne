import { Suspense } from "react";
import { ServiceModule } from "@/components/service-module";
import { getServiceModules } from "@/lib/service-module";

async function ServiceModuleData() {
  const services = await getServiceModules();

  return services.map((service) => <ServiceModule key={service.id} service={service} />);
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
