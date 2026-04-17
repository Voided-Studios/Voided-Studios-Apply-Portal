import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 Resend API key (Render ENV)
const resend = new Resend(process.env.RESEND_API_KEY);

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
res.json({
status: "online",
message: "Voided Studios Email Backend Running",
endpoints: ["/send-email"]
});
});

/* =========================
   SEND APPLICATION EMAIL
========================= */
app.post("/send-email", async (req, res) => {
const { email, name, role, status } = req.body;

if (!email || !name || !role || !status) {
return res.json({ success: false, error: "Missing fields" });
}

// color logic
const isAccepted = status === "accepted";
const color = isAccepted ? "#00ff88" : "#ff3b3b";
const title = isAccepted ? "ACCEPTED" : "DECLINED";

try {
const response = await resend.emails.send({
from: "Voided Studios <onboarding@resend.dev>",
to: email,
subject: `Voided Studios Application - ${title}`,

html: `
<div style="font-family:Arial;background:#0b0b10;color:#ffffff;padding:25px;border-radius:10px;">

<h1 style="color:#7c3aed;">Voided Studios</h1>

<p>Hello <b>${name}</b>,</p>

<p>Your application status is now:</p>

<h2 style="color:${color};letter-spacing:1px;">
${title}
</h2>

<hr style="border:1px solid #222;" />

<p><b>Role Applied For:</b> ${role}</p>

<br/>

<div style="background:#111;padding:15px;border-radius:8px;">
Thank you for applying to Voided Studios.<br/>
We appreciate your interest in joining the team.
</div>

<br/>

<p style="font-size:12px;color:#888;">
Voided Studios Recruitment System
</p>

</div>
`
});

return res.json({ success: true, response });

} catch (err) {
console.error(err);
return res.json({ success: false, error: err.message });
}
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`Voided backend running on port ${PORT}`);
});
