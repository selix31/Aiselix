import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(express.json());

// Permet de lire ton fichier index.html
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

// Connexion à OpenAI avec ta clé secrète
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// C'est ici que ton fetch("/api/chat") arrive !
app.post('/api/chat', async (req, res) => {
  try {
    const { character, messages } = req.body;

    // On donne une personnalité selon le personnage choisi dans ton HTML
    let systemPrompt = "Tu es un assistant IA utile.";
    if (character === "Alex") {
      systemPrompt = "Tu es Alex, un ami virtuel super sympa, dynamique et amical. Tu réponds de manière courte et enjouée.";
    } else if (character === "Emma") {
      systemPrompt = "Tu es Emma, une amie virtuelle douce, empathique et attentionnée. Tu réponds de manière chaleureuse.";
    } else if (character === "Robo") {
      systemPrompt = "Tu es Robo, un robot amical et un peu geek. Tu aimes utiliser des expressions de robot.";
    }

    // On prépare les messages pour l'API
    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Modèle rapide et pas cher
      messages: apiMessages,
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer: answer });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "L'IA a eu un problème de connexion." });
  }
});

// Lancement du serveur sur le port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
