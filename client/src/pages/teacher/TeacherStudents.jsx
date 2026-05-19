import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import teacherService from '../../services/teacherService';

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await teacherService.getStudents();
        setStudents(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Student Roster</h1>
          <p className="text-slate-400">Browse your learners and drill into progress records.</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl bg-slate-900 p-6 text-slate-200">Loading students…</div>
      ) : (
        <div className="grid gap-4">
          {students.map((student) => (
            <div key={student._id} className="glass-card p-6 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">{student.name}</h2>
                <p className="text-slate-400">{student.email}</p>
              </div>
              <Link
                to={`/teacher/students/${student._id}/progress`}
                className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition"
              >
                View Progress
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherStudents;
