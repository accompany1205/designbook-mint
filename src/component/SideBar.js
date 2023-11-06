import React, { useEffect, useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../contexts/AuthContext";
import { findByLabelText } from "@testing-library/react";

const Sidebar = () => {
  const navigate = useNavigate();

  const { isLoggedIn, logout } = useContext(AuthContext);
  const [url, setUrl] = useState("");

  const [click, setClick] = React.useState(false);
  const handleClick = () => setClick(!click);

  const [profileClick, setprofileClick] = React.useState(false);
  const handleProfileClick = () => setprofileClick(!profileClick);

  useEffect(() => {
    const currentUrl = window.location.href;
    const route = currentUrl.split("/")[currentUrl.split("/").length - 1];
    console.log(route);
    console.log(isLoggedIn);
    if (route !== "login" && !isLoggedIn) {
      navigate("/login");
    }
  }, []);

  const handleNavigateClick = (to) => {
    setUrl(to.split("/")[1] || "");
    navigate(to);
  };

  const handleClickLogOut = () => {
    logout();
  };
  return (
    <>
      {isLoggedIn && (
        <div
          className="d-flex justify-content-between align-items-stretch"
          style={{
            padding: "0 15%",
            height: "185px",
            background: "black",
          }}
        >
          <div
            className="d-flex align-items-center"
            style={{ borderBottom: url === "" ? "solid 5px white" : "none" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="33"
              viewBox="0 0 36 33"
              fill="none"
              style={{ cursor: "pointer" }}
              onClick={() => handleNavigateClick("/")}
            >
              <path
                d="M34.2757 15.9686L34.2757 31.0481H21.6185V25.6672H14.6572L14.6572 31.0481L2 31.0481L2 15.9686L18.1378 2L34.2757 15.9686Z"
                stroke={url === "" ? "white" : `#838383`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div
            className="d-flex align-items-center"
            style={{
              borderBottom: url === "create-nft" ? "solid 5px white" : "none",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="32"
              viewBox="0 0 36 32"
              fill="none"
              style={{ cursor: "pointer" }}
              onClick={() => handleNavigateClick("/create-nft")}
            >
              <path
                d="M11.7237 24.7486H10.6433C5.86974 24.7486 2 20.8788 2 16.1052C2 11.3317 5.86974 7.46191 10.6433 7.46191L18.0462 7.46191"
                stroke={url === "create-nft" ? "white" : `#838383`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.3242 2L19.7863 7.4621L14.3242 12.9242"
                stroke={url === "create-nft" ? "white" : `#838383`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24.5842 7.48145H25.6646C30.4381 7.48145 34.3079 11.3512 34.3079 16.1248C34.3079 20.8983 30.4381 24.7681 25.6646 24.7681H18.2617"
                stroke={url === "create-nft" ? "white" : `#838383`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21.9855 30.2299L16.5234 24.7678L21.9855 19.3057"
                stroke={url === "create-nft" ? "white" : `#838383`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div
            className="d-flex align-items-center"
            style={{
              borderBottom: url === "manage-nfts" ? "solid 5px white" : "none",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="34"
              height="18"
              viewBox="0 0 34 18"
              fill="none"
              style={{ cursor: "pointer" }}
              onClick={() => handleNavigateClick("/manage-nfts")}
            >
              <path
                d="M32.1791 1.78027L9.44141 1.78027"
                stroke={url === "manage-nfts" ? "white" : `#838383`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.78066 3.56133C2.7641 3.56133 3.56133 2.7641 3.56133 1.78066C3.56133 0.79723 2.7641 0 1.78066 0C0.797231 0 0 0.79723 0 1.78066C0 2.7641 0.797231 3.56133 1.78066 3.56133Z"
                fill={url === "manage-nfts" ? "white" : `#838383`}
              />
              <path
                d="M32.1791 8.62988L9.44141 8.62988"
                stroke={url === "manage-nfts" ? "white" : `#838383`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.78066 10.41C2.7641 10.41 3.56133 9.61273 3.56133 8.6293C3.56133 7.64586 2.7641 6.84863 1.78066 6.84863C0.797231 6.84863 0 7.64586 0 8.6293C0 9.61273 0.797231 10.41 1.78066 10.41Z"
                fill={url === "manage-nfts" ? "white" : `#838383`}
              />
              <path
                d="M32.1791 15.4775L9.44141 15.4775"
                stroke={url === "manage-nfts" ? "white" : `#838383`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.78066 17.2596C2.7641 17.2596 3.56133 16.4623 3.56133 15.4789C3.56133 14.4955 2.7641 13.6982 1.78066 13.6982C0.797231 13.6982 0 14.4955 0 15.4789C0 16.4623 0.797231 17.2596 1.78066 17.2596Z"
                fill={url === "manage-nfts" ? "white" : `#838383`}
              />
            </svg>
          </div>
          <div
            className="d-flex align-items-center"
            style={{
              borderBottom: url === "import-nft" ? "solid 5px white" : "none",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="23"
              viewBox="0 0 36 23"
              fill="none"
              style={{ cursor: "pointer" }}
              onClick={() => handleNavigateClick("/import-nft")}
            >
              <path
                d="M34.1537 6.63379V21.325L2 21.325L2 6.63379"
                stroke={url === "import-nft" ? "white" : `#838383`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M23.5874 9.33203L18.073 14.8464L12.5586 9.33203"
                stroke={url === "import-nft" ? "white" : `#838383`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.0781 14.8463L18.0781 2"
                stroke={url === "import-nft" ? "white" : `#838383`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div
            className="d-flex align-items-center"
            style={{
              borderBottom: url === "contact-us" ? "solid 5px white" : "none",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="26"
              viewBox="0 0 36 26"
              fill="none"
              style={{ cursor: "pointer" }}
              onClick={() => handleNavigateClick("/contact-us")}
            >
              <path
                d="M34.1537 2L2 2L2 23.6408H34.1537V2Z"
                stroke={url === "contact-us" ? "white" : `#838383`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 2L18.0768 15.9758L34.1537 2"
                stroke={url === "contact-us" ? "white" : `#838383`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 23.6415L13.5312 12.0527"
                stroke={url === "contact-us" ? "white" : `#838383`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M34.1523 23.6415L22.6211 12.0527"
                stroke={url === "contact-us" ? "white" : `#838383`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div
            className="d-flex align-items-center"
            style={{ marginLeft: "8em" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              onClick={() => handleClickLogOut()}
              style={{ cursor: "pointer" }}
            >
              <mask id="path-1-inside-1_525_599" fill="white">
                <path d="M30.0061 9.50042C30.2795 8.8788 31.0077 8.59251 31.6076 8.91062C34.6186 10.5071 37.0818 12.9879 38.656 16.0324C40.4189 19.4421 40.9602 23.353 40.1897 27.1133C39.4192 30.8737 37.3833 34.2565 34.4214 36.698C31.4594 39.1395 27.7503 40.4923 23.912 40.531C20.0737 40.5697 16.338 39.2919 13.3274 36.9106C10.3169 34.5292 8.21327 31.1882 7.3671 27.4441C6.52093 23.7 6.9833 19.7791 8.67719 16.3345C10.1897 13.2589 12.6024 10.729 15.5806 9.07215C16.174 8.74201 16.9078 9.01356 17.1936 9.62955C17.4794 10.2455 17.2086 10.9721 16.6193 11.3096C14.1495 12.7246 12.1482 14.8488 10.8839 17.4197C9.43817 20.3597 9.04352 23.7064 9.76575 26.902C10.488 30.0977 12.2835 32.9493 14.853 34.9819C17.4226 37.0144 20.6111 38.105 23.8872 38.072C27.1633 38.0389 30.3291 36.8843 32.8572 34.8004C35.3853 32.7165 37.1229 29.8292 37.7806 26.6197C38.4383 23.4101 37.9763 20.0721 36.4715 17.1618C35.1557 14.6169 33.112 12.5335 30.6141 11.1686C30.0182 10.843 29.7328 10.122 30.0061 9.50042Z" />
              </mask>
              <path
                d="M30.0061 9.50042C30.2795 8.8788 31.0077 8.59251 31.6076 8.91062C34.6186 10.5071 37.0818 12.9879 38.656 16.0324C40.4189 19.4421 40.9602 23.353 40.1897 27.1133C39.4192 30.8737 37.3833 34.2565 34.4214 36.698C31.4594 39.1395 27.7503 40.4923 23.912 40.531C20.0737 40.5697 16.338 39.2919 13.3274 36.9106C10.3169 34.5292 8.21327 31.1882 7.3671 27.4441C6.52093 23.7 6.9833 19.7791 8.67719 16.3345C10.1897 13.2589 12.6024 10.729 15.5806 9.07215C16.174 8.74201 16.9078 9.01356 17.1936 9.62955C17.4794 10.2455 17.2086 10.9721 16.6193 11.3096C14.1495 12.7246 12.1482 14.8488 10.8839 17.4197C9.43817 20.3597 9.04352 23.7064 9.76575 26.902C10.488 30.0977 12.2835 32.9493 14.853 34.9819C17.4226 37.0144 20.6111 38.105 23.8872 38.072C27.1633 38.0389 30.3291 36.8843 32.8572 34.8004C35.3853 32.7165 37.1229 29.8292 37.7806 26.6197C38.4383 23.4101 37.9763 20.0721 36.4715 17.1618C35.1557 14.6169 33.112 12.5335 30.6141 11.1686C30.0182 10.843 29.7328 10.122 30.0061 9.50042Z"
                stroke="#FF1744"
                strokeWidth="4"
                mask="url(#path-1-inside-1_525_599)"
              />
              <path
                d="M23.5039 6.71484L23.5039 24.5108"
                stroke="#FF1744"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
