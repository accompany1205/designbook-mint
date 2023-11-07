import {
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import uploadNft from "../../helpers/upload_nft.mjs";
import { useNavigate } from "react-router-dom";
import formatImageUrl from "../../helpers/format_image_url.js";
import { useAuthenticatedFetch } from "../../hooks";
import { Card, Container, Row, Col, Modal, Spinner } from "react-bootstrap";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import Joi from "joi";
import { axiosInstance } from "../../contexts/AuthContext.js";
import { Toast } from "primereact/toast";

const nftCreateObjectSchema = Joi.object().keys({
  nftImage: Joi.required().error(
    () => new Error("Please upload Image for NFT")
  ),
  collectionName: Joi.string()
    .required()
    .error(() => new Error("Collection name is required")),
  nftName: Joi.string()
    .required()
    .error(() => new Error("NFT name is required")),
  brand: Joi.string()
    .required()
    .error(() => new Error("Brand is required")),
  description: Joi.string()
    .required()
    .error(() => new Error("Description is required")),
  digitalProduct: Joi.boolean()
    .required()
    .error(() => new Error("digitalProduct is required")),
  gender: Joi.string()
    .required()
    .error(() => new Error("gender is required")),
  category: Joi.string()
    .required()
    .error(() => new Error("category is required")),
  vrOrMetaverseCompliant: Joi.boolean()
    .required()
    .error(() => new Error("vr or metaverse compliant is required")),
  numOfEdition: Joi.number()
    .required()
    .min(1)
    .error(() => new Error("Editions is required")),
  color: Joi.string()
    .when("digitalProduct", {
      is: true,
      then: Joi.allow(""),
      otherwise: Joi.required(),
    })
    .error(() => new Error("color is required")),
  releaseDate: Joi.string()
    .when("digitalProduct", {
      is: true,
      then: Joi.allow(""),
      otherwise: Joi.required(),
    })
    .error(() => new Error("releaseDate is required")),
  serialNumber: Joi.string()
    .when("digitalProduct", {
      is: true,
      then: Joi.allow(""),
      otherwise: Joi.required(),
    })
    .error(() => new Error("serial number is required")),
  selectedPerkList: Joi.array(),

  country: Joi.string().allow(""),
  material: Joi.string().allow(""),
  otherCharacteristics: Joi.string().allow(""),
  royalty: Joi.number()
    .required()
    .min(1)
    .error(() => new Error("royalty is required")),
  extras: Joi.array().custom((value, helper) => {
    if (
      !(value[0].size && value[0].rrp && value[0].numOfEdition && value[0].sku)
    ) {
      return helper.message("Add atleast one variant");
    }
    return true;
  }),
});

const genders = [
  {
    label: "Men",
    value: "Men",
  },
  {
    label: "Women",
    value: "Women",
  },
  {
    label: "Unisex",
    value: "Unisex",
  },
];

const categories = [
  {
    label: "Bags",
    value: "Bags",
  },
  {
    label: "Leather goods",
    value: "Leather goods",
  },
  {
    label: "Jewellery",
    value: "Jewellery",
  },
  {
    label: "Shoes",
    value: "Shoes",
  },
  {
    label: "Watches",
    value: "Watches",
  },
  {
    label: "Sunglasses",
    value: "Sunglasses",
  },
];

export default function CreateNFT() {
  // const { user } = useContext(UserContext);

  // useState stores and updates values input in form and image, so that we can use it for our POST request later on.
  const [nftImage, setNftImage] = useState();
  const [perkFile, setPerkFile] = useState([null]);
  const [heroBannerImage, setHeroBannerImage] = useState();
  const [nft3DFile, setNft3DFile] = useState();

  const [collectionName, setCollectionName] = useState("");
  const [brand, setBrand] = useState("");
  const [vrOrMetaverseCompliant, setVrOrMetaverseCompliant] = useState(true);

  const [nftName, setNftName] = useState("");
  const [description, setDescription] = useState("");

  const [digitalProduct, setDigitalProduct] = useState(true);
  const [gender, setGender] = useState(genders[0].value);
  const [category, setCategory] = useState(categories[0].value);

  //perklist
  const [selectedPerkList, setSelectedPerkList] = useState([]);
  const [accessToSpecialCollectionPerk, setAccessToSpecialCollectionPerk] =
    useState("");
  const [genericDiscountPerk, setGenericDiscountPerk] = useState(0);
  const [warrantyLength, setWarrantyLength] = useState(0);
  const [productRestorationPerk, setProductRestorationPerk] = useState("");
  const [productMaintenancePerk, setProductMaintenancePerk] = useState("");
  const [ticketToEventPerk, setTicketToEventPerk] = useState("");
  const [vipExperiencePerk, setVipExperiencePerk] = useState("");
  const [otherPerk, setOtherPerk] = useState("");

  //physical nft details
  const [country, setCountry] = useState("");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [serialNumber, setSerialNumber] = useState("Default serial no.");
  const [otherCharacteristics, setOtherCharacteristics] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  const toast = useRef(null);

  const [extras, setExtras] = useState([
    {
      size: "",
      rrp: 0,
      numOfEdition: 0,
      sku: "",
    },
    {
      size: "",
      rrp: 0,
      numOfEdition: 0,
      sku: "",
    },
  ]);

  const numOfVariants = useMemo(() => {
    let count = 0;
    console.log({ extras });
    for (let e of extras) {
      if (e.size && e.sku && e.rrp && e.numOfEdition) {
        count = count + Number(e.numOfEdition);
      }
    }
    return count || 1;
  }, [extras]);

  //royalty
  const [royalty, setRoyalty] = useState(5);
  const [collaborationRoyalty, setCollaborationRoyalty] = useState("");
  const [collaboratorWalletIdNumber, setCollaboratorWalletIdNumber] =
    useState("");

  //allcollections
  const [allCollections, setAllCollections] = useState([]);

  //  state for custom modal component
  const [activeCustomModal, setActiveCustomModal] = useState(false);
  const [isNFTCreated, setIsNFTCreated] = useState(false);
  const [isNFTCreating, setIsNFTCreating] = useState(false);

  // Setting up Navigation Method
  const navigate = useNavigate();
  const fileRef = useRef();
  const perkfileRef = [useRef(), useRef(), useRef(), useRef(), useRef()];
  const imgRef = useRef();
  const perkImgRef = useRef();

  const handleChangeExtra = useCallback(
    (i, key) => (e) => {
      setExtras((old) => {
        old = JSON.parse(JSON.stringify(old));
        old[i][key] = e.target.value;
        return old;
      });
    },
    []
  );

  //fetch collections
  const fetchCollections = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/users/api/v1/collections/all");
      if (data.success) {
        setAllCollections(
          data.collections.map((collection) => ({
            value: collection.id,
            label: collection.name,
          }))
        );
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  // Methods to store image variable when use uploads a file
  const handleDropZoneDropNftImage = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) => {
      setNftImage(() => _dropFiles[0]);
    },
    []
  );

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
  const validNft3DFileTypes = ["glb"];

  const fileUploadNftImage = !nftImage && <Dropzone />;
  const uploadedFileNftImage = nftImage && (
    <div>
      <img
        src={
          validImageTypes.includes(nftImage.type)
            ? window.URL.createObjectURL(nftImage)
            : ""
        }
        className="img-thumbnail"
        alt={nftImage.name}
      />
      <div>
        {nftImage.name} <p>{nftImage.size} bytes</p>
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setNftImage(null);
        }}
      >
        X
      </div>
    </div>
  );

  const handleChangeModal = useCallback(() => {
    if (!isNFTCreating) {
      setActiveCustomModal(false);
      setIsNFTCreated(false);
    }
  }, [activeCustomModal]);

  // use fetch to make requests to the ShopifyAPI
  // const fetch = useAuthenticatedFetch();

  const getMintPayload = useCallback(
    (_extras) => {
      console.log(_extras);
      const __extras = _extras.filter(
        (_item) => _item.numOfEdition > 0 && _item.sku !== "" && _item.ipfs
      );
      // console.log(_extras);
      return {
        collectionName,
        productName: nftName,
        brand,
        gender,
        category,
        description,
        nftType: digitalProduct ? "Digital" : "Physical",
        vrCompliant: vrOrMetaverseCompliant,
        colour: color,
        releaseDate,
        serialNumber,
        country,
        material,
        otherSpecs: otherCharacteristics,
        perks: [
          ...(accessToSpecialCollectionPerk
            ? [
                {
                  perkName: "Access To Capsule Collection",
                  value: accessToSpecialCollectionPerk,
                },
              ]
            : []),
          ...(warrantyLength
            ? [
                {
                  perkName: "Warranty Length",
                  value: warrantyLength,
                },
              ]
            : []),
          ...(genericDiscountPerk
            ? [
                {
                  perkName: "Generic Discount",
                  value: genericDiscountPerk,
                },
              ]
            : []),
          ...(productRestorationPerk
            ? [
                {
                  perkName: "Product Restoreation",
                  value: productRestorationPerk,
                },
              ]
            : []),
          ...(productMaintenancePerk
            ? [
                {
                  perkName: "Product Maintenance",
                  value: productMaintenancePerk,
                },
              ]
            : []),
          ...(ticketToEventPerk
            ? [
                {
                  perkName: "Ticket To Event",
                  value: ticketToEventPerk,
                },
              ]
            : []),
          ...(vipExperiencePerk
            ? [
                {
                  perkName: "Vip Experience",
                  value: vipExperiencePerk,
                },
              ]
            : []),
          ...(otherPerk
            ? [
                {
                  perkName: "Other",
                  value: otherPerk,
                },
              ]
            : []),
        ],
        editions: +numOfVariants || 0,
        royalty: +royalty || 0,
        price: extras[0].rrp,
        extras: __extras,
      };
    },
    [
      collectionName,
      nftName,
      brand,
      description,
      digitalProduct,
      vrOrMetaverseCompliant,
      color,
      releaseDate,
      serialNumber,
      country,
      material,
      otherCharacteristics,
      numOfVariants,
      royalty,
      accessToSpecialCollectionPerk,
      genericDiscountPerk,
      productMaintenancePerk,
      productRestorationPerk,
      ticketToEventPerk,
      vipExperiencePerk,
      otherPerk,
      gender,
      category,
    ]
  );

  // Handles main submit event for when an product is submitted
  const handleSubmit = async (event) => {
    try {
      setIsNFTCreating(true);
      setActiveCustomModal(true);
      setIsNFTCreated(false);
      const { error } = nftCreateObjectSchema.validate({
        nftImage,
        collectionName,
        nftName,
        brand,
        description,
        digitalProduct,
        vrOrMetaverseCompliant,
        numOfEdition: +numOfVariants,
        color,
        releaseDate,
        serialNumber,
        selectedPerkList,
        country,
        material,
        otherCharacteristics,
        royalty,
        extras,
        gender,
        category,
      });
      if (error) {
        //toast(error.message, true).dispatch(Toast.Action.SHOW);
        setIsNFTCreating(false);
        handleChangeModal();
        return;
      }

      console.log("Posting data to nft.storage...");
      let imageUrl = "";
      let _extras = [];
      // create ipfs data and post product at the same time.
      for (let i = 0; i < extras.length; i++) {
        if (extras[i].numOfEdition !== 0 && extras[i].sku !== "") {
          const [ipfs] = await Promise.all([
            uploadNft({
              name: nftName,
              creator: brand,
              description: description,
              image: nftImage,
              type: nftImage?.type,
              files: perkFile
                .filter((item) => item)
                .map((_item) => ({
                  type: _item.type,
                  uri: _item,
                })),
              properties: {
                ...(collectionName ? { collectionName } : {}),
                ...(brand ? { brand } : {}),
                ...(numOfVariants ? { edition: +numOfVariants } : {}),
                ...(vrOrMetaverseCompliant ? { vrOrMetaverseCompliant } : {}),
                ...(nftName ? { nftName } : {}),
                ...(description ? { description } : {}),
                ...(extras[i].rrp ? { price: extras[i].rrp } : {}),
                ...(digitalProduct ? { digitalProduct } : {}),
                ...(gender ? { gender } : {}),
                ...(category ? { category } : {}),
                ...(country ? { country } : {}),
                ...(extras[i].sku ? { sku: extras[i].sku } : {}),
                ...(extras[i].size ? { size: extras[i].size } : {}),
                ...(color ? { color } : {}),
                ...(material ? { material } : {}),
                ...(serialNumber ? { serialNumber } : {}),
                ...(otherCharacteristics ? { otherCharacteristics } : {}),
                ...(releaseDate ? { releaseDate } : {}),
                ...(royalty ? { royalty: +royalty || 0 } : {}),
                ...(selectedPerkList.length || true
                  ? {
                      perks: JSON.stringify({
                        ...(accessToSpecialCollectionPerk
                          ? { accessToSpecialCollectionPerk }
                          : {}),
                        ...(warrantyLength ? { warrantyLength } : {}),
                        ...(genericDiscountPerk ? { genericDiscountPerk } : {}),
                        ...(productRestorationPerk
                          ? { productRestorationPerk }
                          : {}),
                        ...(productMaintenancePerk
                          ? { productMaintenancePerk }
                          : {}),
                        ...(ticketToEventPerk ? { ticketToEventPerk } : {}),
                        ...(vipExperiencePerk ? { vipExperiencePerk } : {}),
                        ...(otherPerk ? { otherPerk } : {}),
                      }),
                    }
                  : {}),
              },
            }),
            // fetch request to shopify api
          ]);
          console.log(`Successfully posted...`);
          console.log("ipfs", ipfs);
          imageUrl = formatImageUrl(ipfs.data.image.pathname);
          console.log(`imageUrl ${imageUrl}...`);
          console.log(`Sending ${ipfs["url"]} to backend API...`);
          _extras.push({
            ...extras[i],
            ipfs: ipfs["url"],
          });
        }
      }
      console.log(_extras);
      // setExtras(__extras => _extras);

      // get imageUrl in correct format so we can use it for the item list

      const mintPayload = getMintPayload(_extras);
      console.log("mintPayload", mintPayload);
      const res = await axiosInstance.post("/users/api/v1/mint", mintPayload); ////////////////////
      console.log("mintPayload", res);
      const redemptionUrl = res.data.urls;

      // console.log(
      //   `Successfully Sent, Redemption URL retrieved: ...`
      // );

      // let perksDescription = "<ul>";
      // for (const obj of mintPayload.perks) {
      //   if (!obj || typeof obj !== "object") {
      //     continue;
      //   }
      //   perksDescription += `<li>${Object.keys(obj)[0]}: ${Object.values(obj)[0]
      //     }</li>`;
      // }
      // perksDescription += "</ul>";
      // const descriptionHtml = `<p>${mintPayload?.description}</p>
      //   <h4>Perks</h4>
      //   ${perksDescription}
      //   `;

      // const variants = [];
      // let linkCounter = 0;

      // for (let extra of extras) {
      //   if (extra.numOfEdition && extra.rrp && extra.size && extra.sku) {
      //     for (let i = 0; i < extra.numOfEdition; i++) {
      //       variants.push({
      //         options: [`${extra.size}`, `NO: ${i + 1}`],
      //         price: extra.rrp,
      //         sku: "DESIGN_BOOK_NFT:" + extra.sku,
      //         inventoryQuantities: {
      //           availableQuantity: 1,
      //         },
      //         inventoryPolicy: 'DENY',
      //         inventoryManagement: 'SHOPIFY',
      //         requiresShipping: false,
      //         metafields: [
      //           {
      //             namespace: "web_3",
      //             key: "redemption_link",
      //             value: "redemptionUrl[linkCounter]",
      //             type: "url",
      //           },
      //         ],
      //       });
      //       linkCounter++;
      //     }
      //   }
      // }

      // const product_data = {
      //   title: mintPayload.productName,
      //   descriptionHtml,
      //   variants,
      //   vendor: mintPayload.brand,
      //   images: [{ src: imageUrl }],
      //   tags: ["DESIGN_BOOK_NFT"],
      //   options: ["Size", "Number"],
      // };
      // await fetch("/api/products/create", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     input: product_data,
      //   }),
      // });
      setIsNFTCreating(false);
      setActiveCustomModal(false);
      setIsNFTCreated(true);
      toast.current.show({
        severity: "success",
        summary:
          "NFT has been created, please collect the redemption links in manage NFT section!",
        detail: `Name: Error`,
        life: 3000,
      });
    } catch (err) {
      console.log("error attempting to upload nft", err);
      setIsNFTCreating(false);
      handleChangeModal();
      // toast("NFT creation failed. Please try again", true).dispatch(Toast.Action.SHOW);
      toast.current.show({
        severity: "error",
        summary: "NFT creation failed. Please try again!",
        detail: `Name: Error`,
        life: 3000,
      });
    }
  };

  // custom Modal component
  let CustomModal = <></>;
  if (activeCustomModal == true)
    CustomModal = (
      <div style={{ height: "500px" }}>
        <Modal show={activeCustomModal} onHide={handleChangeModal}>
          <Modal.Header>
            <Modal.Title>
              {isNFTCreated
                ? "Success"
                : "Minting the NFTs and creating redemption links"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isNFTCreated ? (
              <p className="text-center fw-bold">
                NFT has been created, please collect the redemption links in
                manage NFT section
              </p>
            ) : (
              <div
                className="d-flex justify-content-around align-items-center"
                vertical
              >
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">
                    Adding Product and Retreiving Redemption Link...
                  </span>
                </Spinner>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </div>
    );

  useEffect(() => {
    //fetch all collections initially
    fetchCollections();
  }, []);

  const handleClickImage = () => {
    console.log({ fileRef });
    if (fileRef) fileRef.current.click();
  };
  const handlePerkClickImage = (index) => {
    console.log({ perkfileRef });
    if (perkfileRef[index]) perkfileRef[index].current.click();
  };

  const handleFileChange = (event) => {
    console.log(event.target.files);
    let file = event.target.files[0];
    if (!file?.type.includes("image")) {
      return;
    }
    setNftImage(() => file);
    const reader = new FileReader();

    // Setup a callback for when the file is loaded
    reader.onload = (event) => {
      // Set the image source to the loaded data URL
      imgRef.current.src = event.target.result;
    };

    // Read the file as a data URL (base64 encoding)
    reader.readAsDataURL(file);
  };
  const handlePerkFileChange = (event, index) => {
    console.log(event.target.files);
    let file = event.target.files[0];
    if (
      !file?.type.includes("image") &&
      !file?.type.includes("pdf") &&
      !file?.type.includes("txt")
    ) {
      return;
    }
    const _perkArr = [...perkFile];
    _perkArr[index] = file;
    setPerkFile(() => _perkArr);
    const reader = new FileReader();

    // Setup a callback for when the file is loaded
    reader.onload = (event) => {
      // Set the image source to the loaded data URL
      // perkImgRef.current.src = event.target.result;
    };

    // Read the file as a data URL (base64 encoding)
    reader.readAsDataURL(file);
  };

  const removeFile = (index) => {
    setPerkFile((_perkFile) =>
      _perkFile.filter((item, _index) => _index !== index)
    );
  };

  return (
    <Container className="pt-5">
      <Toast ref={toast} />
      <Row className="mt-5">
        <Col lg={12} md={12} xs={12} sm={12}>
          <h3 className="text-center fw-bolder">NFT Detail Page</h3>
          <div>
            <Row>
              <Col sm={12} md={6}>
                <div className="mb-3 mt-3">
                  <label htmlFor="brand" className="form-label">
                    BRAND NAME*
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="brand"
                    name="brand"
                    value={brand}
                    onChange={useCallback((e) => setBrand(e.target.value), [])}
                  />
                </div>
              </Col>
              <Col sm={12} md={6}>
                <div className="mb-3 mt-3">
                  <label htmlFor="collection" className="form-label">
                    COLLECTION NAME*{" "}
                    <span style={{ color: "grey", fontSize: "0.7em" }}>
                      (do not include special characters)
                    </span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="collection"
                    name="collection"
                    value={collectionName}
                    onChange={useCallback(
                      (e) => setCollectionName(e.target.value),
                      []
                    )}
                  />
                </div>
              </Col>
            </Row>
            <div className="mb-3">
              <label htmlFor="nftName" className="form-label">
                PRODUCT NAME*
              </label>
              <input
                type="text"
                className="form-control"
                id="nftName"
                name="nftName"
                value={nftName}
                onChange={useCallback((e) => setNftName(e.target.value), [])}
              />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="description" className="form-label">
                Picture/Digital twin*
              </label>
              <div className="d-flex justify-content-center">
                <Card
                  className="w-30 "
                  style={{ minHeight: 100, borderColor: "#95959540" }}
                >
                  <input
                    type="file"
                    ref={fileRef}
                    className="d-none"
                    onChange={handleFileChange}
                  />

                  <img
                    src={nftImage}
                    style={{ maxWidth: 300 }}
                    ref={imgRef}
                    onClick={() => handleClickImage()}
                  />
                  {!nftImage && (
                    <div className="py-5 px-5">
                      <div className="d-flex justify-content-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="48"
                          viewBox="0 0 48 48"
                          fill="none"
                        >
                          <path
                            d="M32 32L24 24L16 32"
                            stroke="#282828"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M24 24V42"
                            stroke="#282828"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M40.7789 36.78C42.7296 35.7165 44.2706 34.0337 45.1587 31.9972C46.0468 29.9607 46.2314 27.6864 45.6834 25.5334C45.1353 23.3803 43.8859 21.471 42.1323 20.1069C40.3786 18.7427 38.2207 18.0014 35.9989 18H33.4789C32.8736 15.6585 31.7453 13.4846 30.1788 11.642C28.6124 9.79927 26.6486 8.33567 24.4351 7.36118C22.2216 6.3867 19.816 5.92669 17.3992 6.01573C14.9823 6.10478 12.6171 6.74057 10.4813 7.8753C8.34552 9.01003 6.49477 10.6142 5.06819 12.5671C3.64161 14.5201 2.67632 16.771 2.2449 19.1508C1.81348 21.5305 1.92715 23.977 2.57737 26.3065C3.22759 28.636 4.39743 30.7877 5.99894 32.6"
                            stroke="#282828"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M32 32L24 24L16 32"
                            stroke="#282828"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <p className="text-center mt-4 mb-1">
                        Select a file or drag and drop here
                      </p>
                      <p
                        className="text-center mb-3"
                        style={{ color: "#959595", opacity: 0.4 }}
                      >
                        JPG, PNG or 3D file size no more than 10MB
                      </p>
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-sm px-4"
                          style={{
                            border: "1px solid #0F91D2",
                            color: "#0F91D2",
                          }}
                          onClick={() => handleClickImage()}
                        >
                          SELECT FILE
                        </button>
                      </div>
                    </div>
                  )}

                  {/* <Dropzone
                onChangeStatus={handleDropZoneDropNftImage}
                onSubmit={handleSubmit}
                accept="image/*"
                inputContent={(files, extra) => (extra.reject ? 'Image files only' : 'Drag Files')}
                styles={{
                  dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
                  inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),
                }}
              >
                {fileUploadNftImage}
                {uploadedFileNftImage}
              </Dropzone> */}
                </Card>
              </div>
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="description" className="form-label">
                DESCRIPTION*
              </label>
              <textarea
                type="text"
                className="form-control"
                id="description"
                name="description"
                rows={4}
                value={description}
                onChange={useCallback(
                  (e) => setDescription(e.target.value),
                  []
                )}
              />
            </div>
            <Row>
              <Col sm={12} md={6}>
                <div className="mt-3">
                  <label htmlFor="digitalProduct" className="form-label">
                    NFT TYPE*
                  </label>
                  <select
                    type="text"
                    className="form-control"
                    id="digitalProduct"
                    name="digitalProduct"
                    value={digitalProduct}
                    onChange={useCallback(
                      (e) => setDigitalProduct(e.target.value === "true"),
                      []
                    )}
                  >
                    <option value="true">Digital</option>
                    <option value="false">Physical</option>
                  </select>
                </div>
              </Col>
              <Col sm={12} md={6}>
                <div className="mt-3">
                  <label
                    htmlFor="vrOrMetaverseCompliant"
                    className="form-label"
                  >
                    VR/METAVERSE COMPLIANT*
                  </label>
                  <select
                    type="text"
                    className="form-control"
                    id="vrOrMetaverseCompliant"
                    name="vrOrMetaverseCompliant"
                    value={vrOrMetaverseCompliant}
                    onChange={useCallback(
                      (e) => setBrand(e.target.value === "true"),
                      []
                    )}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={6}>
                <div className="mb-3 mt-3">
                  <label htmlFor="gender" className="form-label">
                    GENDER*
                  </label>
                  <select
                    type="text"
                    className="form-control"
                    id="gender"
                    name="gender"
                    value={gender}
                    onChange={useCallback((e) => setGender(e.target.value), [])}
                  >
                    {genders.map((gender, index) => (
                      <option key={index} value={gender.value}>
                        {gender.label}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
              <Col sm={12} md={6}>
                <div className="mb-3 mt-3">
                  <label htmlFor="category" className="form-label">
                    CATEGORY*
                  </label>
                  <select
                    type="text"
                    className="form-control"
                    id="category"
                    name="category"
                    value={category}
                    placeholder="Create a category."
                    onChange={useCallback(
                      (e) => setCategory(e.target.value),
                      []
                    )}
                  >
                    {categories.map((category, index) => (
                      <option key={index} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
            </Row>
            {!digitalProduct && (
              <>
                <Row>
                  <Col xs={12} sm={12} md={6}>
                    <div className="mb-3">
                      <label htmlFor="releaseDate" className="form-label">
                        RELEASE DATE*
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="releaseDate"
                        value={releaseDate}
                        onChange={(e) => setReleaseDate(e.target.value)}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={12} md={6} lg={6}>
                    <div className="mb-3">
                      <label htmlFor="color" className="form-label">
                        COLOR*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                      />
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={6}>
                    <div className="mb-3">
                      <label htmlFor="material" className="form-label">
                        MATERIAL*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="material"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={12} md={6} lg={6}>
                    <div className="mb-3">
                      <label htmlFor="country" className="form-label">
                        COUNTRY OF MANUFACTURE
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <div className="mb-3">
                      <label
                        htmlFor="otherCharacteristics"
                        className="form-label"
                      >
                        OTHER SPECIFICATIONS
                      </label>
                      <textarea
                        rows={5}
                        className="form-control"
                        id="otherCharacteristics"
                        value={otherCharacteristics}
                        onChange={(e) =>
                          setOtherCharacteristics(e.target.value)
                        }
                      />
                    </div>
                  </Col>
                </Row>
              </>
            )}
            <div className="d-flex align-items-center justify-content-between mt-5 mb-3">
              <h4 className="fw-bold">EDITIONS</h4>
              <div
                style={{ height: 1, width: "83%", background: "black" }}
              ></div>
            </div>

            {extras.map((e, i) => (
              <Row key={i}>
                <Col xs={12} sm={12} md={6} lg={3}>
                  <div className="mb-3 mt-3">
                    <label htmlFor={`size${i}`} className="form-label">
                      Size* - For unique size, enter 0
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id={`size${i}`}
                      value={e.size}
                      onChange={handleChangeExtra(i, "size")}
                    />
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={3}>
                  <div className="mb-3 mt-3">
                    <label htmlFor={`rrp${i}`} className="form-label">
                      {`Price${i === 0 ? "*" : ""}`}($)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id={`rrp${i}`}
                      value={e.rrp}
                      onChange={handleChangeExtra(i, "rrp")}
                    />
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={3}>
                  <div className="mb-3 mt-3">
                    <label
                      htmlFor={`numberOfEdition${i}`}
                      className="form-label"
                    >{`No of Editions${i === 0 ? "*" : ""}`}</label>
                    <input
                      type="number"
                      className="form-control"
                      id={`numberOfEdition${i}`}
                      value={e.numOfEdition}
                      onChange={handleChangeExtra(i, "numOfEdition")}
                    />
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={3}>
                  <div className="mb-3 mt-3">
                    <label htmlFor={`SKU${i}`} className="form-label">{`SKU${
                      i === 0 ? "*" : ""
                    }`}</label>
                    <input
                      type="text"
                      className="form-control"
                      id={`sku${i}`}
                      value={e.sku}
                      onChange={handleChangeExtra(i, "sku")}
                    />
                  </div>
                </Col>
              </Row>
            ))}
            <div className="d-flex justify-content-center mt-3 mb-5">
              <button
                className="btn btn-sm px-4"
                style={{
                  border: "1px solid #0F91D2",
                  color: "#0F91D2",
                }}
                onClick={() =>
                  setExtras((_extras) => [
                    ..._extras,
                    {
                      size: "",
                      rrp: 0,
                      numOfEdition: 0,
                      sku: "",
                    },
                  ])
                }
              >
                ADD MORE
              </button>
            </div>
            {!digitalProduct && (
              <div className="d-flex align-items-center justify-content-between mt-5 mb-3">
                <h4 className="fw-bold">
                  PERKS {`PHYSICAL`}
                </h4>
                <div
                  style={{ height: 1, width: "83%", background: "black" }}
                ></div>
              </div>
            )}
            {!digitalProduct && (
              <Row>
                <Col xs={12} md={6} lg={3}>
                  <div className="mb-3 mt-3">
                    <label htmlFor="warrantyLength" className="form-label">
                      Warranty length
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="warrantyLength"
                      name="warrantyLength"
                      value={warrantyLength}
                      onChange={(e) =>
                        setWarrantyLength(Number(e.target.value))
                      }
                    />
                  </div>
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <div className="mb-3 mt-3">
                    <label
                      htmlFor="productRestorationPerk"
                      className="form-label"
                    >
                      PRODUCT RESTORATION
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="productRestorationPerk"
                      name="productRestorationPerk"
                      value={productRestorationPerk}
                      onChange={(e) =>
                        setProductRestorationPerk(e.target.value)
                      }
                    />
                  </div>
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <div className="mb-3 mt-3">
                    <label
                      htmlFor="productMaintenancePerk"
                      className="form-label"
                    >
                      PRODUCT MAINTENANCE
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="productMaintenancePerk"
                      name="productMaintenancePerk"
                      value={productMaintenancePerk}
                      onChange={(e) =>
                        setProductMaintenancePerk(e.target.value)
                      }
                    />
                  </div>
                </Col>
                <Row>
                  <Col xs={12} md={4} lg={3}>
                    <div className="mt-3">
                      <label htmlFor="otherPerk" className="form-label">
                        OTHER
                      </label>
                    </div>
                  </Col>
                </Row>
                {perkFile.length > 0 &&
                  perkFile.map((item, index) => (
                    <div key={index} className="mb-0">
                      <Row>
                        <Col xs={12} md={4} lg={3}>
                          <div className="mb-3 mt-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={item ? item.name : ""}
                              disabled
                            />
                          </div>
                        </Col>
                        <Col xs={12} md={8} lg={6}>
                          <Card
                            style={{
                              borderColor: item ? "transparent" : "#95959540",
                            }}
                          >
                            <input
                              type="file"
                              ref={perkfileRef[index]}
                              className="d-none"
                              onChange={(e) => handlePerkFileChange(e, index)}
                            />
                            {item && (
                              <div className="d-flex justify-content-between align-items-center w-full">
                                <img
                                  src="./file.png"
                                  alt="file png"
                                  style={{ marginTop: 10 }}
                                />
                                <div
                                  style={{
                                    flex: 1,
                                    marginLeft: 20,
                                    marginRight: 20,
                                  }}
                                >
                                  <div className="d-flex justify-content-between">
                                    <h5 style={{ opacity: 0.7 }}>
                                      {item?.name}
                                    </h5>
                                    <h5>
                                      {item?.size > 1024 * 1024
                                        ? `${
                                            Math.floor(
                                              (item?.size * 10) / (1024 * 1024)
                                            ) / 10
                                          }MB`
                                        : `${
                                            Math.floor(
                                              (item?.size * 10) / 1024
                                            ) / 10
                                          }KB`}
                                    </h5>
                                  </div>
                                  <div
                                    className="d-flex justify-content-start flex-wrap"
                                    style={{
                                      background: "#0000001A",
                                    }}
                                  >
                                    <div
                                      className="d-flex justify-content-start flex-wrap"
                                      style={{
                                        background: "#0F91D2",
                                        height: 5,
                                        width: `${Math.floor(
                                          item?.size / (1024 * 1024)
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                                <svg
                                  style={{ marginTop: 10 }}
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="23"
                                  height="23"
                                  viewBox="0 0 23 23"
                                  fill="none"
                                  onClick={() => removeFile(index)}
                                >
                                  <circle
                                    cx="11.5"
                                    cy="11.5"
                                    r="11.5"
                                    fill="#CBCBCB"
                                  />
                                  <path
                                    d="M7.36133 7.35938L15.6413 15.6394"
                                    stroke="#1D1E1F"
                                  />
                                  <path
                                    d="M15.6406 7.35938L7.36063 15.6394"
                                    stroke="#1D1E1F"
                                  />
                                </svg>
                              </div>
                            )}
                            {!item && (
                              <div className="px-5 py-2">
                                <div className="d-flex justify-content-around align-items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="48"
                                    height="48"
                                    viewBox="0 0 48 48"
                                    fill="none"
                                  >
                                    <path
                                      d="M32 32L24 24L16 32"
                                      stroke="#282828"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M24 24V42"
                                      stroke="#282828"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M40.7789 36.78C42.7296 35.7165 44.2706 34.0337 45.1587 31.9972C46.0468 29.9607 46.2314 27.6864 45.6834 25.5334C45.1353 23.3803 43.8859 21.471 42.1323 20.1069C40.3786 18.7427 38.2207 18.0014 35.9989 18H33.4789C32.8736 15.6585 31.7453 13.4846 30.1788 11.642C28.6124 9.79927 26.6486 8.33567 24.4351 7.36118C22.2216 6.3867 19.816 5.92669 17.3992 6.01573C14.9823 6.10478 12.6171 6.74057 10.4813 7.8753C8.34552 9.01003 6.49477 10.6142 5.06819 12.5671C3.64161 14.5201 2.67632 16.771 2.2449 19.1508C1.81348 21.5305 1.92715 23.977 2.57737 26.3065C3.22759 28.636 4.39743 30.7877 5.99894 32.6"
                                      stroke="#282828"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M32 32L24 24L16 32"
                                      stroke="#282828"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <div>
                                    <p className="text-center mb-1">
                                      Select a file or drag and drop here
                                    </p>
                                    <p
                                      className="text-center mb-0"
                                      style={{ color: "#959595", opacity: 0.4 }}
                                    >
                                      JPG, PNG or 3D file size no more than 10MB
                                    </p>
                                  </div>
                                  <div className="d-flex justify-content-center">
                                    <button
                                      className="btn btn-sm px-4"
                                      style={{
                                        border: "1px solid #0F91D2",
                                        color: "#0F91D2",
                                      }}
                                      onClick={() =>
                                        handlePerkClickImage(index)
                                      }
                                    >
                                      SELECT FILE
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  ))}
                {perkFile.length < 5 && (
                  <div className="d-flex justify-content-center mt-3">
                    <button
                      className="btn btn-sm px-4"
                      style={{
                        border: "1px solid #0F91D2",
                        color: "#0F91D2",
                      }}
                      onClick={() =>
                        setPerkFile((_perkFile) => [..._perkFile, null])
                      }
                    >
                      ADD MORE
                    </button>
                  </div>
                )}
              </Row>
            )}
            <div className="d-flex align-items-center justify-content-between mt-5 mb-3">
              <h4 className="fw-bold">PERKS {`DIGITAL`}</h4>
              <div
                style={{ height: 1, width: "83%", background: "black" }}
              ></div>
            </div>
            <Row>
              <Col xs={12} md={6} lg={3}>
                <div className="mb-3 mt-3">
                  <label
                    htmlFor="accessToSpecialCollectionPerk"
                    className="form-label"
                  >
                    ACCESS TO CAPSULE COLLECTION
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="accessToSpecialCollectionPerk"
                    name="accessToSpecialCollectionPerk"
                    value={accessToSpecialCollectionPerk}
                    onChange={(e) =>
                      setAccessToSpecialCollectionPerk(e.target.value)
                    }
                  />
                </div>
              </Col>

              <Col xs={12} md={6} lg={3}>
                <div className="mb-3 mt-3">
                  <label htmlFor="genericDiscountPerk" className="form-label">
                    Discount level
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="genericDiscountPerk"
                    name="genericDiscountPerk"
                    value={genericDiscountPerk}
                    onChange={(e) => setGenericDiscountPerk(e.target.value)}
                  />
                </div>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <div className="mb-3 mt-3">
                  <label htmlFor="ticketToEventPerk" className="form-label">
                    Ticket to event
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="ticketToEventPerk"
                    name="ticketToEventPerk"
                    value={ticketToEventPerk}
                    onChange={(e) => setTicketToEventPerk(e.target.value)}
                  />
                </div>
              </Col>
              <Col xs={12} md={4} lg={3}>
                <div className="mb-3 mt-3">
                  <label htmlFor="vipExperiencePerk" className="form-label">
                    VIP experience
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="vipExperiencePerk"
                    name="vipExperiencePerk"
                    value={vipExperiencePerk}
                    onChange={(e) => setVipExperiencePerk(e.target.value)}
                  />
                </div>
              </Col>
              {digitalProduct && (
                <Col xs={12} md={4} lg={3}>
                  <div className="mt-3">
                    <label htmlFor="otherPerk" className="form-label">
                      OTHER
                    </label>
                  </div>
                </Col>
              )}
              {digitalProduct && (
                <>
                  {perkFile.length > 0 &&
                    perkFile.map((item, index) => (
                      <div key={index} className="mb-0">
                        <Row>
                          <Col xs={12} md={4} lg={3}>
                            <div className="mb-3 mt-3">
                              <input
                                type="text"
                                className="form-control"
                                placeholder={item ? item.name : ""}
                                disabled
                              />
                            </div>
                          </Col>
                          <Col xs={12} md={8} lg={6}>
                            <Card
                              style={{
                                borderColor: item ? "transparent" : "#95959540",
                              }}
                            >
                              <input
                                type="file"
                                ref={perkfileRef[index]}
                                className="d-none"
                                onChange={(e) => handlePerkFileChange(e, index)}
                              />
                              {item && (
                                <div className="d-flex justify-content-between align-items-center w-full">
                                  <img
                                    src="./file.png"
                                    alt="file png"
                                    style={{ marginTop: 10 }}
                                  />
                                  <div
                                    style={{
                                      flex: 1,
                                      marginLeft: 20,
                                      marginRight: 20,
                                    }}
                                  >
                                    <div className="d-flex justify-content-between">
                                      <h5 style={{ opacity: 0.7 }}>
                                        {item?.name}
                                      </h5>
                                      <h5>
                                        {item?.size > 1024 * 1024
                                          ? `${
                                              Math.floor(
                                                (item?.size * 10) /
                                                  (1024 * 1024)
                                              ) / 10
                                            }MB`
                                          : `${
                                              Math.floor(
                                                (item?.size * 10) / 1024
                                              ) / 10
                                            }KB`}
                                      </h5>
                                    </div>
                                    <div
                                      className="d-flex justify-content-start flex-wrap"
                                      style={{
                                        background: "#0000001A",
                                      }}
                                    >
                                      <div
                                        className="d-flex justify-content-start flex-wrap"
                                        style={{
                                          background: "#0F91D2",
                                          height: 5,
                                          width: `${Math.floor(
                                            item?.size / (1024 * 1024)
                                          )}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                  <svg
                                    style={{ marginTop: 10 }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="23"
                                    height="23"
                                    viewBox="0 0 23 23"
                                    fill="none"
                                    onClick={() => removeFile(index)}
                                  >
                                    <circle
                                      cx="11.5"
                                      cy="11.5"
                                      r="11.5"
                                      fill="#CBCBCB"
                                    />
                                    <path
                                      d="M7.36133 7.35938L15.6413 15.6394"
                                      stroke="#1D1E1F"
                                    />
                                    <path
                                      d="M15.6406 7.35938L7.36063 15.6394"
                                      stroke="#1D1E1F"
                                    />
                                  </svg>
                                </div>
                              )}
                              {!item && (
                                <div className="px-5 py-2">
                                  <div className="d-flex justify-content-around align-items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="48"
                                      height="48"
                                      viewBox="0 0 48 48"
                                      fill="none"
                                    >
                                      <path
                                        d="M32 32L24 24L16 32"
                                        stroke="#282828"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M24 24V42"
                                        stroke="#282828"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M40.7789 36.78C42.7296 35.7165 44.2706 34.0337 45.1587 31.9972C46.0468 29.9607 46.2314 27.6864 45.6834 25.5334C45.1353 23.3803 43.8859 21.471 42.1323 20.1069C40.3786 18.7427 38.2207 18.0014 35.9989 18H33.4789C32.8736 15.6585 31.7453 13.4846 30.1788 11.642C28.6124 9.79927 26.6486 8.33567 24.4351 7.36118C22.2216 6.3867 19.816 5.92669 17.3992 6.01573C14.9823 6.10478 12.6171 6.74057 10.4813 7.8753C8.34552 9.01003 6.49477 10.6142 5.06819 12.5671C3.64161 14.5201 2.67632 16.771 2.2449 19.1508C1.81348 21.5305 1.92715 23.977 2.57737 26.3065C3.22759 28.636 4.39743 30.7877 5.99894 32.6"
                                        stroke="#282828"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M32 32L24 24L16 32"
                                        stroke="#282828"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    <div>
                                      <p className="text-center mb-1">
                                        Select a file or drag and drop here
                                      </p>
                                      <p
                                        className="text-center mb-0"
                                        style={{
                                          color: "#959595",
                                          opacity: 0.4,
                                        }}
                                      >
                                        JPG, PNG or 3D file size no more than
                                        10MB
                                      </p>
                                    </div>
                                    <div className="d-flex justify-content-center">
                                      <button
                                        className="btn btn-sm px-4"
                                        style={{
                                          border: "1px solid #0F91D2",
                                          color: "#0F91D2",
                                        }}
                                        onClick={() =>
                                          handlePerkClickImage(index)
                                        }
                                      >
                                        SELECT FILE
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Card>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  {perkFile.length < 5 && (
                    <div className="d-flex justify-content-center mt-3">
                      <button
                        className="btn btn-sm px-4"
                        style={{
                          border: "1px solid #0F91D2",
                          color: "#0F91D2",
                        }}
                        onClick={() =>
                          setPerkFile((_perkFile) => [..._perkFile, null])
                        }
                      >
                        ADD MORE
                      </button>
                    </div>
                  )}
                </>
              )}
            </Row>
            <div className="d-flex align-items-center justify-content-between mt-3 mb-5">
              <h4 className="fw-bold">ROYALTY LEVEL</h4>
              <div
                style={{ height: 1, width: "83%", background: "black" }}
              ></div>
            </div>
            <Row>
              <Col xs={12} md={6} lg={3}>
                <div className="mb-3 mt-3">
                  <label htmlFor="royalty" className="form-label">
                    ROYALTY*
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="royalty"
                    value={royalty}
                    onChange={useCallback(
                      (e) => setRoyalty(e.target.value),
                      []
                    )}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={3}>
                <div className="mb-3 mt-3">
                  <label htmlFor="collaborationRoyalty" className="form-label">
                    Collaboration royalty level{" "}
                    <span style={{ fontSize: "0.7em", color: "grey" }}>
                      (optional)
                    </span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="collaborationRoyalty"
                    value={collaborationRoyalty}
                    onChange={useCallback(
                      (e) => setCollaborationRoyalty(e.target.value),
                      []
                    )}
                  />
                </div>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <div className="mb-3 mt-3">
                  <label
                    htmlFor="collaboratorWalletIdNumber"
                    className="form-label"
                  >
                    Collaborator wallet id number{" "}
                    <span style={{ fontSize: "0.7em", color: "grey" }}>
                      (optional)
                    </span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="collaboratorWalletIdNumber"
                    value={collaboratorWalletIdNumber}
                    onChange={useCallback(
                      (e) => setCollaboratorWalletIdNumber(e.target.value),
                      []
                    )}
                  />
                </div>
              </Col>
            </Row>

            <hr className="my-5" />
            <div className="d-flex justify-content-center mt-0 mb-3">
              <button
                className="btn btn-sm px-4"
                style={{
                  border: "1px solid #0FBC00",
                  color: "#0FBC00",
                }}
                onClick={handleSubmit}
              >
                CREATE NFT
              </button>
            </div>
          </div>
          {CustomModal}
        </Col>
      </Row>
    </Container>
  );
}
