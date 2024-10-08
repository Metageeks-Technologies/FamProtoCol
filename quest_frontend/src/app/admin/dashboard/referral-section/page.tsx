"use client";
import axiosInstance from "@/utils/axios/axios";
import React, { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { notify } from "@/utils/notify";
interface IReferrals {
  _id: string;
  referralCode: string;
  ExpiryDate: Date;
  maxRedemptions: number;
  type: string;
  redeemedCount: number;
}

const ReferralPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    referralCode: "",
    ExpiryDate: "",
    maxRedemptions: 0,
    type: "free",
  });
  const [editFormData, setEditFormData] = useState<any>({
    id: "",
    referralCode: "",
    ExpiryDate: "",
    maxRedemptions: 0,
    type: "",
  });
  const [referrals, setReferrals] = useState<IReferrals[]>([]);
  const [loaders, setLoaders] = useState({
    createReferral: false,
    getReferral: false,
    save: false,
  });

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
      setLoaders({ ...loaders, getReferral: true });
      const response = await axiosInstance.get("/referral/");
      console.log("response", response);
      setReferrals(response.data.referrals);
    } catch (error) {
      console.log("error", error);
    }
    setLoaders({ ...loaders, getReferral: false });
  };

  useEffect(() => {
    getAllReferrals();
  }, []);

  const handleEdit = (referral: IReferrals) => {
    setEditFormData({
      id: referral._id,
      referralCode: referral.referralCode,
      ExpiryDate: referral.ExpiryDate,
      maxRedemptions: referral.maxRedemptions,
      type: referral.type,
    });
    onOpen();
  };

  const handleSave = async () => {
    if (editFormData.maxRedemptions < 1) {
      notify("error", "Max redemptions cannot be less than 1");
      return;
    }

    if (editFormData.referralCode.length < 4) {
      notify("error", "referral Code can not be less than 4 characters.");
      return;
    }

    setLoaders({ ...loaders, save: true });
    try {
      const response = await axiosInstance.put(`/referral/${editFormData.id}`, {
        ...editFormData,
      });

      console.log("response", response);
    } catch (error) {
      console.log("error", error);
    }
    setLoaders({ ...loaders, save: false });
    onClose();
    getAllReferrals();
  };

  const handleDelete = async (id: string) => {
    console.log("delete id:", id);
    try {
      const response = await axiosInstance.delete(`/referral/${id}`);

      if (response.data.success) {
        notify("success", "referral Deleted successfully");
      } else {
        notify("error", "try again later");
      }
    } catch (error) {
      console.log("error", error);
    }
    getAllReferrals();
  };

  return (
    <>
      <div className="h-screen text-black">
        <div className="w-full p-4">
          <div className="text-xl  font-bold text-slate-900">
            Referral section
          </div>
          <div className="flex flex-col justify-start gap-4 mb-4">
            <div className="font-bold text-xl">Add new Referral</div>
            <div className="w-full flex justify-between gap-4 items-center">
              <div className="w-full flex justify-start flex-col gap-2">
                <label htmlFor="Code" className="font-semibold text-md ">
                  Referral Code
                </label>
                <input
                  type="text"
                  value={formData.referralCode}
                  placeholder="Enter Referral Code"
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
                  placeholder="Enter MaxRedeemLimit"
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
                {loaders.createReferral && (
                  <span>
                    <TailSpin width={20} height={20} />
                  </span>
                )}
                <span>Create New Referral</span>
              </button>
            </div>
          </div>

          <div className="flex justify-start items-center font-bold text-xl mb-4">
            All Active Referral Codes
          </div>

          <div className="grid grid-cols-6 gap-2 mb-4">
            <div className="font-semibold text-md">Referral Code</div>
            <div className="font-semibold text-md">MaxRedeemLimit</div>
            <div className="font-semibold text-md">RedeemCount</div>
            <div className="font-semibold text-md">Expiry Date</div>
            <div className="font-semibold text-md">Referral Type</div>
            <div className="font-semibold text-md">Action</div>
          </div>

          {loaders.getReferral ? (
            <div>Loading...</div>
          ) : (
            <div className="flex justify-start flex-col gap-4">
              {referrals &&
                referrals.length != 0 &&
                referrals.map((referral, index) => (
                  <div className="grid grid-cols-6 gap-2" key={index}>
                    <div className="w-full flex justify-start">
                      <span className="px-2 py-1 bg-gray-500 rounded-full text-white">
                        {referral.referralCode}
                      </span>
                    </div>
                    <div className="w-full flex justify-start">
                      {referral.maxRedemptions}
                    </div>
                    <div className="w-full flex justify-start">
                      {referral.redeemedCount}
                    </div>
                    <div className="w-full flex justify-start">
                      {`${new Date(referral.ExpiryDate).getDate()}-${
                        new Date(referral.ExpiryDate).getMonth() + 1
                      }-${new Date(referral.ExpiryDate).getFullYear()}`}
                    </div>
                    <div className="w-full flex justify-start">
                      {referral.type}
                    </div>
                    <div className="w-full flex justify-start gap-2">
                      <button
                        onClick={() => {
                          handleEdit(referral);
                        }}
                        className="w-full px-2 py-1 rounded-full text-white bg-gray-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(referral._id);
                        }}
                        className="w-full px-2 py-1 rounded-full text-white bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <Modal size="md" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black">
                Edit Referral
              </ModalHeader>
              <ModalBody>
                <div className="w-full flex flex-col justify-center item-start text-black">
                  <div className="flex flex-col justify-start items-start mb-2">
                    <label
                      htmlFor="maxRedemption"
                      className="flex justify-start font-semibold "
                    >
                      MaxRedemption
                    </label>
                    <input
                      name="maxRedemption"
                      type="number"
                      min={1}
                      max={100}
                      className="w-full px-4 py-2 bg-gray-200"
                      value={editFormData.maxRedemptions}
                      onChange={(e) => {
                        setEditFormData({
                          ...editFormData,
                          maxRedemptions: Number(e.target.value),
                        });
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-start items-start mb-2">
                    <label
                      htmlFor="expiryDate"
                      className="flex justify-start font-semibold "
                    >
                      Expiry Date
                    </label>
                    <input
                      name="expiryDate"
                      type="date"
                      className="w-full px-4 py-2 bg-gray-200"
                      value={editFormData.ExpiryDate}
                      onChange={(e) => {
                        setEditFormData({
                          ...editFormData,
                          ExpiryDate: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleSave}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReferralPage;
