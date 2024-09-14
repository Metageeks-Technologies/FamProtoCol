import Swal from "sweetalert2";

export const SweetAlert = (type:string,title?:string,text?:string) => {
  
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
  else if(type==="taskCompleted"){
    Swal.fire({
      imageUrl: "https://i.pinimg.com/736x/f4/60/23/f46023cb8d99ace91e48f239efe8c206.jpg",
      imageWidth: 150,
      imageHeight: 100,
      imageAlt: "Custom image",
      color:'#ffffff',
      title: title,
      text: text,
      background: "#1c252c",
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
