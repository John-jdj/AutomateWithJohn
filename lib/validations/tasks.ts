import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")), // yyyy-mm-dd from <input type="date">
  assignedToId: z.string().optional().or(z.literal("")),
});

export type TaskInput = z.infer<typeof taskSchema>;

export const taskStatuses = ["TODO", "IN_PROGRESS", "DONE"] as const;
export type TaskStatusValue = (typeof taskStatuses)[number];

export const meetingNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  notes: z.string().min(1, "Notes are required").max(4000),
  meetingDate: z.string().min(1, "Meeting date is required"), // yyyy-mm-dd
});

export type MeetingNoteInput = z.infer<typeof meetingNoteSchema>;
