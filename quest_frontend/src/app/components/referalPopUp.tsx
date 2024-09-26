import { updateUserProfile } from '@/redux/reducer/authSlice';
import { fetchAllCommunities } from '@/redux/reducer/communitySlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { notify } from '@/utils/notify';
import axiosInstance from '@/utils/axios/axios';

interface ReferralFormProps {
    memberId: any;
    id: any;
  }
  const ReferralForm: React.FC<ReferralFormProps> = ({ memberId, id }) => {
  const dispatch = useDispatch<AppDispatch>();

  const  user = useSelector((state: RootState) => state.login.user);

  const [formData, setFormData] = useState({
    referral:'',
    userId:user?._id,
    memberId,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axiosInstance.post(
        `/community/get/joinCommunities/${id}`,
      formData ,
    );
      // console.log("dsa",response.data)
      await dispatch(fetchAllCommunities());
      notify("success",response.data);
      notify("error",response.data);

    };
  
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  return (<>
    <Button
      className={ `px-2 py-1 bg-white/10 hover:bg-white/25 text-neutral-400 descdata text-center rounded-lg transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg ` }
        onPress={onOpen}>Join with referral</Button>
    <Modal className='border-1 border-zinc-800 bg-zinc-950' isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Referral</ModalHeader>
            <ModalBody>
            <form onSubmit={handleSubmit} className="w-[90%] mx-auto p-4 rounded">
      <div className="mb-4">
        <input
        type="text"
        id="referral"
        name="referral"
        value={formData.referral}
        onChange={handleChange}
        placeholder='Referral Code'
        className="mt-1 block w-full px-3 py-2 border bg-zinc-950 text-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-famViolate focus:border-famViolate sm:text-sm"
      />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-famViolate hover:bg-famViolate-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
      >
        join 
      </button>
           </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
    </>
  );
};

export default ReferralForm;
