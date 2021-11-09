import "twin.macro";

import { Card, Form as AntdForm, Layout } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { object, string } from "yup";

import { useAuth } from "../../context/Auth";

const { Content } = Layout;

const SigninSchema = object().shape({
  email: string().required("Email is required").email("Invalid Email"),
  password: string().required("Password is required"),
});

const SignupSchema = object().shape({
  email: string().required("Email is required").email("Invalid Email"),
  password: string().required("Password is required"),
  name: string().required("Name is required"),
});

function Login() {
  const [isSignIn, seIsSignIn] = useState(true);
  const auth = useAuth();
  const navigate = useNavigate();

  const emailSentNotification = () =>
    toast.info(
      "An email to verify your account was sent, please check your email!"
    );

  const sendEmail = (email: string) => {
    if (email) {
      auth.sendEmail(email).then((s) => emailSentNotification());
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [auth.user, auth.isAuthenticated, navigate]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content tw="flex justify-center items-center">
        <Card tw="w-1/4">
          <div tw="bg-white dark:bg-gray-800 ">
            <div tw="text-center w-full mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-20">
              <h2 tw="text-3xl font-extrabold text-black dark:text-white sm:text-4xl">
                <span tw="block">Devx</span>
                <span tw="block text-indigo-500">Test</span>
              </h2>
            </div>
          </div>
          <Formik
            as={<AntdForm />}
            initialValues={{ email: "", password: "", name: "" }}
            validationSchema={isSignIn ? SigninSchema : SignupSchema}
            onSubmit={(values) => {
              isSignIn
                ? auth.signin(values.email, values.password)
                : auth
                    .signup(values.name, values.email, values.password)
                    .then(() => emailSentNotification());
              console.log(values);
            }}
          >
            {({ errors, touched, values, setTouched }) => (
              <Form tw="space-y-5 mt-5">
                {!isSignIn && (
                  <>
                    <Field
                      type="text"
                      tw="w-full h-12 border border-gray-800 rounded px-3"
                      name="name"
                      placeholder="Name"
                    />
                    {touched.name && errors.name && (
                      <div tw="font-mono text-red-500">{errors.name}</div>
                    )}
                  </>
                )}
                <Field
                  type="text"
                  tw="w-full h-12 border border-gray-800 rounded px-3"
                  name="email"
                  placeholder="Email"
                />
                {touched.email && errors.email && (
                  <div tw="font-mono text-red-500">{errors.email}</div>
                )}
                <Field
                  type="password"
                  tw="w-full h-12 border border-gray-800 rounded px-3"
                  name="password"
                  placeholder="Password"
                />
                {touched.password && errors.password && (
                  <div tw="font-mono text-red-500">{errors.password}</div>
                )}
                <div tw="flex justify-between">
                  <button
                    onClick={() => seIsSignIn((prev) => !prev)}
                    tw="font-medium text-indigo-500  rounded-md p-2"
                  >
                    {isSignIn ? "Signup" : "Signin"}
                  </button>
                  {!isSignIn && (
                    <button
                      onClick={() => {
                        !values.email &&
                          setTouched({
                            email: true,
                          });
                        sendEmail(values.email);
                      }}
                      tw="font-medium text-indigo-500  rounded-md p-2"
                    >
                      Send email
                    </button>
                  )}
                </div>

                <button
                  tw="text-center w-full bg-indigo-500 rounded-md text-white py-3 font-medium"
                  type="submit"
                >
                  {isSignIn ? "Signin" : "Signup"}
                </button>
              </Form>
            )}
          </Formik>
        </Card>
      </Content>
    </Layout>
  );
}

export default Login;
