import { Router } from 'express';
import { z } from 'zod';
import { generateStructured, AIServiceError } from '../ai/aiService.js';
import { analysisSchema, roadmapSchema, questionsSchema, gradeSchema, summarySchema, feedbackSchema, resumeBuildSchema } from '../ai/schemas.js';

const router = Router();
const MAX_CONTENT = 30000;
const difficulties = ['easy', 'medium', 'hard'];
const profileColumns = 'id, full_name, degree, college, location, target_role, experience_level, bio, github_url, linkedin_url, portfolio_url, notifications_enabled, ai_model_preference';
const ok = (res, data) => res.json(data);
const fail = (res, message, code = 400) => res.status(code).json({ status: 'error', message });

router.post('/dashboard', async (req, res) => {
  const db = req.supabase, userId = req.user.id;
  try {
    const [resumeRes, interviewRes, roadmapRes, feedbackRes, activityRes, profileRes] = await Promise.all([
      db.from('resumes').select('ats_score').order('created_at', { ascending: false }).limit(1).maybeSingle(),
      db.from('interviews').select('overall_score').eq('status', 'completed').order('created_at', { ascending: false }).limit(10),
      db.from('roadmaps').select('weeks').order('created_at', { ascending: false }).limit(1).maybeSingle(),
      db.from('feedback_reports').select('readiness_score').order('created_at', { ascending: false }).limit(1).maybeSingle(),
      db.from('activities').select('id, type, title, subtitle, score, created_at').order('created_at', { ascending: false }).limit(8),
      db.from('profiles').select(profileColumns).eq('id', userId).maybeSingle(),
    ]);
    const interviewScores = (interviewRes.data || []).map(x => x.overall_score).filter(x => typeof x === 'number');
    const weeks = roadmapRes.data?.weeks || [];
    const totalTopics = weeks.reduce((n, w) => n + (w.topics?.length || 0), 0);
    const doneTopics = weeks.reduce((n, w) => n + (w.topics?.filter(t => t.done).length || 0), 0);
    return ok(res, { stats: {
      resumeScore: resumeRes.data?.ats_score ?? null,
      interviewScore: interviewScores.length ? Math.round(interviewScores.reduce((a,b)=>a+b,0)/interviewScores.length) : null,
      roadmapProgress: totalTopics ? Math.round(doneTopics / totalTopics * 100) : null,
      readinessScore: feedbackRes.data?.readiness_score ?? null,
      interviewCount: interviewScores.length,
    }, activities: activityRes.data || [], profile: profileRes.data || null });
  } catch (e) { console.error(e); return fail(res, 'Could not load your dashboard.', 500); }
});
// Export the dashboard router so the server can use these routes.
export default router;
