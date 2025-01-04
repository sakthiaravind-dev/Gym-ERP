import React, { useState } from "react";



interface WorkoutData {
  id: string;
  name: string;
  type: string;
  group: string;
 
 
}

const AddWorkout: React.FC = () => {
   
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
  id: "",
  name: "",
  type: "",
  group: "",
  });

  

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setWorkoutData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Member Data Submitted:", workoutData);
    // Add logic to handle form submission (e.g., API call)
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", padding: 10, marginBottom: "30px", fontWeight: "bold", fontSize: 18, borderBottom: "1px solid #ccc" }}>Add Workout</h2>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* Column 1 */}
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Workout ID*
            </label>
            <input
              type="text"
              name="id"
              value={workoutData.id}
              onChange={handleChange}
              placeholder="ID"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Workout Name*
            </label>
            <input
              type="text"
              name="name"
              value={workoutData.name}
              onChange={handleChange}
              placeholder="Name"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Workout Type
            </label>
            <input
              type="text"
              name="type"
              value={workoutData.type}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Select Workout Group
            </label>
            <select
              name="group"
              value={workoutData.group}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">-----</option>
              <option value="warmup">Warm up</option>
              <option value="cardio">Cardio</option>
              <option value="core">Core</option>
              <option value="weight">Weight Training</option>
              <option value="cool">Cool down</option>
              
            </select>
          </div>
         
        </div>

          

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            type="submit"
            style={{
              padding: "5px 15px",
              backgroundColor: "#2485bd",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add to List
          </button>
        </div>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

export default AddWorkout;