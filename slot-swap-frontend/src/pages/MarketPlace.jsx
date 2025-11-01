import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function Marketplace() {
  const { user } = useContext(AuthContext);
  const [swappableSlots, setSwappableSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [selectedTheirSlot, setSelectedTheirSlot] = useState(null);
  const [selectedMySlot, setSelectedMySlot] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchSwappable = async () => {
      try {
        const res = await api.get("/events/swappable/");
        setSwappableSlots(res.data);
      } catch (err) {
        console.error("Error loading swappable slots:", err);
        alert("Failed to load available slots.");
      }
    };
    fetchSwappable();
  }, []);


  const fetchMySlots = async () => {
    try {
      const res = await api.get("/events/");
      const mySwappable = res.data.filter((e) => e.status === "SWAPPABLE");
      setMySlots(mySwappable);
    } catch (err) {
      console.error("Error loading your slots:", err);
      alert("Failed to load your swappable slots.");
    }
  };


  const openSwapModal = (theirSlot) => {
    setSelectedTheirSlot(theirSlot);
    fetchMySlots();
    setShowModal(true);
  };

  const sendSwapRequest = async () => {
    if (!selectedMySlot) {
      alert("Please select one of your SWAPPABLE slots.");
      return;
    }

    try {
      await api.post("/swap-requests/create_swap/", {
        mySlotId: selectedMySlot,
        theirSlotId: selectedTheirSlot.id,
      });
      alert("Swap request sent successfully!");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to send swap request.");
    }
  };

  return (
    <>
    <Navbar/>
    <div style={{ padding: "20px" }}>
      <h2 className="font-bold text-[24px]">Marketplace</h2>

      {swappableSlots.length === 0 ? (
        <p>No available slots from other users.</p>
      ) : (
        <div>
          {swappableSlots.map((slot) => (
            <div
              key={slot.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "8px",
              }}
            >
              <h4  >{slot.title}</h4>
              <p>
                {new Date(slot.start_time).toLocaleString()} →{" "}
                {new Date(slot.end_time).toLocaleString()}
              </p>
              <p>
                <strong>Owner:</strong> {slot.owner.username}
              </p>
              <button className="mt-4 text-center  bg-[#36A420] hover:bg-[#1f4318] text-white py-2 rounded-md font-semibold transition pt-4 pb-4" onClick={() => openSwapModal(slot)}>Request Swap</button>
            </div>
          ))}
        </div>
    
      )}

 
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h3>Offer One of Your Slots</h3>
            {mySlots.length === 0 ? (
              <p>You have no SWAPPABLE slots.</p>
            ) : (
              <select
                value={selectedMySlot}
                onChange={(e) => setSelectedMySlot(e.target.value)}
                style={{ width: "100%", padding: "8px" }}
              >
                <option value="">Select your slot</option>
                {mySlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.title} ({new Date(slot.start_time).toLocaleString()})
                  </option>
                ))}
              </select>
            )}
            <div style={{ marginTop: "10px" }}>
              <button onClick={sendSwapRequest}>Send Request</button>
              <button
                onClick={() => setShowModal(false)}
                style={{ marginLeft: "8px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
    
  );
}
