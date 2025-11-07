import React from "react";
import { FAQSection } from "@/components/home/faq";

export const metadata = {
  title: "FAQ | AdWallPro",
  description: "Frequently Asked Questions - AdWallPro",
};

export default function FAQPage() {
  return (
      <main>
        <div className="container-premium py-12 bg-pattern-grid ">
          <FAQSection />
        </div>
      </main>
  );
}
