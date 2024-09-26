import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toggleNav,selectNavState } from "@/redux/reducer/navSlice";
import {RootState,AppDispatch} from "@/redux/store";
import { useSelector,useDispatch } from "react-redux";

const DomainLogin = () => {
    const router=useRouter();
    const dispatch = useDispatch<AppDispatch>(); 
    const navOpen = useSelector((state: RootState) => selectNavState(state));
    const handleLinkClick = () => {
    dispatch(toggleNav(false));
    router.push('/');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      

      <div className="flex flex-col justify-center items-center gap-2" >
      <span>Log in with your Fam domain account, or create one today and join the Fam!</span>
      <Button radius="sm" onPress={()=>handleLinkClick} className="px-4 py-2 bg-famViolate text-white" >Login / SignUp</Button>
      </div>
    </div>
  );
};
export default DomainLogin;
