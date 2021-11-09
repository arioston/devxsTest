import "twin.macro";

import { Button, Layout as AntLayout, Menu, Typography } from "antd";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/Auth";

const { Header, Content, Footer } = AntLayout;

const menus = ["Products"];

export const Layout: FC = ({ children }) => {
  const auth = useAuth();
  return (
    <AntLayout tw="flex min-h-screen">
      <Header tw="flex items-center content-center">
        <Typography as="h2" tw="mr-2.5 text-indigo-50">
          DEVXS
        </Typography>
        <Menu mode="horizontal" theme="dark">
          {menus.map((item, ix) => (
            <Menu.Item key={ix + 1}>
              <Link to={`home/${item.toLowerCase()}`}>{item}</Link>
            </Menu.Item>
          ))}
        </Menu>
        <Button
          tw="flex items-center content-center ml-auto"
          ghost
          icon={<LogoutOutlined />}
          onClick={() => auth.signout()}
        >
          Logout
        </Button>
      </Header>
      <Content tw="h-1 min-h-full">{children}</Content>
      <Footer tw="mt-auto"></Footer>
    </AntLayout>
  );
};
