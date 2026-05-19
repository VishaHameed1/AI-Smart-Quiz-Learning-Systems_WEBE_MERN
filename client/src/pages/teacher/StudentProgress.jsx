import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import teacherService from '../../services/teacherService';

const StudentProgress = () => {
  const { studentId } = useParams();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await teacherService.getStudentProgress(studentId);
        setProgress(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, [studentId]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Student Progress</h1>
      {loading ? (
        <div className="rounded-xl bg-slate-900 p-6 text-slate-200">Loading progress...</div>
      ) : (
        <div className="space-y-4">
          {(progress?.attempts || []).length === 0 ? (
            <div className="rounded-xl bg-slate-900 p-6 text-slate-200">No progress data available yet.</div>
          ) : (
            progress.attempts.map((attempt) => (
              <div key={attempt._id} className="rounded-xl bg-slate-900 p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <p className="text-lg font-semibold text-white">{attempt.quizId?.title || 'Unnamed quiz'}</p>
                    <p className="text-sm text-slate-400">{new Date(attempt.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-slate-200">Score: {attempt.percentageScore ?? 0}%</p>
                </div>
                <p className="mt-3 text-slate-300">Status: {attempt.passed ? 'Passed' : 'Needs improvement'}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StudentProgress;
