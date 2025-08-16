import { useEffect, useState } from "react";
import { api } from "../api";
import dayjs from "dayjs";

export default function Attendance(){
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [members, setMembers] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);

  const load = async(d)=>{
    setLoading(true);
    try{
      const { data } = await api.get("/attendance", { params: { date: d } });
      setMembers(data.members || []);
      const map = {};
      (data.marks || []).forEach(m => { map[m.memberId] = m.status; });
      setMarks(map);
    } finally{ setLoading(false); }
  };
  useEffect(()=>{ load(date); },[date]);

  const bulk = (status)=>{
    const copy = {...marks};
    members.forEach(m => copy[m.id] = status);
    setMarks(copy);
  };

  const save = async ()=>{
    const records = members.map(m => ({ memberId: m.id, status: marks[m.id] || "ABSENT" }));
    await api.post("/attendance/mark", { date, records });
    load(date);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Daily Attendance Marking</h2>
        <div style={{display:"flex", gap:10}}>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
          <button className="btn btn-outline click-anim" onClick={()=>bulk("PRESENT")}>All Present</button>
          <button className="btn btn-outline click-anim" onClick={()=>bulk("ABSENT")}>All Absent</button>
          <button className="btn btn-blue click-anim" onClick={save}>Save</button>
        </div>
      </div>

      {loading ? <p className="sub-text">Loading...</p> :
      members.length === 0 ? (
        <p className="sub-text">No members found for this date.</p>
      ) : (
        <table>
          <thead><tr><th>Member</th><th>Status</th></tr></thead>
          <tbody>
            {members.map(m=>(
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>
                  <select value={marks[m.id] || "ABSENT"} onChange={e=>setMarks({...marks, [m.id]: e.target.value})}>
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}