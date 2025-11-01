import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(username, email, password);
      alert("Signup successful! Please login to continue.");
      nav("/login"); 
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data || err?.message || "Signup failed";
      alert("Signup failed: " + JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Nav></Nav>
    <div className="flex justify-center items-center h-[100vh] bg-[#F2F4F7]">
      <div className=" bg-white rounded-lg shadow-md p-8 w-full max-w-sm h-[300px]">
      
      <form onSubmit={submit}>
        <div>
          <input className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div >
          <input className=" mt-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div >
          <input className=" mt-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div >
          <button type="submit" className="mt-4 text-center w-full bg-[#36A420] hover:bg-[#1f4318] text-white py-2 rounded-md font-semibold transition pt-4 pb-4" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </div>
      </form>
    </div>
    </div>
    </>
  );
}
