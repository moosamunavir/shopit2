import React from "react";
import { Link } from "react-router-dom";

const footer = () => {
  return (
    <footer className="py-1 pt-5 border footerm">
      <div className="d-flex justify-content-center p-1">
        <Link className="cartpname" to="https://www.facebook.com/">
          {" "}
          <i class="fa-brands fa-facebook fam"></i>
        </Link>

        <Link className="cartpname" to="https://web.whatsapp.com/">
          {" "}
          <i class="fa-brands fa-square-whatsapp fam"></i>
        </Link>


        <Link className="cartpname" to="https://x.com/home">
          {" "}
          <i class="fa-brands fa-square-x-twitter fam"></i>
        </Link>


        <Link className="cartpname" to="https://www.instagram.com/">
          {" "}
          <i class="fa-brands fa-square-instagram fam"></i>
        </Link>

        <Link className="cartpname" to="https://www.youtube.com/">
          {" "}
          <i class="fa-brands fa-youtube fam"></i>
        </Link>
        
       
        
      </div>

      <p className="text-center mt-1 fw-bold">
        ShopIT - 2024, All Rights Reserved
      </p>
    </footer>
  );
};

export default footer;
