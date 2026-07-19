-- Deleting a project with an existing case study previously failed with a
-- foreign key violation (case_studies.projectId was ON DELETE RESTRICT).
-- The admin "Delete project" action should remove its case study along
-- with it (mirrors the comments.postId fix in Phase 5).

ALTER TABLE "case_studies" DROP CONSTRAINT "case_studies_projectId_fkey";
ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
