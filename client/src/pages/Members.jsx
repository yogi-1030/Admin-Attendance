import { useEffect, useState } from "react";
import { api } from "../api";

export default function Members(){
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name:"", email:"", role:"Member" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async ()=>{
    setLoading(true);
    try{
      const { data } = await api.get("/members");
      setMembers(data);
    } finally{ setLoading(false); }
  };
  useEffect(()=>{ load(); },[]);

  const save = async (e)=>{
    e.preventDefault();
    if(!form.name.trim()) return;
    if(editing){
      await api.put(`/members/${editing.id}`, form);
    } else {
      await api.post("/members", form);
    }
    setForm({ name:"", email:"", role:"Member" });
    setEditing(null);
    load();
  };

  const startEdit = (m)=>{ setEditing(m); setForm({ name:m.name, email:m.email, role:m.role }); };
  const cancelEdit = ()=>{ setEditing(null); setForm({ name:"", email:"", role:"Member" }); };

  const removeMember = async(id)=>{
    await api.delete(`/members/${id}`);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h2>Team Member Management</h2>
        <button className="btn btn-blue click-anim" onClick={()=>document.getElementById('nameInput')?.focus()}>
          Add Member
        </button>
      </div>

      <form className="inline" onSubmit={save}>
        <input id="nameInput" placeholder="Name" value={form.name}
               onChange={e=>setForm({...form, name:e.target.value})}/>
        <input placeholder="Email" value={form.email}
               onChange={e=>setForm({...form, email:e.target.value})}/>
        <input placeholder="Role" value={form.role}
               onChange={e=>setForm({...form, role:e.target.value})}/>
        <button className="btn btn-blue click-anim" type="submit">
          {editing ? "Update" : "Add"}
        </button>
        {editing && (
          <button type="button" className="btn btn-outline click-anim" onClick={cancelEdit}>Cancel</button>
        )}
      </form>

      {loading ? <p className="sub-text">Loading...</p> :
      members.length === 0 ? (
        <p className="sub-text">No members found. Please add members.</p>
      ) : (
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {members.map(m=>(
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.role}</td>
                <td>
                  <button className="btn btn-gray click-anim" onClick={()=>startEdit(m)}>Edit</button>
                  <button className="btn btn-red click-anim" onClick={()=>removeMember(m.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}