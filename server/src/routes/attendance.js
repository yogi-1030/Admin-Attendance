import { Router } from "express";
import { prisma } from "../prisma.js";
import { attendanceMarkSchema } from "../lib/validators.js";
const r = Router();

// Get list for a given date (to prefill UI)
r.get("/", async (req, res) => {
  const date = req.query.date; // ISO (yyyy-mm-dd)
  if (!date) return res.status(400).json({ error: "date is required" });
  const d = new Date(date);
  // pull members + existing marks
  const members = await prisma.member.findMany({ orderBy: { id: "asc" } });
  const marks = await prisma.attendance.findMany({ where: { date: d } });
  res.json({ members, marks });
});

// Bulk mark attendance
r.post("/mark", async (req, res) => {
  const parse = attendanceMarkSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.format() });
  const { date, records } = parse.data;
  const d = new Date(date);

  // Upsert each record (keeps idempotency)
  const tasks = records.map(r =>
    prisma.attendance.upsert({
      where: { // unique composed key alternative with findFirst + create/update
        // Prisma needs explicit unique; for brevity, perform deleteMany+create
        id: 0
      },
      update: {},
      create: { date: d, status: r.status, memberId: r.memberId }
    })
  );
  // simple: delete existing then create in bulk
  await prisma.attendance.deleteMany({ where: { date: d } });
  await prisma.attendance.createMany({
    data: records.map(r => ({ date: d, status: r.status, memberId: r.memberId }))
  });

  res.json({ ok: true });
});

export default r;