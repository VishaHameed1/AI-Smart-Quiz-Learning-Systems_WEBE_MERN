import React, { useEffect, useState } from 'react';
import teacherService from '../../services/teacherService';

const TeacherClassReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const res = await teacherService.getClassReport();
        setReport(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Class Report</h1>
      {loading ? (
        <div className="rounded-xl bg-slate-900 p-6 text-slate-200">Loading report...</div>
      ) : (
        <div className="rounded-xl bg-slate-900 p-6 text-slate-200">
          <pre className="whitespace-pre-wrap break-words">{report?.report || 'No report available yet.'}</pre>
        </div>
      )}
    </div>
  );
};

export default TeacherClassReport;
