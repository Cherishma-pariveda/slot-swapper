
import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Nav from "../components/Nav";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed: " + (err?.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Nav/>
    <div className="flex justify-center items-center h-[100vh] bg-[#F2F4F7]">
      <div  className=" bg-white rounded-lg shadow-md p-8 w-full max-w-sm h-[300px]" >
      <form onSubmit={submit}>
        <div >
          <input className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" placeholder="username"  value={username} onChange={e => setUsername(e.target.value)}  required />
        </div>
        <div >
          <input className=" mt-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="mt-4 text-center w-full bg-blue-600 hover:bg-blue-900 text-white py-2 rounded-md font-semibold transition">
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </div>
      </form>
      <p className="mt-4 text-center w-full bg-[#36A420] hover:bg-[#1f4318] text-white py-2 rounded-md font-semibold transition pt-4 pb-4" >
        <Link to="/signup">Create new account</Link>
      </p>
    </div>
    </div>
    </>
  );
}
