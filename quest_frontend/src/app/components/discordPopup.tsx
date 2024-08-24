import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

interface DiscordJoinProps {
  setModalView: (value: boolean) => void;
}

export const DiscordJoin: React.FC<DiscordJoinProps> = ({ setModalView }) => {
  const {isOpen, onOpen,onClose, onOpenChange} = useDisclosure();



  const handleSubmit=()=>{
    setModalView(false);
    window.open("https://discord.com/oauth2/authorize?client_id=1257216544438616116&permissions=8&integration_type=0&scope=bot", "_blank");
    onClose();
  }

  return (
    <>
      <Button color="danger" variant="solid" onPress={onOpen} >Connect server</Button>
      <Modal size="lg" className="bg-black"  onClose={onClose} isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody  className="text-white " >
              <p className="text-center">Connect your Discord server to add tasks to your community</p>
              <Button onPress={handleSubmit}>Join Discord Server</Button>
              </ModalBody>
             
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
