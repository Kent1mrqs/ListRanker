import Image from "next/image";
import WorflowImg01 from "@/public/images/workflow-01.png";
import WorflowImg02 from "@/public/images/workflow-02.png";
import WorflowImg03 from "@/public/images/workflow-03.png";
import Spotlight from "@/components/spotlight";
import Card from "@/components/Card";

export default function Workflows() {

  const description1 = "Streamline the product development flow with a content\n" +
    "            platform that's aligned across specs and insights."

  const description2 = "Streamline the product development flow with a content\n" +
      "                    platform that's aligned across specs and insights."

  const description3 = "Streamline the product development flow with a content\n" +
      "                    platform that's aligned across specs and insights."

  return (
      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="pb-12 md:pb-20">
            {/* Section header */}
            <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
              <div
                  className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
              <span
                  className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                Tailored Workflows
              </span>
              </div>
              <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
                Map your product journey
              </h2>
              <p className="text-lg text-indigo-200/65">
                Simple and elegant interface to start collaborating with your team
                in minutes. It seamlessly integrates with your code and your
                favorite programming languages.
              </p>
            </div>
            {/* Spotlight items */}
            <Spotlight className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-4">
              <Card title='Built-in Tools' image={WorflowImg01} description={description1}/>
              <Card title='Scale Instantly' image={WorflowImg02} description={description2}/>
              <Card title='Tailored Flows' image={WorflowImg03} description={description3}/>
              <Card title='Tailored Flows' image={WorflowImg03} description={description3}/>
            </Spotlight>
        </div>
      </div>
    </section>
  );
}
