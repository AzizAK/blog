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
        أهلاً وسهلاً! أنا عبدالعزيز وإذا ودك نسولف عن أي موضوع في بالك تقدر تحجز من النموذج تحت ونجتمع عن بعد ونتكلم عن
        أي شيء، مثل:
        <ul style={{ listStyleType: "none" }}>
          <li>💻 التقنية و البرمجة خصوصاً</li>
          <li>🛫 السفر</li>
          <li>‫👨🏻‍💻 العمل الحر</li>
          <li>‫🎮 الألعاب أو الأفلام ‬</li>
          <li>‫🏦 المشاريع الناشئة‬</li>
        </ul>
      </Page>
      <Sidebar />
    </Layout>
  );
};

export default ContactTemplate;
