"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { meetingNoteSchema, type MeetingNoteInput } from "@/lib/validations/tasks";
import { createMeetingNote, deleteMeetingNote } from "@/app/admin/clients/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type MeetingNote = {
  id: string;
  title: string;
  notes: string;
  meetingDate: Date;
};

export function MeetingNoteSection({
  clientId,
  meetingNotes,
}: {
  clientId: string;
  meetingNotes: MeetingNote[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<MeetingNoteInput>({
    resolver: zodResolver(meetingNoteSchema),
    defaultValues: { title: "", notes: "", meetingDate: "" },
  });

  async function submit(input: MeetingNoteInput) {
    setServerError(null);
    const result = await createMeetingNote(clientId, input);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    reset();
    router.refresh();
  }

  return (
    <div>
      <h2 className="text-sm font-medium">Meeting notes</h2>
      <div className="mt-2 space-y-2">
        {meetingNotes.length === 0 ? (
          <p className="text-sm text-muted-foreground">None</p>
        ) : (
          meetingNotes.map((note) => (
            <div key={note.id} className="rounded-md border border-border/60 p-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{note.title}</span>
                <span className="text-xs text-muted-foreground">
                  {note.meetingDate.toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-muted-foreground">{note.notes}</p>
              <Button
                type="button"
                variant="destructive"
                size="xs"
                className="mt-2"
                disabled={isPending}
                onClick={() => {
                  if (!confirm("Delete this meeting note?")) return;
                  startTransition(async () => {
                    await deleteMeetingNote(clientId, note.id);
                    router.refresh();
                  });
                }}
              >
                Delete
              </Button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit(submit)} className="mt-4 space-y-2 border-t border-border/60 pt-4">
        <Label htmlFor="meeting-title" className="text-xs">
          New meeting note
        </Label>
        <Input id="meeting-title" placeholder="Title" {...register("title")} />
        <Input id="meeting-date" type="date" {...register("meetingDate")} />
        <Textarea id="meeting-notes" placeholder="Notes" rows={3} {...register("notes")} />
        {serverError ? <p className="text-xs text-destructive">{serverError}</p> : null}
        <Button type="submit" size="sm" disabled={isSubmitting}>
          Add note
        </Button>
      </form>
    </div>
  );
}
