import Swal from "sweetalert2";

export const SweetAlert = (type:string,title:string,text:string) => {
  
  if(type==="success"){
    Swal.fire({
  // title: title,
  text:text,
  icon:'success',
  iconColor:'#48de02',
  width: 500,
  padding: "2em",
  color: "#48de02",
  background: "#171616",
});
  }
  else{
    Swal.fire({
  title: title,
  text:text,
  width: 500,
  padding: "2em",
  color: "#f51848",
  background: "#171616",
});
  }
};
