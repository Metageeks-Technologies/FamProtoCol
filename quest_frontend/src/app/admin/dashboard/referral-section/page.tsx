"use client";
import axiosInstance from "@/utils/axios/axios";
import React, { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";

interface IReferrals {
  _id: string;
  referralCode: string;
  ExpiryDate: string;
  maxRedemptions: number;
  type: string;
  redeemedCount: number;
}

const ReferralPage = () => {
  const [formData, setFormData] = useState({
    referralCode: "",
    ExpiryDate: "",
    maxRedemptions: 0,
    type: "free",
  });
  const [editFormData, setEditFormData] = useState({
    referralCode: "",
    ExpiryDate: "",
    maxRedemptions: 0,
    type: "free",
  });
  const [referrals, setReferrals] = useState<IReferrals[]>([]);
  const [loaders,setLoaders]=useState({
    createReferral:false,
    getReferral:false,
    save:false,
  })
  const [editorMode, setEditorMode] = useState("");
  const handleNewReferral = async () => {
    try {
      const response = await axiosInstance.post("/referral/", { ...formData });

      console.log("response", response);
      getAllReferrals();
    } catch (error) {
      console.log("error", error);
    }
  };

  const getAllReferrals = async () => {
    try {
      setLoaders({...loaders,getReferral:true})
      const response = await axiosInstance.get("/referral/");
      console.log("response", response);
      setReferrals(response.data.referrals);
    } catch (error) {
      console.log("error", error);
    }
    setLoaders({...loaders,getReferral:false})
  };

  useEffect(() => {
    getAllReferrals();
  }, []);

  const handleEdit = (referral: IReferrals) => {
    setEditorMode(referral._id);

    if (editorMode!="") {
      setEditFormData({
        ...referral,
        referralCode: referral.referralCode,
        ExpiryDate: referral.ExpiryDate,
        maxRedemptions: referral.maxRedemptions,
        type: referral.type,
      });
    }
  };

  const handleSave = async (referral: IReferrals) => {
    setLoaders({...loaders,save:true})
    try {
      const response = await axiosInstance.put(`/referral/:${referral._id}`, {
        ...editFormData,
      });

      console.log("response", response);
    } catch (error) {
      console.log("error", error);
    }
    setLoaders({...loaders,save:false});
    setEditorMode("");
  };

  return (
    <div className="h-screen overflow-y-scroll text-black">
      <div className="w-full p-4">
        <div className="text-xl  font-bold text-slate-900">
          Referral section
        </div>
        <div className="flex flex-col justify-start gap-4">
          <div className="font-bold text-xl">Add new Referral</div>
          <div className="w-full flex justify-between gap-4 items-center">
            <div className="w-full flex justify-start flex-col gap-2">
              <label htmlFor="Code" className="font-semibold text-md ">
                Referral Code
              </label>
              <input
                type="text"
                value={formData.referralCode}
                className="w-full border-1 border-gray-900 hover:border-gray-600 focus:border-gray-600 rounded-md p-2"
                onChange={(e) =>
                  setFormData({ ...formData, referralCode: e.target.value })
                }
              />
            </div>
            <div className="w-full flex justify-start flex-col gap-2">
              <label htmlFor="redeemLimit" className="font-semibold text-md ">
                MaxRedeemLimit
              </label>
              <input
                type="number"
                value={formData.maxRedemptions}
                className="w-full border-1 border-gray-900 hover:border-gray-600 focus:border-gray-600 rounded-md p-2"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxRedemptions: Number(e.target.value), // Convert string to number
                  })
                }
              />
            </div>

            <div className="w-full flex justify-start flex-col gap-2">
              <label htmlFor="Date" className="font-semibold text-md ">
                Expiry Date
              </label>
              <input
                type="date"
                className="w-full border-1 border-gray-900 hover:border-gray-600 focus:border-gray-600 rounded-md p-2"
                value={formData.ExpiryDate}
                onChange={(e) => {
                  setFormData({ ...formData, ExpiryDate: e.target.value });
                }}
              ></input>
            </div>
            <div className="w-full flex justify-start flex-col gap-2">
              <label htmlFor="Type" className="font-semibold text-md ">
                Referral Type
              </label>
              <div className="flex items-center justify-start gap-4">
                <div className="flex items-center">
                  <input
                    checked={formData.type === "discount"}
                    id="default-radio-1"
                    type="radio"
                    value="discount"
                    onChange={(e) => {
                      setFormData({ ...formData, type: e.target.value });
                    }}
                    name="default-radio-1"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="default-radio-1"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    50% Discount
                  </label>
                </div>
                <div className="flex items-start justify-start">
                  <input
                    checked={formData.type === "free"}
                    id="default-radio-2"
                    type="radio"
                    value="free"
                    onChange={(e) => {
                      setFormData({ ...formData, type: e.target.value });
                    }}
                    name="default-radio-2"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="default-radio-2"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Free
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end item-center">
            <button
              className="px-4 py-2 bg-blue-600 rounded-full text-white "
              onClick={handleNewReferral}
              type="submit"
            >
            {loaders.createReferral && <span>
            <TailSpin width={20} height={20} />
            </span>}
            <span>Create New Referral</span>
              
            </button>
          </div>
        </div>

        <div className="flex justify-start items-center font-bold text-xl">
          All Active Referral Codes
        </div>
        {
          loaders.getReferral ? <div>Loading...</div> : (
             <div className="flex justify-start flex-col gap-4">
          {referrals &&
            referrals.length != 0 &&
            referrals.map((referral, index) => (
              <div
                className="flex justify-between items-center gap-4"
                key={index}
              >
                <div>{index + 1}</div>

                <div className="w-full flex justify-between gap-4 items-center">
                  <div className="w-full flex justify-start flex-col gap-2">
                    <label htmlFor="Code" className="font-semibold text-md ">
                      Referral Code
                    </label>
                    <input
                      type="text"
                      disabled={!(editorMode===referral._id)}
                      value={editFormData.referralCode || referral.referralCode}
                      className="w-full border-1 border-gray-900 hover:border-gray-600 focus:border-gray-600 rounded-md p-2"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          referralCode: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="w-full flex justify-start flex-col gap-2">
                    <label
                      htmlFor="redeemLimit"
                      className="font-semibold text-md "
                    >
                      MaxRedeemLimit
                    </label>
                    <input
                      type="number"
                      disabled={!(editorMode===referral._id)}
                      value={
                        editFormData.maxRedemptions || referral.maxRedemptions
                      }
                      className="w-full border-1 border-gray-900 hover:border-gray-600 focus:border-gray-600 rounded-md p-2"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          maxRedemptions: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="w-full flex justify-start flex-col gap-2">
                    <label htmlFor="Date" className="font-semibold text-md ">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      disabled={!(editorMode===referral._id)}
                      className="w-full border-1 border-gray-900 hover:border-gray-600 focus:border-gray-600 rounded-md p-2"
                      value={editFormData.ExpiryDate || referral.ExpiryDate}
                      onChange={(e) => {
                        setEditFormData({
                          ...editFormData,
                          ExpiryDate: e.target.value,
                        });
                      }}
                    ></input>
                  </div>
                  <div className="w-full flex justify-start flex-col gap-2">
                    <label htmlFor="Type" className="font-semibold text-md ">
                      Referral Type
                    </label>
                    <div className="flex items-center justify-start gap-4">
                      <div className="flex items-center">
                        <input
                          disabled={!(editorMode===referral._id)}
                          checked={
                            ((editorMode===referral._id) && editFormData.type === "discount") ||
                            referral.type === "discount"
                          }
                          id="default-radio-3"
                          type="radio"
                          value="discount"
                          onChange={(e) => {
                            setEditFormData({
                              ...editFormData,
                              type: e.target.value,
                            });
                          }}
                          name="default-radio-3"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="default-radio-3"
                          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          50% Discount
                        </label>
                      </div>
                      <div className="flex items-start justify-start">
                        <input
                          disabled={!(editorMode===referral._id)}
                          checked={
                            ((editorMode===referral._id) && editFormData.type === "free") ||
                            referral.type === "free"
                          }
                          id="default-radio-4"
                          type="radio"
                          value="free"
                          onChange={(e) => {
                            setEditFormData({
                              ...editFormData,
                              type: e.target.value,
                            });
                          }}
                          name="default-radio-4"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="default-radio-4"
                          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Free
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-2">
                  {editorMode===referral._id ? (
                    <div className="flex gap-2 items-center justify-start">
                      <button
                        onClick={() => {
                          handleSave(referral);
                        }}
                        className="px-4 py-2 rounded-full text-white bg-gray-500"
                      >
                        Save
                      </button>
                      <button
                        className="px-4 py-2 rounded-full text-white bg-gray-500"
                        onClick={() => {
                          setEditorMode("");
                          setEditFormData({
                            referralCode: "",
                            maxRedemptions: 0,
                            ExpiryDate: "",
                            type: "",
                          })
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleEdit(referral);
                      }}
                      className="px-4 py-2 rounded-full text-white bg-gray-500"
                    >
                      Edit
                    </button>
                  )}
                  <button className="px-4 py-2 rounded-full text-white bg-red-600">
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
          )
        }
       
      </div>
    </div>
  );
};

export default ReferralPage;
