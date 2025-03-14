import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { createClient } from '@supabase/supabase-js';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/// <reference types="vite/client" />
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface MemberData {
  memberId: string;
  memberName: string;
  memberDOB: string;
  memberEmail: string;
  memberPhoneNumber: string;
  memberAddress: string;
  gender: string;
  paymentMode: string;
  documentIdNumber: string;
  identityDocumentType: string;
  referredBy: string;
  memberJoiningDate: string;
  billDate: string;
  memberType: string; // Add memberType field
}

const AddMember: React.FC = () => {
  const [memberData, setMemberData] = useState<MemberData>({
    memberId: "",
    memberName: "",
    memberDOB: "",
    memberEmail: "",
    memberPhoneNumber: "",
    memberAddress: "",
    gender: "",
    paymentMode: "",
    documentIdNumber: "",
    identityDocumentType: "",
    referredBy: "",
    memberJoiningDate: "",
    billDate: "",
    memberType: "", // Initialize memberType
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
    setMemberData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Member Data Submitted:", memberData);

    // Upload image to Supabase storage
    if (selectedImage) {
      const fileName = `member_${memberData.memberId}`;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('images')
        .upload(fileName, selectedImage);

      if (uploadError) {
        toast.error("Failed to upload image: " + uploadError.message);
        return;
      }

      toast.success("Image uploaded successfully!");
    }

    // Insert data into Supabase
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase
      .from('members')
      .insert([
        {
          member_id: memberData.memberId,
          member_name: memberData.memberName,
          member_end_date: memberData.memberDOB,
          member_email: memberData.memberEmail,
          member_phone_number: memberData.memberPhoneNumber,
          member_address: memberData.memberAddress,
          gender: memberData.gender,
          payment_mode: memberData.paymentMode,
          document_id_number: memberData.documentIdNumber,
          identity_document_type: memberData.identityDocumentType,
          referred_by: memberData.referredBy,
          member_joining_date: memberData.memberJoiningDate,
          bill_date: memberData.billDate,
          member_type: memberData.memberType, // Include memberType
        },
      ]);

    if (error) {
      toast.error("Failed to add member: " + error.message);
    } else {
      toast.success("Member added successfully!");
      setMemberData({
        memberId: "",
        memberName: "",
        memberDOB: "",
        memberEmail: "",
        memberPhoneNumber: "",
        memberAddress: "",
        gender: "",
        paymentMode: "",
        documentIdNumber: "",
        identityDocumentType: "",
        referredBy: "",
        memberJoiningDate: "",
        billDate: "",
        memberType: "", // Reset memberType
      });
      setSelectedImage(null);
      setPreviewUrl(null);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
      <h2 style={{ textAlign: "center", padding: 10, marginBottom: "30px", fontWeight: "bold", fontSize: 18, borderBottom: "1px solid #ccc" }}>Member Details</h2>
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
              Member ID
            </label>
            <input
              type="text"
              name="memberId"
              value={memberData.memberId}
              onChange={handleChange}
              placeholder="Member ID"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Bill Date*
            </label>
            <input
              type="date"
              name="billDate"
              value={memberData.billDate}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Member Name*
            </label>
            <input
              type="text"
              name="memberName"
              value={memberData.memberName}
              onChange={handleChange}
              placeholder="Member Name"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Member Joining Date*
            </label>
            <input
              type="date"
              name="memberJoiningDate"
              value={memberData.memberJoiningDate}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Member DOB*
            </label>
            <input
              type="date"
              name="memberDOB"
              value={memberData.memberDOB}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Member Phone Number*
            </label>
            <input
              type="text"
              name="memberPhoneNumber"
              value={memberData.memberPhoneNumber}
              onChange={handleChange}
              placeholder="Member Phone Number"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Member Email
            </label>
            <input
              type="email"
              name="memberEmail"
              value={memberData.memberEmail}
              onChange={handleChange}
              placeholder="Member email"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Gender
            </label>
            <select
              name="gender"
              value={memberData.gender}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">-----</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Transgender">Transgender</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Identity Document Type
            </label>
            <select
              name="identityDocumentType"
              value={memberData.identityDocumentType}
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
              value={memberData.documentIdNumber}
              onChange={handleChange}
              placeholder="document ID Number"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Member Address
            </label>
            <textarea
              name="memberAddress"
              value={memberData.memberAddress}
              onChange={handleChange}
              placeholder="Enter Address"
              style={{ ...inputStyle, height: "60px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Payment Mode*
            </label>
            <select
              name="paymentMode"
              value={memberData.paymentMode}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">-----</option>
              <option value="Cash">Cash</option>
              <option value="Credit">Card</option>
              <option value="POS">POS</option>
              <option value="Google pay">Google pay</option>
              <option value="Paytm">Paytm</option>
              <option value="Amazon pay">Amazon pay</option>
              <option value="Netbanking">Netbanking</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Referred By
            </label>
            <input
              type="text"
              name="referredBy"
              value={memberData.referredBy}
              onChange={handleChange}
              placeholder="Referred By"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Member Type*
            </label>
            <select
              name="memberType"
              value={memberData.memberType}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">-----</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Select Image
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
            Proceed
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

export default AddMember;