-- Deleting a blog post with existing comments previously failed with a
-- foreign key violation (comments.postId was ON DELETE RESTRICT). The
-- admin "Delete post" action should remove its comments along with it.

ALTER TABLE "comments" DROP CONSTRAINT "comments_postId_fkey";
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey"
  FOREIGN KEY ("postId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
