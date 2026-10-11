function StudentDetails({ student }) {
  if (!student) {
    return <p className="empty">No student details submitted yet.</p>;
  }

  return (
    <div className="details">
      <h2>Student Details</h2>
      <p><b>Name:</b> {student.name}</p>
      <p><b>Roll Number:</b> {student.roll}</p>
      <p><b>Department:</b> {student.department}</p>
      <p><b>Marks:</b> {student.marks} / 100</p>
      <p><b>Percentage:</b> {student.marks}%</p>
    </div>
  );
}

export default StudentDetails;