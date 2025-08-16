import { Router } from "express";
import { prisma } from "../prisma.js";
import { memberSchema } from "../lib/validators.js";
const r = Router();

r.get("/", async (_req, res) => {
  const data = await prisma.member.findMany({ orderBy: { id: "asc" } });
  res.json(data);
});

r.post("/", async (req, res) => {
  const parse = memberSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.format() });
  try {
    const created = await prisma.member.create({ data: parse.data });
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

r.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parse = memberSchema.partial().safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.format() });
  try {
    const updated = await prisma.member.update({ where: { id }, data: parse.data });
    res.json(updated);
  } catch (e) {
    res.status(404).json({ error: "Member not found" });
  }
});

r.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.attendance.deleteMany({ where: { memberId: id } });
    await prisma.member.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    res.status(404).json({ error: "Member not found" });
  }
});

export default r;