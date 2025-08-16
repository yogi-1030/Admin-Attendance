import { useState } from "react";
import { api } from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";

export default function Dashboard(){
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    totalMembers: 0,
    days: 0,
    overallRate: 0,
    byUser: [],          // [{name, present, absent}]
    daily: []            // [{date, rate}]
  });

  const load = async()=>{
    if(!from || !to) return;
    setLoading(true);
    try{
      const res = await api.get("/reports/summary", { params: { from, to }});
      // expect backend to return keys used below; adjust if needed
      setData({
        totalMembers: res.data.totalMembers ?? 0,
        days: res.data.days ?? 0,
        overallRate: res.data.overallRate ?? 0,
        byUser: res.data.byUser ?? [],
        daily: res.data.daily ?? []
      });
    } finally{ setLoading(false); }
  };

  const quick = (days)=>{
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (days-1));
    setFrom(start.toISOString().slice(0,10));
    setTo(end.toISOString().slice(0,10));
  };

  return (
    <div>
      <h2>Dashboard & Reporting</h2>
      <p className="sub-text">Select a date range to analyze attendance per user and overall.</p>

      <div className="date-filter">
        <div><label>Start</label><input type="date" value={from} onChange={e=>setFrom(e.target.value)} /></div>
        <div><label>End</label><input type="date" value={to} onChange={e=>setTo(e.target.value)} /></div>
        <button className="btn btn-outline click-anim" onClick={()=>quick(7)}>Last 7 days</button>
        <button className="btn btn-outline click-anim" onClick={()=>quick(30)}>Last 30 days</button>
        <button className="btn btn-blue click-anim" onClick={load}>Load</button>
      </div>

      <div className="cards">
        <div className="card"><h3>Total Members</h3><div className="big">{data.totalMembers}</div></div>
        <div className="card"><h3>Days in Range</h3><div className="big">{data.days}</div></div>
        <div className="card"><h3>Overall Attendance</h3><div className="big">{data.overallRate}%</div></div>
      </div>

      {loading ? <p className="sub-text">Loading charts…</p> : (
        <div className="grid-2">
          <div className="chart-box">
            <h3 style={{marginTop:0}}>Per-user Present Count</h3>
            <div style={{width:"100%", height:300}}>
              <ResponsiveContainer>
                <BarChart data={data.byUser}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="present" />
                  <Bar dataKey="absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-box">
            <h3 style={{marginTop:0}}>Daily Attendance Rate (%)</h3>
            <div style={{width:"100%", height:300}}>
              <ResponsiveContainer>
                <LineChart data={data.daily}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}