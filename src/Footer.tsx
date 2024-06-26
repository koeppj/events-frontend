import { useState } from "react";
import { Navbar, NavbarText } from "reactstrap";
import { useAppContext } from "./appcontext";

export default function Header(args: any) {
  const appcontext = useAppContext();

  return (
    <Navbar {...args}>
    </Navbar>
  );
}