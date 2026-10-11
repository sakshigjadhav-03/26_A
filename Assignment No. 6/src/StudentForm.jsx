function StudentForm({ onSubmit }) {
  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;

    const student = {
      name: form.name.value,
      roll: form.roll.value,
      department: form.department.value,
      marks: Number(form.marks.value)
    };

    onSubmit(student);
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Student Name</label>
      <input name="name" placeholder="Enter student name" required />

      <label>Roll Number</label>
      <input name="roll" placeholder="Enter roll number" required />

      <label>Department</label>
      <select name="department" required defaultValue="">
        <option value="" disabled>Select department</option>
        <option>Information Technology</option>
        <option>Computer Engineering</option>
        <option>Mechanical Engineering</option>
        <option>Civil Engineering</option>
      </select>

      <label>Marks (out of 100)</label>
      <input
        name="marks"
        type="number"
        min="0"
        max="100"
        placeholder="Enter marks"
        required
      />

      <button type="submit">Submit Details</button>
    </form>
  );
}

export default StudentForm;