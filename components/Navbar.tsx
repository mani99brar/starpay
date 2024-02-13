import React from "react";
import { ConnectKitButton } from "connectkit";

const Navbar = () => {
  return (
    <div className="flex justify-center w-[100%] my-6 text-xl">
      <div className="w-[80%] flex justify-between">
        <p className="font-bold">StarPay</p>
        <ConnectKitButton />
      </div>
    </div>
  );
};

export default Navbar;
