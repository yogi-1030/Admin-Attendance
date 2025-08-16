import { Router } from "express";
import { prisma } from "../prisma.js";
import { reportQuerySchema } from "../lib/validators.js";
const r = Router();

r.get("/summary", async (req, res) => {
  const parse = reportQuerySchema.safeParse(req.query);
  if (!parse.success) return res.status(400).json({ error: parse.error.format() });
  const { from, to } = parse.data;
  const f = new Date(from), t = new Date(to);

  const members = await prisma.member.findMany({ orderBy: { id: "asc" } });
  const records = await prisma.attendance.findMany({
    where: { date: { gte: f, lte: t } }
  });

  // per-user counts
  const byUser = members.map(m => {
    const mine = records.filter(r => r.memberId === m.id);
    const present = mine.filter(r => r.status === "PRESENT").length;
    const absent = mine.filter(r => r.status === "ABSENT").length;
    return { memberId: m.id, name: m.name, present, absent, total: present + absent };
  });

  // overall rate
  const total = records.length;
  const present = records.filter(r => r.status === "PRESENT").length;
  const overallRate = total ? Math.round((present / total) * 100) : 0;

  res.json({ byUser, overallRate, totalDaysCounted: total });
});

export default r;