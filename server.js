import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {

const { role, reason, extra } = req.body;

const prompt = `
Return ONLY JSON:
{ "tag": string, "score": number }

Tags:
High Potential, Experienced Developer, Beginner, UI Strong, Needs Review, Low Effort, Spam Risk

Role: ${role}
Reason: ${reason}
Extra: ${extra}
`;

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
method:"POST",
headers:{
"Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
"Content-Type":"application/json"
},
body: JSON.stringify({
model:"openai/gpt-4o-mini",
messages:[
{ role:"system", content:"You return only JSON." },
{ role:"user", content:prompt }
]
})
});

const json = await response.json();

try{
const text = json.choices[0].message.content;
res.json(JSON.parse(text));
}catch{
res.json({tag:"Needs Review", score:5});
}

});

app.listen(3000, ()=>console.log("AI running"));
