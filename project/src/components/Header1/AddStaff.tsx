import React, { useState } from "react";
import { useDropzone } from "react-dropzone";


interface StaffData {
  dateOfJoining: string;
  employeeID: string;
  employeeDOB: string;
  employeeEmail: string;
  employeePhoneNumber: string;
  employeeAddress: string;
  gender: string;
  employeeName: string;
  employeeBloodGroup: string,
  employeeFatherName: string,
  employeeMotherName: string,
  employeePrimarySkill: string,
  branch: string,
  employeeMaritalStatus: string,
  documentIdNumber: string;
  identityDocumentType: string;
  designation: string,
  
}

const AddStaff: React.FC = () => {
   
  const [staffData, setStaffData] = useState<StaffData>({
    dateOfJoining: "",
    employeeID: "",
    employeeDOB: "",
    employeeEmail: "",
    employeePhoneNumber: "",
    employeeAddress: "",
    gender: "",
    employeeName: "",
    employeeBloodGroup: "",
    employeeFatherName: "",
    employeeMotherName: "",
    employeePrimarySkill: "",
    branch: "",
    employeeMaritalStatus: "",
    documentIdNumber: "",
    identityDocumentType: "",
    designation: "",
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
    setStaffData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Member Data Submitted:", staffData);
    // Add logic to handle form submission (e.g., API call)
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", padding: 10, marginBottom: "30px", fontWeight: "bold", fontSize: 18, borderBottom: "1px solid #ccc" }}>Add Employee</h2>
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
              Date of joining*
            </label>
            <input
              type="date"
              name="dateOfJoining"
              value={staffData.dateOfJoining}
              onChange={handleChange}
              placeholder="dd-mm-yyyy"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Employee ID*
            </label>
            <input
              type="text"
              name="employeeID"
              value={staffData.employeeID}
              onChange={handleChange}
              placeholder="Employee ID"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Employee Name*
            </label>
            <input
              type="text"
              name="employeeName"
              value={staffData.employeeName}
              onChange={handleChange}
              placeholder="Employee Name"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Employee Blood Group
            </label>
            <input
              type="text"
              name="employeeBloodGroup"
              value={staffData.employeeBloodGroup}
              onChange={handleChange}
              placeholder="Employee Blood Group"
              style={inputStyle}
            />
          </div>

          

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Employee DOB*
            </label>
            <input
              type="date"
              name="employeeDOB"
              value={staffData.employeeDOB}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Employee Phone Number*
            </label>
            <input
              type="text"
              name="employeePhoneNumber"
              value={staffData.employeePhoneNumber}
              onChange={handleChange}
              placeholder="Employee Phone Number"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Employee Email
            </label>
            <input
              type="email"
              name="employeeEmail"
              value={staffData.employeeEmail}
              onChange={handleChange}
              placeholder="Employee email"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Gender
            </label>
            <select
              name="gender"
              value={staffData.gender}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">-----</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Branch
            </label>
            <select
              name="branch"
              value={staffData.branch}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">-----</option>
              <option value="Focus7">Focus7 fitness and Sports club </option>
              
              
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Identity Document Type
            </label>
            <select
             
              name="identityDocumentType"
              value={staffData.identityDocumentType}
              onChange={handleChange}
              style={inputStyle}
            >
                 <option value="">-----</option>
              <option value="Aadhar">Aadhar card</option>
              <option value="Pan">PAN card</option>
              <option value="Passport">Indian Passport</option>
              <option value="License">Driving license</option>
              <option value="Electoral">Electoral photo identity card</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Document ID Number
            </label>
            <input
              type="text"
              name="documentIdNumber"
              value={staffData.documentIdNumber}
              onChange={handleChange}
              placeholder="document ID Number"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Employee Father Name
            </label>
            <input
              type="text"
              name="employeeFatherName"
              value={staffData.employeeFatherName}
              onChange={handleChange}
              placeholder="Employee Father Name"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Employee Mother Name
            </label>
            <input
              type="text"
              name="employeeMotherName"
              value={staffData.employeeMotherName}
              onChange={handleChange}
              placeholder="Employee Mother Name"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Employee Primary Skill/compentency
            </label>
            <input
              type="text"
              name="employeePrimarySkill"
              value={staffData.employeePrimarySkill}
              onChange={handleChange}
              placeholder="Employee Skill"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Employee Marital Status
            </label>
            <select
             
              name="employeeMaritalStatus"
              value={staffData.employeeMaritalStatus}
              onChange={handleChange}
              style={inputStyle}
            >
                 <option value="">-----</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Designation
            </label>
            <select
             
              name="designation"
              value={staffData.designation}
              onChange={handleChange}
              style={inputStyle}
            >
                 <option value="">-----</option>
              <option value="Aadhar">Senior Trainer</option>
              <option value="Pan">Trainer</option>
              <option value="Passport">Substitute</option>
              <option value="License">Administator</option>
              
            </select>
          </div>


          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Member Address
            </label>
            <textarea
              name="memberAddress"
              value={staffData.employeeAddress}
              onChange={handleChange}
              placeholder="Enter Address"
              style={{ ...inputStyle, height: "60px" }}
            />
          </div>

          

          
          
            <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Select Image to upload
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
            Add Employee to list
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

export default AddStaff;