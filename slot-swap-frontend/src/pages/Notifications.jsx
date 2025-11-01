import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function Notifications() {
  const { authTokens, user } = useContext(AuthContext);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSwapRequests = async () => {
    try {
      const res = await api.get("/swap-requests/", {
        headers: { Authorization: `Bearer ${authTokens?.access}` },
      });
      const data = res.data;

      const incomingReq = data.filter((req) => req.receiver.id === user.user_id);
      const outgoingReq = data.filter((req) => req.requester.id === user.user_id);

      setIncoming(incomingReq);
      setOutgoing(outgoingReq);
    } catch (err) {
      console.error(err);
      alert("Failed to load swap requests");
    } finally {
      setLoading(false);
    }
  };


  const respondSwap = async (id, accepted) => {
    try {
      await api.post(
        `/swap-requests/${id}/respond/`,
        { accepted },
        { headers: { Authorization: `Bearer ${authTokens?.access}` } }
      );
      alert(accepted ? "Swap accepted!" : "Swap rejected!");
      fetchSwapRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to respond to swap");
    }
  };

  useEffect(() => {
    fetchSwapRequests();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
    <Navbar/>
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      
      <h2 className="font-bold text-[24px]">Notifications</h2>

      <div  className="mt-5 border shadow-lg p-5">
        <h3 className="font-semibold text-[18px] mb-4">Incoming Requests</h3>
        {incoming.length === 0 ? (
          <p>No incoming requests</p>
        ) : (
          <ul>
            {incoming.map((req) => (
              <li key={req.id} style={{ marginBottom: 10 }}>
                <b>{req.requester.username}</b> wants to swap their{" "}
                <i>{req.my_slot.title}</i> with your{" "}
                <i>{req.their_slot.title}</i> <br />
                Status: {req.status}
                {req.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => respondSwap(req.id, true)}
                      style={{ marginLeft: 8 }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => respondSwap(req.id, false)}
                      style={{ marginLeft: 8 }}
                    >
                      Reject
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div  className="mt-5 border shadow-lg p-5">
        <h3 className="font-semibold text-[18px] mb-4">Outgoing Requests</h3>
        {outgoing.length === 0 ? (
          <p>No outgoing requests</p>
        ) : (
          <ul>
            {outgoing.map((req) => (
              <li key={req.id} style={{ marginBottom: 10 }}>
                You requested <b>{req.receiver.username}</b> to swap your{" "}
                <i>{req.my_slot.title}</i> with their{" "}
                <i>{req.their_slot.title}</i> <br />
                Status: {req.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </>
  );
}
