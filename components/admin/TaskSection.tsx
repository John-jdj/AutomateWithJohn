"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, taskStatuses, type TaskInput, type TaskStatusValue } from "@/lib/validations/tasks";
import { createTask, setTaskStatus, deleteTask } from "@/app/admin/clients/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatusValue;
  dueDate: Date | null;
};

export function TaskSection({ clientId, tasks }: { clientId: string; tasks: Task[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "", description: "", dueDate: "", assignedToId: "" },
  });

  async function submit(input: TaskInput) {
    setServerError(null);
    const result = await createTask(clientId, input);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    reset();
    router.refresh();
  }

  return (
    <div>
      <h2 className="text-sm font-medium">Tasks</h2>
      <div className="mt-2 space-y-2">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">None</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="rounded-md border border-border/60 p-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span>{task.title}</span>
                <Badge variant="secondary">{task.status}</Badge>
              </div>
              {task.dueDate ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  Due {task.dueDate.toLocaleDateString()}
                </p>
              ) : null}
              <div className="mt-2 flex items-center gap-2">
                <select
                  value={task.status}
                  disabled={isPending}
                  onChange={(e) =>
                    startTransition(async () => {
                      await setTaskStatus(clientId, task.id, e.target.value as TaskStatusValue);
                      router.refresh();
                    })
                  }
                  className="h-7 rounded-md border border-input bg-transparent px-1.5 text-xs outline-none dark:bg-input/30"
                >
                  {taskStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="destructive"
                  size="xs"
                  disabled={isPending}
                  onClick={() => {
                    if (!confirm("Delete this task?")) return;
                    startTransition(async () => {
                      await deleteTask(clientId, task.id);
                      router.refresh();
                    });
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit(submit)} className="mt-4 space-y-2 border-t border-border/60 pt-4">
        <Label htmlFor="task-title" className="text-xs">
          New task
        </Label>
        <Input id="task-title" placeholder="Title" {...register("title")} />
        <Input id="task-dueDate" type="date" {...register("dueDate")} />
        {serverError ? <p className="text-xs text-destructive">{serverError}</p> : null}
        <Button type="submit" size="sm" disabled={isSubmitting}>
          Add task
        </Button>
      </form>
    </div>
  );
}
