export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" }, 
    });
  }

  return new Response("Error de verificación", { status: 403 });
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Webhook recibido:", JSON.stringify(body, null, 2));

    const entry = body.entry?.[0]?.changes?.[0]?.value;
    const message = entry?.messages?.[0];

    if (message && message.from) {
      const from = message.from; 
      const text = message.text?.body; 

      console.log(`Mensaje recibido de ${from}: ${text}`);

      await fetch(
        `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: { body: "👋 Hola, gracias por tu mensaje. Te responderemos pronto." },
          }),
        }
      );
    }

    return new Response("EVENT_RECEIVED", { status: 200 });
  } catch (err) {
    console.error("Error webhook:", err);
    return new Response(null, { status: 500 });
  }
}