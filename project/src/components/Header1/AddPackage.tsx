import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/// <reference types="vite/client" />
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PackageData {
  packageName: string;
  packageAddedby: string;
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
    packageAddedby: "",
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Package Data Submitted:", packageData);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await supabase
        .from('current_package')
        .insert([{
          package_name: packageData.packageName,
          package_duration: packageData.packageDuration,
          package_description: packageData.packageAddedby,
          package_service: packageData.packageService,
          package_amount: packageData.packageAmount,
          status: packageData.status,
          type: packageData.type,
          package_tax: packageData.packageTax,
        }]);

      if (error) {
        throw error;
      }

      toast.success("Package added successfully!");
      setPackageData({
        packageName: "",
        packageAddedby: "",
        packageAmount: "",
        packageDuration: "",
        packageService: "",
        type: "",
        status: "",
        packageTax: "",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Failed to add package: " + error.message);
      } else {
        toast.error("Failed to add package");
      }
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
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
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
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
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
              Added By
            </label>
            <input
              type="text"
              name="packageAddedby"
              value={packageData.packageAddedby}
              onChange={handleChange}
              placeholder="Package Added by"
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