"use client";
import { notify } from "@/utils/notify";
import { useState } from "react";

interface KolsData {
  name: string;
  userName: string;
  role: string;
  bio: string;
  imageUrl: string;
  upVotes: number;
  downVotes: number;
  socialLinks: {
    linkedin: string;
    youtube: string;
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

const KolsForm = () => {
  const [formData, setFormData] = useState<KolsData>({
    name: "",
    userName: "",
    role: "",
    bio: "",
    imageUrl: "",
    upVotes: 0,
    downVotes: 0,
    socialLinks: {
      linkedin: "",
      youtube: "",
      facebook: "",
      instagram: "",
      twitter: "",
    },
  });

  const [error, setError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name.startsWith("socialLinks.")) {
        const key = name.replace("socialLinks.", "") as keyof KolsData["socialLinks"];
        return {
          ...prev,
          socialLinks: {
            ...prev.socialLinks,
            [key]: value,
          },
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Submitting form data:", JSON.stringify({ kolsData: formData }));
  
    try {
      // Submit the form data to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/kols/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kolsData: formData }), // Wrap formData in kolsData
        credentials: "include", // Include credentials in the request
      });
  
      if (response.ok) {
        setError("");
        notify("success","Kols data created successfully!");
        // Clear the form
        setFormData({
          name: "",
          userName: "",
          role: "",
          bio: "",
          imageUrl: "",
          upVotes: 0,
          downVotes: 0,
          socialLinks: {
            linkedin: "",
            youtube: "",
            facebook: "",
            instagram: "",
            twitter: "",
          },
        });
      } else {
        const errorData = await response.json();
        console.error("Error creating Kols data:", errorData);
        setError(errorData.message || "Failed to create Kols data.");
        if (response.status === 401) {
          window.location.href = '/auth/login'; // Redirect to login if unauthorized
        }
      }
    } catch (error) {
      console.error("Error creating Kols data:", error);
      setError("Failed to create Kols data.");
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center m-auto">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="m-3 p-2">
        <label className="font-semibold" htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="m-3 p-2">
        <label className="font-semibold" htmlFor="userName">Username:</label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="m-3 p-2">
        <label className="font-semibold" htmlFor="role">Role:</label>
        <input
          type="text"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        />
      </div>
      <div className="m-3 p-2">
        <label className="font-semibold" htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          required
        />
      </div>
      <div className="m-3 p-2">
        <label className="font-semibold" htmlFor="imageUrl">Image URL:</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          required
        />
      </div>
      <div className="m-3 p-2">
        <label className="font-semibold" htmlFor="upVotes">Up Votes:</label>
        <input
          type="number"
          id="upVotes"
          name="upVotes"
          value={formData.upVotes}
          onChange={handleChange}
          required
        />
      </div>
      <div className="m-3 p-2">
        <label className="font-semibold" htmlFor="downVotes">Down Votes:</label>
        <input
          type="number"
          id="downVotes"
          name="downVotes"
          value={formData.downVotes}
          onChange={handleChange}
          required
        />
      </div>
      <div className="m-3 p-2">
        <label className="font-semibold" htmlFor="linkedin">LinkedIn:</label>
        <input
          type="text"
          id="linkedin"
          name="socialLinks.linkedin"
          value={formData.socialLinks.linkedin}
          onChange={handleChange}
          required
        />
      </div>
      <div className="m-3 p-2">
        <label className="font-semibold" htmlFor="youtube">YouTube:</label>
        <input
          type="text"
          id="youtube"
          name="socialLinks.youtube"
          value={formData.socialLinks.youtube}
          onChange={handleChange}
          required
        />
      </div>
      <div className="m-3 p-2">
        <label className="font-semibold" htmlFor="facebook">Facebook:</label>
        <input
          type="text"
          id="facebook"
          name="socialLinks.facebook"
          value={formData.socialLinks.facebook}
          onChange={handleChange}
          required
        />
      </div>
      <div className="m-3 p-2">
        <label className="font-semibold" htmlFor="instagram">Instagram:</label>
        <input
          type="text"
          id="instagram"
          name="socialLinks.instagram"
          value={formData.socialLinks.instagram}
          onChange={handleChange}
          required
        />
      </div>
      <div className="m-3 p-2">
        <label className="font-semibold" htmlFor="twitter">Twitter:</label>
        <input
          type="text"
          id="twitter"
          name="socialLinks.twitter"
          value={formData.socialLinks.twitter}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Create Kols Data</button>
    </form>
  );
};

export default KolsForm;
