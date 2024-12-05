"use client";

import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import AnimationImage from "./AnimationImage";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-200 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#4ade80,rgba(209,202,106,0)_100%)] px-5 py-12 text-center text-gray-900 md:flex-row md:text-start lg:gap-12">
      <div className="max-w-prose space-y-3">
        <Image
          src={logo}
          alt="Logo"
          width={150}
          height={150}
          className="mx-auto md:ms-0"
        />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Create a{" "}
          <span className="inline bg-gradient-to-t from-green-600 to-green-400 bg-clip-text text-transparent">
            Perfect Resume
          </span>{" "}
          in minutes
        </h1>
        <p className="text-lg text-gray-500">
          Our <span className="font-bold">AI Resume Builder</span> helps you
          create a perfect resume in minutes.
        </p>
        <Button asChild size="lg" variant="premium">
          <Link href={"/resumes"}>Get started</Link>
        </Button>
      </div>
      <div>
        <AnimationImage />
      </div>
    </main>
  );
}
