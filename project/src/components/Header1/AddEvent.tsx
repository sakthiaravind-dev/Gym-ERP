import React, { useState } from "react";
import { useDropzone } from "react-dropzone";


interface EventData {
  name: string;
  date: string;
  time: string;
  description: string;
  selectImage: string;
 
}

const AddEvent: React.FC = () => {
   
  const [eventData, setEventData] = useState<EventData>({
  name: "",
  date: "",
  time: "",
  description: "",
  selectImage: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedImage(file); // Store the selected file
      setPreviewUrl(URL.createObjectURL(file)); // Create a preview URL for the image
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'application/pdf': ['.pdf'],
      },
    maxFiles: 1, // Allow only one image
  });


  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Member Data Submitted:", eventData);
    // Add logic to handle form submission (e.g., API call)
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", padding: 10, marginBottom: "30px", fontWeight: "bold", fontSize: 18, borderBottom: "1px solid #ccc" }}>Add Event</h2>
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
              Name*
            </label>
            <input
              type="text"
              name="name"
              value={eventData.name}
              onChange={handleChange}
              placeholder="Name"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Date*
            </label>
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Time*
            </label>
            <input
              type="time"
              name="time"
              value={eventData.time}
              onChange={handleChange}
              placeholder="Enter time"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Description
            </label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
              placeholder="Enter description"
              style={{ ...inputStyle, height: "60px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Select image of receipt to upload
            </label>

          <div
          
          {...getRootProps()}
          style={{
            border: "2px dashed #2485bd",
            padding: "7px",
            borderRadius: "8px",
            textAlign: "center",
            cursor: "pointer",
            marginBottom: "20px",
            width: 400,
            height: 40
          }}
        >
             
          <input {...getInputProps()} />
          <p style={{ margin: 0 }}>Choose File</p>
        </div>
        </div>
        {previewUrl && (
          <div style={{ marginBottom: "20px" }}>
            <img
              src={previewUrl}
              alt="Selected"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              }}
            />
            <p style={{ fontSize: "14px", marginTop: "10px" }}>
              Selected File: {selectedImage?.name}
            </p>
          </div>
        )}

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

export default AddEvent;