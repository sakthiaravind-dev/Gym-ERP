import React, { useState } from "react";



interface PackageData {
  packageName: string;
  packageDescription: string;
  packageAmount: string;
  packageDuration: string;
  packageService: string;
  type: string;
  status: string;
  packageTax: string;
  

}

const AddPackage: React.FC = () => {
   
  const [packageData, setPackageData] = useState<PackageData>({
  packageName: "",
  packageDescription:"",
  packageAmount: "",
  packageDuration: "",
  packageService: "",
  type: "",
  status: "",
  packageTax: "", 
  });

 


  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setPackageData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Transaction Data Submitted:", packageData);
    // Add logic to handle form submission (e.g., API call)
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", padding: 10, marginBottom: "30px", fontWeight: "bold", fontSize: 18, borderBottom: "1px solid #ccc" }}>Add Package</h2>
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
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
              Package Name*
            </label>
            <input
              type="text"
              name="packageName"
              value={packageData.packageName}
              onChange={handleChange}
              placeholder="Package Name"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13,color: "#71045f" }}>
              Package duration*
            </label>
            <input
              type="text"
              name="packageDuration"
              value={packageData.packageDuration}
              onChange={handleChange}
              placeholder="Package duration"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f"}}>
              Package description
            </label>
            <input
              type="text"
              name="PackageDescription"
              value={packageData.packageDescription}
              onChange={handleChange}
              placeholder="Package description"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
              Package service
            </label>
            <input
              type="text"
              name="packageService"
              value={packageData.packageService}
              onChange={handleChange}
              placeholder="Package service"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
              Package Amount*
            </label>
            <input
              type="text"
              name="packageAmount"
              value={packageData.packageAmount}
              onChange={handleChange}
              placeholder="NaN"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Status*
            </label>
            <select
              name="status"
              value={packageData.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">-----</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Type
            </label>
            <select
              name="type"
              value={packageData.type}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">-----</option>
              <option value="monthly">Monthly</option>
              <option value="quaterly">Quaterly</option>
              <option value="half-yearly">Half-yearly</option>
              <option value="yearly">Yearly</option>
              
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
              Package Tax*
            </label>
            <input
              type="text"
              name="packageTax"
              value={packageData.packageTax}
              onChange={handleChange}
              placeholder="Package Tax(%)"
              style={inputStyle}
            />
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

export default AddPackage;