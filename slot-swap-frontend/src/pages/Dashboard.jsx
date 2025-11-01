
import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";
import Navbar from "../components/Navbar";
export default function Dashboard() {
  const { user, authTokens } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  


  const fetchEvents = async () => {
    try {
      const res = await api.get("/events/", {
        headers: { Authorization: `Bearer ${authTokens?.access}` },
      });
      console.log("Logged-in user:", user);
      console.log("Access token:", authTokens?.access);
      console.log("Token:", authTokens?.access);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load events");
    }
  };


  const createEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/events/",
        {
          title,
          start_time: start,
          end_time: end,
          status: "BUSY",
        },
        { headers: { Authorization: `Bearer ${authTokens?.access}` } }
      );
      setTitle("");
      setStart("");
      setEnd("");
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    }
  };

  
  const toggleStatus = async (id, currentStatus) => {
  const newStatus = currentStatus === "BUSY" ? "SWAPPABLE" : "BUSY";

  try {
    await api.patch(
      `/events/${id}/`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${authTokens?.access}` } }
    );
    fetchEvents(); 
  } catch (err) {
    console.error(err);
    alert("Failed to update status");
  }
};

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
    <Navbar/>
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      
      <h2 className="font-bold text-[22px]">Welcome, {user?.username}</h2>
      <h3 className="mt-5 font-semibold text-[18px]">Your Events</h3>
      
      <table className=" mt-10 border-separate border-spacing-3 border-2  border-gray-400">
        <thead>
          <tr>
            <th>Title</th>
            <th>Start_time</th>
            <th>End_time</th>
            <th>Status</th>
            <th>Change_Status</th>
          </tr>
        </thead>
        <tbody>
          {events.map((ev)=>(
            <tr key={ev.id} >
              <td className="border border-gray-200">{ev.title}</td>
              <td className="border border-gray-200">{new Date(ev.start_time).toLocaleString()}</td>
              <td className="border border-gray-200">{new Date(ev.end_time).toLocaleString()}</td>
              <td className="border border-gray-200"> {ev.status}</td>
              <td className=" border border-gray-200 text-center  bg-blue-600 hover:bg-blue-900 text-white p-1 rounded-md font-semibold transition"><button onClick={() => toggleStatus(ev.id, ev.status)}>{ev.status === "BUSY" ? "Make Swappable" : "Make Busy"}</button></td>
            </tr>
    
          ))
          }
        </tbody>
      </table>
      

      
      <div className=" bg-white rounded-lg shadow-lg p-8 w-full max-w-sm h-[300px] mt-7 ">
        <h3 className="m-2 font-semibold">Create New Event</h3>
        <form onSubmit={createEvent}>
        <input className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <input 
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
        />
        <br />
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
        />
        <br />
        <button className="mt-4 text-center w-full bg-[#36A420] hover:bg-[#1f4318] text-white py-2 rounded-md font-semibold transition pt-4 pb-4" type="submit">Add Event</button>
      </form>
      </div>
    </div>
    </>
  );
}
