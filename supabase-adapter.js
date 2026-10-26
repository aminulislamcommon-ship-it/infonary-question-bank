// Infonary ICT Question Bank — Supabase adapter
// Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in index.html.
// Never put a secret/service_role key in browser code.
const SUPABASE_URL = "PASTE_PROJECT_URL_HERE";
const SUPABASE_PUBLISHABLE_KEY = "PASTE_PUBLISHABLE_KEY_HERE";
const QUESTIONS_ENDPOINT = `${SUPABASE_URL}/rest/v1/questions`;

function supaHeaders(extra = {}) {
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
    "Content-Type": "application/json",
    ...extra
  };
}

// This adapter expects an authenticated Supabase access token.
// It deliberately does not pretend the publishable key is a user login.
async function supaRequest(path, options = {}, accessToken) {
  if (!SUPABASE_URL.startsWith("https://") ||
      SUPABASE_PUBLISHABLE_KEY.startsWith("PASTE_")) {
    throw new Error("Supabase URL ও Publishable Key index.html-এ সেট করুন।");
  }
  if (!accessToken) {
    throw new Error("আগে Supabase Auth দিয়ে শিক্ষক লগইন চালু করতে হবে।");
  }
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      ...supaHeaders(options.headers || {}),
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase error ${response.status}: ${detail}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

async function listMyQuestions(accessToken) {
  return supaRequest(
    "questions?select=*&order=created_at.desc",
    { method: "GET" },
    accessToken
  );
}

async function addMyQuestion(question, accessToken) {
  const row = {
    owner_id: question.owner_id, // Must equal the logged-in user's UUID.
    grade: question.grade,
    subject: question.subject,
    chapter: question.chapter,
    topic: question.topic || null,
    question_type: question.type,
    question_text: question.text,
    options: question.options || [],
    correct_answer: question.correct || null,
    marks: question.marks || 1,
    difficulty: question.difficulty || "সাধারণ",
    explanation: question.answer || null
  };
  return supaRequest(
    "questions?select=*",
    {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(row)
    },
    accessToken
  );
}

async function updateMyQuestion(id, question, accessToken) {
  const row = {
    grade: question.grade,
    subject: question.subject,
    chapter: question.chapter,
    topic: question.topic || null,
    question_type: question.type,
    question_text: question.text,
    options: question.options || [],
    correct_answer: question.correct || null,
    marks: question.marks || 1,
    difficulty: question.difficulty || "সাধারণ",
    explanation: question.answer || null,
    updated_at: new Date().toISOString()
  };
  return supaRequest(
    `questions?id=eq.${encodeURIComponent(id)}&select=*`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(row)
    },
    accessToken
  );
}

async function deleteMyQuestion(id, accessToken) {
  return supaRequest(
    `questions?id=eq.${encodeURIComponent(id)}`,
    { method: "DELETE" },
    accessToken
  );
}
