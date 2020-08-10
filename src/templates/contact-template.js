// @flow
import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Layout from "../components/Layout";
import Page from "../components/Page";
import { useSiteMetadata } from "../hooks";

const ContactTemplate = () => {
  const { title, subtitle } = useSiteMetadata();
  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");
    script.setAttribute("src", "https://assets.calendly.com/assets/external/widget.js");
    head.appendChild(script);
  });
  return (
    <Layout title={`خلنا نسولف - ${title}`} description={subtitle}>
      <Page title="خلنا نسولف">
        أهلاً وسهلاً! أنا عبدالعزيز وإذا ودك نسولف مع بعض عن أي موضوع في بالك تقدر تحجز من النموذج تحت ونجتمع سوا عن بعد
        ونتكلم. المواضيع اللي أحب أسولف فيها:
        <ul style={{ listStyleType: "none" }}>
          <li>💻 التقنية و البرمجة خصوصاً</li>
          <li>🛫 السفر</li>
          <li> 👨🏻‍💻العمل عن بعد</li>
          <li> 🕹الألعاب وممكن نلعب شطرنج سوا 😅</li>
          <li>🏦 المشاريع الناشئة</li>
        </ul>
        <div
          className="calendly-inline-widget"
          data-url="https://calendly.com/azizkh/30min"
          style={{ minWidth: "320px", height: "1000px" }}
        />
      </Page>
      <Sidebar />
    </Layout>
  );
};

export default ContactTemplate;
