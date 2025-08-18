import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

type Team = { id: number; name: string; code: string; league: string };

export default function App() {
  const qc = useQueryClient();

  const teamsQ = useQuery({
    queryKey: ["teams"],
    queryFn: async (): Promise<Team[]> =>
      (await axios.get(`${API}/api/teams`)).data,
  });

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [league, setLeague] = useState("NFL");

  async function addTeam(e: React.FormEvent) {
    e.preventDefault();
    await axios.post(`${API}/api/teams`, { name, code, league });
    setName(""); setCode("");
    qc.invalidateQueries({ queryKey: ["teams"] });
  }

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>StatForge</h1>

      <form onSubmit={addTeam} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Code" value={code} onChange={e=>setCode(e.target.value)} />
        <select value={league} onChange={e=>setLeague(e.target.value)}>
          <option>NFL</option><option>NBA</option><option>NHL</option><option>MLB</option>
        </select>
        <button>Add</button>
      </form>

      {teamsQ.isLoading ? <p>Loading…</p> : (
        <ul>
          {teamsQ.data?.map(t => (
            <li key={t.id}>{t.league} • {t.name} ({t.code})</li>
          ))}
        </ul>
      )}
    </div>
  );
}
