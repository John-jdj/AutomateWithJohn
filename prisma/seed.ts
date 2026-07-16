import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@automatewithjohn.com" },
    update: {},
    create: {
      authId: "seed-admin-auth-id",
      email: "admin@automatewithjohn.com",
      name: "John",
      role: "ADMIN",
    },
  });

  const clientUser = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      authId: "seed-client-auth-id",
      email: "client@example.com",
      name: "Sample Client",
      role: "CLIENT",
      client: {
        create: {
          company: "Example Co.",
          phone: "+1-555-0100",
        },
      },
    },
    include: { client: true },
  });

  const client = await prisma.client.findUniqueOrThrow({
    where: { userId: clientUser.id },
  });

  const project = await prisma.project.upsert({
    where: { slug: "example-saas-dashboard" },
    update: {},
    create: {
      title: "Example SaaS Dashboard",
      slug: "example-saas-dashboard",
      summary: "A analytics dashboard rebuild for Example Co.",
      description:
        "Full redesign and rebuild of the client's internal analytics dashboard, focused on load time and data clarity.",
      images: [],
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
      category: "Web App",
      featured: true,
      publishedAt: new Date(),
      clientId: client.id,
      caseStudy: {
        create: {
          challenge: "Legacy dashboard took 8+ seconds to load key reports.",
          solution:
            "Rebuilt data layer with server-side pagination and incremental static regeneration.",
          results: "Load time dropped to under 1 second; client NPS up 20 points.",
          metrics: { loadTimeImprovement: "87%", npsChange: "+20" },
        },
      },
    },
  });

  await prisma.testimonial.upsert({
    where: { id: "seed-testimonial-1" },
    update: {},
    create: {
      id: "seed-testimonial-1",
      clientName: "Sample Client",
      clientRole: "Founder",
      company: "Example Co.",
      content: "The new dashboard transformed how our team works. Fast, clear, reliable.",
      rating: 5,
      featured: true,
      clientId: client.id,
      projectId: project.id,
    },
  });

  await prisma.service.upsert({
    where: { slug: "web-development" },
    update: {},
    create: {
      title: "Web Development",
      slug: "web-development",
      description: "Custom-built, production-grade web applications.",
      features: ["Next.js + TypeScript", "CMS integration", "SEO baseline"],
      priceFrom: 2500,
      category: "Development",
      order: 1,
    },
  });

  const post = await prisma.blogPost.upsert({
    where: { slug: "hello-world" },
    update: {},
    create: {
      title: "Hello World",
      slug: "hello-world",
      excerpt: "Our first post.",
      content: "Welcome to the AutomateWithJohn blog.",
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: admin.id,
      tags: ["announcement"],
    },
  });

  await prisma.comment.upsert({
    where: { id: "seed-comment-1" },
    update: {},
    create: {
      id: "seed-comment-1",
      authorName: "Reader",
      authorEmail: "reader@example.com",
      content: "Great first post!",
      status: "APPROVED",
      postId: post.id,
    },
  });

  const message = await prisma.contactMessage.upsert({
    where: { id: "seed-message-1" },
    update: {},
    create: {
      id: "seed-message-1",
      name: "Prospective Client",
      email: "prospect@example.com",
      content: "Interested in a redesign of our marketing site.",
      source: "contact_form",
      status: "NEW",
    },
  });

  const lead = await prisma.lead.upsert({
    where: { id: "seed-lead-1" },
    update: {},
    create: {
      id: "seed-lead-1",
      name: "Prospective Client",
      email: "prospect@example.com",
      stage: "NEW",
      source: "contact_message",
      sourceMessageId: message.id,
    },
  });

  await prisma.task.upsert({
    where: { id: "seed-task-1" },
    update: {},
    create: {
      id: "seed-task-1",
      title: "Follow up on proposal",
      status: "TODO",
      clientId: client.id,
      assignedToId: admin.id,
    },
  });

  await prisma.meetingNote.upsert({
    where: { id: "seed-meeting-1" },
    update: {},
    create: {
      id: "seed-meeting-1",
      title: "Kickoff call",
      notes: "Discussed scope, timeline, and success metrics.",
      meetingDate: new Date(),
      clientId: client.id,
      createdById: admin.id,
    },
  });

  const invoice = await prisma.invoice.upsert({
    where: { number: "INV-0001" },
    update: {},
    create: {
      number: "INV-0001",
      amount: 2500,
      currency: "INR",
      status: "SENT",
      items: [{ description: "Dashboard rebuild — milestone 1", quantity: 1, unitPrice: 2500 }],
      clientId: client.id,
      projectId: project.id,
    },
  });

  await prisma.payment.upsert({
    where: { id: "seed-payment-1" },
    update: {},
    create: {
      id: "seed-payment-1",
      amount: 2500,
      currency: "INR",
      status: "SUCCESS",
      method: "card",
      invoiceId: invoice.id,
    },
  });

  console.log("Seed complete:", { lead: lead.id, invoice: invoice.number });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
