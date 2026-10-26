# Infonary ICT Question Bank — Prototype v0.1

বাংলা প্রশ্নব্যাংক, শিক্ষক/শিক্ষার্থী/Admin UI, MCQ/CQ প্রশ্ন যোগ, ফিল্টার, প্রশ্ন নির্বাচন, প্রশ্নপত্র প্রিভিউ, browser Print-to-PDF, JSON import/export-সহ একটি চলমান front-end prototype.

## চালানোর নিয়ম
1. `index.html` ফাইলটি Chrome/Edge-এ খুলুন। কোনো build step লাগবে না।
2. প্রশ্ন যোগ করুন; প্রশ্নগুলো একই ব্রাউজারের `localStorage`-এ থাকবে।
3. Question Paper Maker-এ প্রশ্ন নির্বাচন করে `প্রিভিউ তৈরি করুন` চাপুন; `PDF / Print` থেকে Save as PDF দিন।
4. ডেটা ব্যাকআপ নিতে JSON Export ব্যবহার করুন।

## গুরুত্বপূর্ণ সীমাবদ্ধতা
এটি এখনো production full-stack system নয়। login/role selector কেবল demo UI; কোনো real authentication, server, shared database, permission enforcement, cloud backup, online exam submission বা server-side PDF নেই। একাধিক শিক্ষক/শিক্ষার্থীর নিরাপদ ব্যবহারের জন্য backend, database, authentication, authorization, validation, backups, hosting ও HTTPS যোগ করতে হবে।

## প্রস্তাবিত production stack
- Frontend: Next.js + TypeScript
- Backend/API: Next.js server routes
- Database/Auth: PostgreSQL + Supabase Auth (role-based access control)
- PDF: print stylesheet initially; server-side PDF if required
- Deployment: Vercel + managed PostgreSQL/Supabase

## Initial data model
- profiles: id, name, role (`admin`, `teacher`, `student`), institution
- subjects: id, name, class_level
- chapters: id, subject_id, name
- questions: id, owner_id, class_level, subject_id, chapter_id, topic, type, body, options_json, answer, explanation, marks, board_label, status, created_at
- papers: id, owner_id, title, class_level, subject_id, duration_minutes, total_marks, created_at
- paper_questions: paper_id, question_id, position, marks_override
- attempts: id, paper_id, student_id, answers_json, score, submitted_at

## Production security checklist
- Server-enforced authentication and roles; never trust the role selector in this prototype.
- Teachers can edit only their own questions unless an admin grants access.
- Students cannot access answer keys before the allowed release time.
- Validate and sanitize all inputs; apply rate limits and audit admin actions.
- Use database backups and secure environment variables.
