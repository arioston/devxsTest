import React from "react";
import { Layout } from "../Layout";
import { Routes, Route } from "react-router-dom";
import { Products } from "../Products";

export const Home = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/home">
          <Route path="products" element={<Products />} />
        </Route>
      </Routes>
    </Layout>
  );
};
