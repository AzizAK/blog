// @flow
import React from "react";
import Sidebar from "../components/Sidebar";
import Layout from "../components/Layout";
import Page from "../components/Page";
import { useSiteMetadata } from "../hooks";

const NotFoundTemplate = () => {
  const { title, subtitle } = useSiteMetadata();

  return (
    <Layout title={`خطأ - ${title}`} description={subtitle}>
      <Page title="خطأ">
        <p>معليش هذه صفحة غير موجودة</p>
      </Page>
      <Sidebar />
    </Layout>
  );
};

export default NotFoundTemplate;
