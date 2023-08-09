import { useState, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import uploadNft from "../../helpers/upload_nft.mjs";
import { useNavigate } from "react-router-dom";
import formatImageUrl from "../../helpers/format_image_url.js";
import { useAuthenticatedFetch } from "../../hooks";
import { Card, Container, Row, Col, Modal, Spinner } from "react-bootstrap";
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import Joi from "joi";
import { axiosInstance } from "../../contexts/AuthContext.js";

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
    label: 'Men',
    value: 'Men',
  },
  {
    label: 'Women',
    value: 'Women',
  },
  {
    label: 'Unisex',
    value: 'Unisex',
  }
]

const categories = [
  {
    label: 'Bags',
    value: 'Bags',
  },
  {
    label: 'Leather goods',
    value: 'Leather goods',
  },
  {
    label: 'Jewellery',
    value: 'Jewellery',
  },
  {
    label: 'Shoes',
    value: 'Shoes',
  },
  {
    label: 'Watches',
    value: 'Watches',
  },
  {
    label: 'Sunglasses',
    value: 'Sunglasses',
  }
]

export default function CreateNFT() {
  // const { user } = useContext(UserContext);

  // useState stores and updates values input in form and image, so that we can use it for our POST request later on.
  const [nftImage, setNftImage] = useState();
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
  const [accessToCapsuleCollectionPerk, setAccessToCapsuleCollectionPerk] =
    useState("");
  const [accessToSpecialMediaContentPerk, setAccessToSpecialMediaContentPerk] =
    useState("");
  const [genericDiscountPerk, setGenericDiscountPerk] = useState(0);
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
    for (let e of extras) {
      if (e.size && e.sku && e.rrp && e.numOfEdition) {
        count = count + Number(e.numOfEdition);
      }
    }
    return count || 1;
  }, [extras]);

  //royalty
  const [royalty, setRoyalty] = useState(5);

  //allcollections
  const [allCollections, setAllCollections] = useState([]);

  //  state for custom modal component
  const [activeCustomModal, setActiveCustomModal] = useState(false);
  const [isNFTCreated, setIsNFTCreated] = useState(false);
  const [isNFTCreating, setIsNFTCreating] = useState(false);

  // Setting up Navigation Method
  const navigate = useNavigate();
  const fileRef = useRef();
  const imgRef = useRef();



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
  const fetchCollections = useCallback(() => {
    try{
      axiosInstance.get('/users/api/v1/collections/all').then(({ data }) => {
        if (data.success) {
          setAllCollections(
            data.collections.map((collection) => ({
              value: collection.id,
              label: collection.name,
            }))
          );
        }
      });
    }catch (e) {
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
      <img src={
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
      const __extras = _extras.filter(_item => _item.numOfEdition > 0 && _item.sku !== "" && _item.ipfs);
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
          ...(accessToCapsuleCollectionPerk
            ? [
              {
                perkName: 'Access To Capsule Collection',
                value: accessToCapsuleCollectionPerk,
              },
            ]
            : []),
          ...(accessToSpecialMediaContentPerk
            ? [
              {
                perkName: 'Access To Special Media Collection',
                value: accessToSpecialMediaContentPerk,
              },
            ]
            : []),
          ...(genericDiscountPerk
            ? [
              {
                perkName: 'Generic Discount',
                value: genericDiscountPerk,
              },
            ]
            : []),
          ...(productRestorationPerk
            ? [
              {
                perkName: 'Product Restoreation',
                value: productRestorationPerk,
              },
            ]
            : []),
          ...(productMaintenancePerk
            ? [
              {
                perkName: 'Product Maintenance',
                value: productMaintenancePerk,
              },
            ]
            : []),
          ...(ticketToEventPerk
            ? [
              {
                perkName: 'Ticket To Event',
                value: ticketToEventPerk,
              },
            ]
            : []),
          ...(vipExperiencePerk
            ? [
              {
                perkName: 'Vip Experience',
                value: vipExperiencePerk,
              },
            ]
            : []),
          ...(otherPerk
            ? [
              {
                perkName: 'Other',
                value: otherPerk
              },
            ]
            : []),
        ],
        editions: +numOfVariants || 0,
        royalty: +royalty || 0,
        price: extras[0].rrp,
        extras: __extras
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
      accessToCapsuleCollectionPerk,
      accessToSpecialMediaContentPerk,
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
        category
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
              files: [
                ...(nftImage
                  ? [
                    {
                      type: 'image',
                      uri: nftImage,
                      ext: nftImage.type,
                    },
                  ]
                  : []),
                ...(heroBannerImage
                  ? [
                    {
                      type: 'video',
                      uri: heroBannerImage,
                      ext: heroBannerImage.type,
                    },
                  ]
                  : []),
                ...(nft3DFile
                  ? [
                    {
                      type: '3D',
                      uri: nft3DFile,
                      ext: nft3DFile.type,
                    },
                  ]
                  : []),
              ],
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
                      ...(accessToCapsuleCollectionPerk
                        ? { accessToCapsuleCollectionPerk }
                        : {}),
                      ...(accessToSpecialMediaContentPerk
                        ? { accessToSpecialMediaContentPerk }
                        : {}),
                      ...(genericDiscountPerk ? { genericDiscountPerk } : {}),
                      ...(productRestorationPerk ? { productRestorationPerk } : {}),
                      ...(productMaintenancePerk ? { productMaintenancePerk } : {}),
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
            ipfs: ipfs["url"]
          })
        }
      }
      console.log(_extras);
      // setExtras(__extras => _extras);

      // get imageUrl in correct format so we can use it for the item list

      const mintPayload = getMintPayload(_extras);
      console.log("mintPayload", mintPayload);
      const res = await axiosInstance.post("/users/api/v1/mint", mintPayload); ////////////////////

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
      //toast("NFT has been created, please collect the redemption links in manage NFT section", false).dispatch(Toast.Action.SHOW);
    } catch (err) {
      console.log("error attempting to upload nft", err);
      setIsNFTCreating(false);
      handleChangeModal();
      //toast("NFT creation failed. Please try again", true).dispatch(Toast.Action.SHOW);
    }
  };


  // custom Modal component
  let CustomModal = <></>;
  if (activeCustomModal == true)
    CustomModal = (
      <div style={{ height: "500px" }}>

        <Modal show={activeCustomModal} onHide={handleChangeModal}>
          <Modal.Header>
            <Modal.Title>{isNFTCreated ? "Success" : "Submitting Product to Store"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isNFTCreated ? (
              <p className="text-center fw-bold">
                NFT has been created, please collect the redemption links in
                manage NFT section
              </p>
            ) : (
              <div className="d-flex justify-content-around align-items-center" vertical>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Adding Product and Retreiving Redemption Link...</span>
                </Spinner>s
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
    if (fileRef)
      fileRef.current.click();
  }

  const handleFileChange = (event) => {
    console.log(event.target.files);
    let file = event.target.files[0];
    if (!file.type.includes('image')) {
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
  }

  return (
    <Container className="pt-5">
      <Row>
        <Col lg={4} md={6} xs={12} sm={12}>
          <Card className="p-3">
            <h3 className="fw-bold">NFT ICON* (2D IMAGE)</h3>
            <Card onClick={() => handleClickImage()} className="w-100" style={{ minHeight: 80 }}>
              <input type="file" ref={fileRef} className="d-none" onChange={handleFileChange} />

              <img src={nftImage} ref={imgRef} />

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
          </Card>
        </Col>


        {/* 
          <Col lg={4} md={6} xs={12} sm={12}>
            <Card>
              <Card.Section>
                <Heading>3D NFT</Heading>
              </Card.Section>

              <Card.Section>
                <DropZone
                  allowMultiple={false}
                  onDrop={handleDropZoneDropNft3DFile}
                  // accept="model/obj"
                  type="file"
                >
                  {Nft3DFileContent}
                </DropZone>
              </Card.Section>
            </Card>
          </Col> */
        }

      </Row>
      <Row className="mt-5">
        <Col lg={12} md={12} xs={12} sm={12}>
          <h4>NFT DETAILS</h4>
          <div>
            <div className="mb-3 mt-3">
              <label htmlFor="collection" className="form-label">COLLECTION NAME*</label>
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
            <div className="mb-3 mt-3">
              <label htmlFor="nftName" className="form-label">PRODUCT NAME*</label>
              <input
                type="text"
                className="form-control"
                id="nftName"
                name="nftName"
                value={nftName}
                onChange={useCallback(
                  (e) => setNftName(e.target.value),
                  []
                )}
              />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="brand" className="form-label">BRAND*</label>
              <input
                type="text"
                className="form-control"
                id="brand"
                name="brand"
                value={brand}
                onChange={useCallback(
                  (e) => setBrand(e.target.value),
                  []
                )}
              />
            </div>
            <Row>
              <Col sm={12} md={6}>
                <div className="mb-3 mt-3">
                  <label htmlFor="vrOrMetaverseCompliant" className="form-label">VR/METAVERSE COMPLIANT*</label>
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
                    <option value="true">
                      Yes
                    </option>
                    <option value="false">
                      No
                    </option>
                  </select>
                </div>

              </Col>
              <Col sm={12} md={6}>
                <div className="mb-3 mt-3">
                  <label htmlFor="digitalProduct" className="form-label">NFT TYPE*</label>
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
                    <option value="true">
                      Digital
                    </option>
                    <option value="false">
                      Physical
                    </option>
                  </select>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={6}>
                <div className="mb-3 mt-3">
                  <label htmlFor="category" className="form-label">CATEGORY*</label>
                  <select
                    type="text"
                    className="form-control"
                    id="category"
                    name="category"
                    value={category}
                    onChange={useCallback(
                      (e) =>
                        setCategory(e.target.value),
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
              <Col sm={12} md={6}>
                <div className="mb-3 mt-3">
                  <label htmlFor="gender" className="form-label">GENDER*</label>
                  <select
                    type="text"
                    className="form-control"
                    id="gender"
                    name="gender"
                    value={gender}
                    onChange={useCallback(
                      (e) => setGender(e.target.value),
                      []
                    )}
                  >
                    {genders.map((gender, index) => (
                      <option key={index} value={gender.value}>
                        {gender.label}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
            </Row>
            <div className="mb-3 mt-3">
              <label htmlFor="description" className="form-label">DESCRIPTION*</label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={description}
                onChange={useCallback(
                  (e) => setDescription(e.target.value),
                  []
                )}
              />
            </div>
            <Row>
              <Col xs={12} md={6} lg={4}>
                <div className="mb-3 mt-3">
                  <label htmlFor="accessToCapsuleCollectionPerk" className="form-label">ACCESS TO CAPSULE COLLECTION</label>
                  <input
                    type="text"
                    className="form-control"
                    id="accessToCapsuleCollectionPerk"
                    name="accessToCapsuleCollectionPerk"
                    value={accessToCapsuleCollectionPerk}
                    onChange={useCallback(
                      (e) => setAccessToCapsuleCollectionPerk(e.target.value),
                      []
                    )}
                  />
                </div>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <div className="mb-3 mt-3">
                  <label htmlFor="accessToSpecialMediaContentPerk" className="form-label">ACCESS TO SPECIAL MEDIA CONTENT</label>
                  <input
                    type="text"
                    className="form-control"
                    id="accessToSpecialMediaContentPerk"
                    name="accessToSpecialMediaContentPerk"
                    value={accessToSpecialMediaContentPerk}
                    onChange={useCallback(
                      (e) => setAccessToSpecialMediaContentPerk(e.target.value),
                      []
                    )}
                  />
                </div>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <div className="mb-3 mt-3">
                  <label htmlFor="genericDiscountPerk" className="form-label">GENERIC DISCOUNT</label>
                  <input
                    type="number"
                    className="form-control"
                    id="genericDiscountPerk"
                    name="genericDiscountPerk"
                    value={genericDiscountPerk}
                    onChange={useCallback(
                      (e) => setGenericDiscountPerk(e.target.value),
                      []
                    )}
                  />
                </div>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <div className="mb-3 mt-3">
                  <label htmlFor="productRestorationPerk" className="form-label">PRODUCT RESTORATION</label>
                  <input
                    type="text"
                    className="form-control"
                    id="productRestorationPerk"
                    name="productRestorationPerk"
                    value={productRestorationPerk}
                    onChange={useCallback(
                      (e) => setProductRestorationPerk(e.target.value),
                      []
                    )}
                  />
                </div>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <div className="mb-3 mt-3">
                  <label htmlFor="productMaintenancePerk" className="form-label">PRODUCT MAINTENANCE</label>
                  <input
                    type="text"
                    className="form-control"
                    id="productMaintenancePerk"
                    name="productMaintenancePerk"
                    value={productMaintenancePerk}
                    onChange={useCallback(
                      (e) => setProductMaintenancePerk(e.target.value),
                      []
                    )}
                  />
                </div>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <div className="mb-3 mt-3">
                  <label htmlFor="ticketToEventPerk" className="form-label">TICKET TO EVENT</label>
                  <input
                    type="text"
                    className="form-control"
                    id="ticketToEventPerk"
                    name="ticketToEventPerk"
                    value={ticketToEventPerk}
                    onChange={useCallback(
                      (e) => setTicketToEventPerk(e.target.value),
                      []
                    )}
                  />
                </div>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <div className="mb-3 mt-3">
                  <label htmlFor="vipExperiencePerk" className="form-label">VIP EXPERIENCE</label>
                  <input
                    type="text"
                    className="form-control"
                    id="vipExperiencePerk"
                    name="vipExperiencePerk"
                    value={vipExperiencePerk}
                    onChange={useCallback(
                      (e) => setVipExperiencePerk(e.target.value),
                      []
                    )}
                  />
                </div>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <div className="mb-3 mt-3">
                  <label htmlFor="otherPerk" className="form-label">OTHER</label>
                  <input
                    type="text"
                    className="form-control"
                    id="otherPerk"
                    name="otherPerk"
                    value={otherPerk}
                    onChange={useCallback(
                      (e) => setOtherPerk(e.target.value),
                      []
                    )}
                  />
                </div>
              </Col>
            </Row>
            {extras.map((e, i) => (
              <Row key={i}>
                <Col xs={12} sm={12} md={6} lg={3}>
                  <div className="mb-3 mt-3">
                    <label htmlFor={`size${i}`} className="form-label">{`SIZE${i === 0 ? "*" : ""}`}</label>
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
                    <label htmlFor={`rrp${i}`} className="form-label">{`RRP${i === 0 ? "*" : ""}`}($)</label>
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
                    <label htmlFor={`numberOfEdition${i}`} className="form-label">{`NUMBER OF EDITIONS${i === 0 ? "*" : ""}`}</label>
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
                    <label htmlFor={`sku${i}`} className="form-label">{`SKU${i === 0 ? "*" : ""}`}</label>
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

            {!digitalProduct && (
              <>
                <h3 className="fw-bold mt-3 mb-5">PRODUCT DETAILS FOR PHYSICAL NFT</h3>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <div className="mb-3 mt-3">
                      <label htmlFor="releaseDate" className="form-label">RELEASE DATE*</label>
                      <input
                        type="date"
                        className="form-control"
                        id="releaseDate"
                        value={releaseDate}
                        onChange={
                          (e) => setReleaseDate(e.target.value)}
                      />
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <div className="mb-3 mt-3">
                      <label htmlFor="color" className="form-label">COLOR</label>
                      <input
                        type="text"
                        className="form-control"
                        id="color"
                        value={color}
                        onChange={
                          (e) => setColor(e.target.value)}
                      />
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={6}>
                    <div className="mb-3 mt-3">
                      <label htmlFor="material" className="form-label">MATERIAL</label>
                      <input
                        type="text"
                        className="form-control"
                        id="material"
                        value={material}
                        onChange={
                          (e) => setMaterial(e.target.value)
                        }
                      />
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={6}>
                    <div className="mb-3 mt-3">
                      <label htmlFor="country" className="form-label">COUNTRY OF MANUFACTURE</label>
                      <input
                        type="text"
                        className="form-control"
                        id="country"
                        value={country}
                        onChange={
                          (e) => setCountry(e.target.value)
                        }
                      />
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <div className="mb-3 mt-3">
                      <label htmlFor="otherCharacteristics" className="form-label">OTHER SPECIFICATIONS</label>
                      <textarea
                        rows={5}
                        className="form-control"
                        id="otherCharacteristics"
                        value={otherCharacteristics}
                        onChange={
                          (e) => setOtherCharacteristics(e.target.value)
                        }
                      />
                    </div>
                  </Col>
                </Row>
              </>
            )}

            <h3 className="fw-bold mt-3 mb-5">Royalty</h3>
            <div className="mb-3 mt-3">
              <label htmlFor="royalty" className="form-label">ROYALTY*</label>
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


            <div className="d-flex justify-content-end">
              <button className="btn btn-success btn-sm" onClick={handleSubmit}>
                Create
              </button>
            </div>
          </div>
          {CustomModal}
        </Col>
      </Row>
    </Container>
  );
}