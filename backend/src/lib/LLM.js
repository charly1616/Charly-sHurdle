import { ENV } from '../../env.js';

export default async function askAI(prompt) {
  try {

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${ENV.OPEN_ROUTER_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: ENV.OPEN_ROUTER_MODEL,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      }
    );

    const data = await response.json();
    console.log(data)

    const text = data.choices?.[0]?.message?.content || "Sin respuesta";

    return text;

  } catch (error) {
    console.error("Error al llamar a OpenRouter:", error);
    return "Zorp-error! La API está ocupada o falló la conexión.";
  }
}

console.log(await askAI("Cuantos dias hay"))