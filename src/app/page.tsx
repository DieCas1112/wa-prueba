"use client"; 

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Hola desde Next.js 👋"); 

  async function sendMsg() {
    setLoading(true);

    const res = await fetch("/api/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "50672095384", 
        message, 
      }),
    });

    const data = await res.json();
    console.log("Respuesta WhatsApp:", data);

    setLoading(false);
    alert("Se envió el mensaje (revisa consola)");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Enviar WhatsApp</h1>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        style={{ width: "300px", marginBottom: "10px" }}
      />
      <br />
      <button onClick={sendMsg} disabled={loading}>
        {loading ? "Enviando..." : "Enviar a +506 72095384"}
      </button>
    </div>
  );
}