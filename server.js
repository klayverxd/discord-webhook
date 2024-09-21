import http from "http";
import fetch from "node-fetch";

const PORT = process.env.PORT || 3003;

// URL do webhook do Discord
const webhookUrl =
	"https://discord.com/api/webhooks/1287093461912260758/NlEouFGmVZof0zAojD85Ing0YHmucO4eFWXzTUaF0Hz8e279nARkRZtE7Xo_acNMGuRI";

// Função para enviar a mensagem
const sendMessage = async message => {
	const now = new Date();
	const hours = now.getHours().toString().padStart(2, "0");
	const minutes = now.getMinutes().toString().padStart(2, "0");
	const seconds = now.getSeconds().toString().padStart(2, "0");

	const body = {
		username: "Bot do Natan",
		avatar_url:
			"https://media.licdn.com/dms/image/v2/D4D35AQHLf4PHSp4GYw/profile-framedphoto-shrink_200_200/profile-framedphoto-shrink_200_200/0/1689222732681?e=1727546400&v=beta&t=g4IAoR0S8cPSAQlGDw_aBmGVRdKe_Byd9gV62ruFXL8",
		content: message || "Natan, tá na hora de muçar.",
		embeds: [
			{
				title: "A hora atual é:",
				description: `${hours}:${minutes}:${seconds}`,
			},
		],
	};

	try {
		const response = await fetch(webhookUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		if (response.ok) {
			console.log("Mensagem enviada com sucesso");
		} else {
			console.error("Erro ao enviar mensagem:", response.statusText);
		}
	} catch (error) {
		console.error("Erro ao enviar a mensagem:", error);
	}
};

// Função para verificar a hora e enviar a mensagem às 12h
const checkTimeAndSend = () => {
	const now = new Date();
	const currentHour = now.getHours();
	const currentMinute = now.getMinutes();

	// Verifica se é 12:00 (meio-dia)
	if (currentHour === 12 && currentMinute === 0) {
		console.log("Enviando mensagem inicial das 12h...");
		sendMessage("É meio-dia, Natan. Tá na hora de muçar!");
		scheduleFollowUpMessages();
	}
};

// Função para agendar os envios subsequentes
const scheduleFollowUpMessages = () => {
	let count = 0;

	// Enviar mensagens a cada minuto por 5 vezes
	const followUpInterval = setInterval(() => {
		if (count < 5) {
			sendMessage(`Mensagem subsequente ${count + 1} de 5.`);
			count++;
		} else {
			clearInterval(followUpInterval); // Para após 5 mensagens
			console.log("Envios subsequentes concluídos.");
		}
	}, 60 * 1000); // 60 segundos (1 minuto)
};

// Verificar a hora a cada minuto
setInterval(checkTimeAndSend, 60 * 1000);

console.log("Bot de agendamento iniciado...");

const server = http.createServer((req, res) => {
	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end("O bot esta rodando!\n");
});

server.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});
