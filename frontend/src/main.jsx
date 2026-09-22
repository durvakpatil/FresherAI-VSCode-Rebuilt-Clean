console.log(">>> MAIN.JSX IS EXECUTING <<<");
alert("Frontend script connected!");
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/styles.css';
import { HomePage, LoginPage, SignupPage, ProtectedLayout, DashboardPage, RoadmapPage, NotFoundPage } from '@/pages';
import { ResumeAgent } from '@/components/agents/resume-agent';
import { InterviewAgent } from '@/components/agents/interview-agent';
import { FeedbackAgent } from '@/components/agents/feedback-agent';
import { ProfileForm } from '@/components/profile/profile-form';
import { SettingsPanel } from '@/components/profile/settings-panel';

const queryClient = new QueryClient();

// Main browser entry point. React Router maps URLs to the corresponding page.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/resume" element={<ResumeAgent />} />
            <Route path="/interview" element={<InterviewAgent />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/feedback" element={<FeedbackAgent />} />
            <Route path="/profile" element={<ProfileForm />} />
            <Route path="/settings" element={<SettingsPanel />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
