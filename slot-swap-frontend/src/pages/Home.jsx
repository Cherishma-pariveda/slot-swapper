
import React from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";

export default function Home() {
  return (
    <>
    <Nav/>
    <div
      style={{
        textAlign: "center",
        padding: "60px 20px",
        minHeight: "100vh",
       
        color: "white",
      }}
    >
      <h1 className="text-black text-[48px] mt-20" >Welcome to SlotSwapper</h1>
      <p  className="text-black text-[18px] mt-8">
        Manage your events efficiently and swap schedules seamlessly with your team.
      </p>
      <p className="text-sm text-black mt-10 " >SlotSwapper is a peer-to-peer time-slot scheduling <br />
        The core idea: Users have calendars with busy slots. They can mark a busy slot as "swappable." <br /> Other users can then see these swappable slots and request to swap one of their own swappable slots for it.</p>

      
    </div>
    </>
  );
}
