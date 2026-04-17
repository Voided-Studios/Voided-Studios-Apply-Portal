import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 Resend API KEY from Render ENV
const resend = new Resend(process.env.RESEND_API_KEY);

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
res.send("Voided Studios backend is running.");
});

/* =========================
   SEND APPLICATION EMAIL
========================= */
app.post("/send-email", async (req, res) => {
const { email, name, role, status } = req.body;

if (!email || !name || !role || !status) {
return res.json({ success: false, error: "Missing fields" });
}

try {
const response = await resend.emails.send({
from: "Voided Studios <onboarding@resend.dev>",
to: email,
subject: `Voided Studios Application - ${status.toUpperCase()}`,
text: `
Hello ${name},

Your application has been ${status.toUpperCase()}.

Role: ${role}

Thank you for applying to Voided Studios!
- Voided Studios Team
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
console.log(`Server running on port ${PORT}`);
});
