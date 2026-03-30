/**
 * Education Math Engine
 */

export function calculateGPA(subjects: Array<{ name: string; credits: number; grade: number }>) {
  let totalPoints = 0;
  let totalCredits = 0;

  subjects.forEach(s => {
    totalPoints += s.grade * s.credits;
    totalCredits += s.credits;
  });

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

  let category = '';
  if (gpa >= 3.6) category = 'Distinction';
  else if (gpa >= 2.8) category = 'First Division';
  else if (gpa >= 2.0) category = 'Second Division';
  else if (gpa >= 1.6) category = 'Pass';
  else category = 'Fail';

  return {
    gpa: Number(gpa.toFixed(2)),
    totalCredits,
    category,
    percentage: Number((gpa * 25).toFixed(2)) // Simplified conversion
  };
}

export function calculateAttendance(present: number, total: number) {
  const percentage = total > 0 ? (present / total) * 100 : 0;
  const status = percentage >= 75 ? 'Eligible' : 'Not Eligible';
  
  return {
    percentage: Number(percentage.toFixed(2)),
    status
  };
}
