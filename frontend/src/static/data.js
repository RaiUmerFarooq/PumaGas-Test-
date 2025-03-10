// navigation Data
export const navItems = [
  { title: "Home", url: "/" },
  { title: "Shop", url: "/ShopCat" },
  { title: "Best Selling", url: "/best-selling" },
  { title: "Products", url: "/products" },
  { title: "Combo", url: "/events" },
  { title: "Contact Us", url: "/contact" },
];

// branding data
export const brandingData = [
  {
    id: 1,
    title: "Free Shipping",
    Description: "From all orders over $100",
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 3.5C12 2.11929 13.1193 1 14.5 1C15.8807 1 17 2.11929 17 3.5C17 4.88071 15.8807 6 14.5 6C13.1193 6 12 4.88071 12 3.5Z"
          fill="#00B2A9"
        />
        {/* Add additional SVG paths for your icon */}
      </svg>
    ),
  },
  {
    id: 2,
    title: "Daily Surprise Offers",
    Description: "Save up to 25% off",
    icon: (
      <svg
        width="32"
        height="34"
        viewBox="0 0 32 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M31 17.4502C31 25.7002 24.25 32.4502 16 32.4502C7.75 32.4502 1 25.7002 1 17.4502C1 9.2002 7.75 2.4502 16 2.4502C21.85 2.4502 26.95 5.7502 29.35 10.7002"
          stroke="#FFBB38"
          strokeWidth="2"
          strokeMiterlimit="10"
        />
        <path
          d="M30.7 2L29.5 10.85L20.5 9.65"
          stroke="#FFBB38"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="square"
        />
      </svg>
    ),
  },
];

// categories data
export const categoriesData = [
  {
    id: 1,
    title: "Air Coolers",
    image_Url: "https://i.postimg.cc/B6DNFfZG/Air-Coolers-icon.jpg", // Placeholder URL; you can replace with actual URLs
    subcategories: [
      { id: 1, title: "Air Coolers", description: "" },
      { id: 2, title: "AC/DC Cooler", description: "" },
      { id: 3, title: "DC 12V Cooler", description: "" },
    ],
  },
  {
    id: 2,
    title: "Gas Stove",
    image_Url: "https://i.postimg.cc/1XQBc74V/cooking-stove.jpg", // Placeholder URL
    subcategories: [
      { id: 1, title: "Automatic", description: "" },
      { id: 2, title: "Simple", description: "" },
      { id: 3, title: "Electric", description: "" },
      { id: 4, title: "Glass Top", description: "" },
    ],
  },
  {
    id: 3,
    title: "Gas Hob (Built-in)",
    image_Url: "https://i.postimg.cc/Hn92S07Z/Gas-Hob-Built-in-icon.jpg", // Placeholder URL
    subcategories: [
      { id: 1, title: "Gas Hob", description: "" },
      { id: 2, title: "Imported Gas Hob", description: "" },
      { id: 3, title: "Touch Gas Hob", description: "" },
      { id: 4, title: "Electric Hob", description: "" },
    ],
  },
 {
    id: 4,
    title: "Cooking Range",
    image_Url: "https://i.postimg.cc/vmC3DZsz/cooking-range.jpg", // Placeholder URL
    subcategories: [
      { id: 1, title: "Gas Cooking Range", description: "" },
      { id: 2, title: "Electric + Gas Cooking Range", description: "" },
    
    ],
  },
  {
    id: 5,
    title: "Hood",
    image_Url: "https://i.postimg.cc/DwZggXf6/Hoodicon.jpg", // Placeholder URL
    subcategories: [
      { id: 1, title: "Manual", description: "" },
      { id: 2, title: "Touch", description: "" },
      { id: 3, title: "Voice", description: "" },
      { id: 4, title: "Bluetooth", description: "" },
      { id: 5, title: "Imported", description: "" },
    ],
  },
  {
    id: 6,
    title: "Gas Geyser",
    image_Url: "https://i.postimg.cc/rw0hT46m/gyser-icon.webp", // Placeholder URL
    subcategories: [
      { id: 1, title: "Gas Geyser", description: "" },
      { id: 2, title: "Electric + Gas Geyser", description: "" },
      { id: 3, title: "Fully Electric Geyser", description: "" },
      { id: 4, title: "Instant Gas Geyser", description: "" },
      { id: 5, title: "Instant Electric Geyser", description: "" },
    ],
  },
  {
    id: 7,
    title: "Washing Machine",
    image_Url: "https://i.postimg.cc/k5RyrPbt/washing-machine.png", // Placeholder URL
    subcategories: [
      { id: 1, title: "Spinner", description: "" },
      { id: 2, title: "Washer", description: "" },
      { id: 3, title: "Twin Tub", description: "" },
      { id: 4, title: "Full Automatic", description: "" },
    ],
  },
  {
    id: 8,
    title: "Gas Cylinder",
    image_Url: "https://i.postimg.cc/7P3mY4Q3/gas-cylender.webp", // Placeholder URL
    subcategories: [
      { id: 1, title: "5kg", description: "" },
      { id: 2, title: "8kg", description: "" },
      { id: 3, title: "14kg", description: "" },
      { id: 4, title: "19kg", description: "" },
      { id: 5, title: "Fibre Cylinder", description: "" },
    ],
  },
  {
    id: 9,
    title: "Fan",
    image_Url: "https://i.postimg.cc/43YWJhry/fan.png", // Placeholder URL
    subcategories: [
      { id: 1, title: "Fan", description: "" },
      { id: 2, title: "AC/DC Fan", description: "" },
      { id: 3, title: "DC Fan", description: "" },
      { id: 4, title: "30watt", description: "" },
      { id: 5, title: "60watt", description: "" },
      { id: 6, title: "Ceiling Fan", description: "" },
      { id: 7, title: "Pedestal Fan", description: "" },
      { id: 8, title: "Bracket Fan", description: "" },
      { id: 9, title: "Exhaust Fan", description: "" },
    ],
  },
  {
    id: 10,
    title: "Heaters",
    image_Url: "https://i.postimg.cc/7YX90V4b/Heater.png", // Placeholder URL
    subcategories: [
      { id: 1, title: "Gas Heaters", description: "" },
      { id: 2, title: "Electric + Gas Heaters", description: "" },
      { id: 3, title: "Full Electric", description: "" },
    ],
  },
  {
    id: 11,
    title: "Water Cooler",
    image_Url: "https://i.postimg.cc/KYtJky8h/water-cooler-icon.webp", // Placeholder URL
    subcategories: [
      { id: 1, title: "Water Cooler", description: "" },
    ],
  },
  {
    id: 12,
    title: "Water Dispensers",
    image_Url: "https://i.postimg.cc/Y93RRfFX/water-despenser.png", // Placeholder URL
    subcategories: [
      { id: 1, title: "Water Dispensers", description: "" },
    ],
  },
  // {
  //   id: 13,
  //   title: "Combo Deals",
  //   image_Url: "https://i.postimg.cc/pVJ0x0ph/Combo-Deals.webp", // Placeholder URL
  //   subcategories: [
  //     { id: 1, title: "Combo Deals", description: "" },
  //   ],
  // },
];
// footer links data
export const footerProductLinks = [
  { name: "About us", link: "/about" },
  { name: "Store Locations", link: "/store-locations" },
];

export const footercompanyLinks = [
  { name: "Shop", link: "/ShopCat" },
  { name: "Best Selling", link: "/best-selling" },
  { name: "Products", link: "/products" },
  { name: "Combo", link: "/events" },
];

export const footerSupportLinks = [
  { name: "FAQ", link: "/faq" },
  { name: "Contact Us", link: "/contact" },
];
export const MissionImg = "https://i.postimg.cc/wMqfYbH8/puma.jpg";
export const ProductsImg = "https://i.postimg.cc/GpDSFyzN/group-photo.jpg";
export const ImgUrl="https://i.postimg.cc/wMqfYbH8/puma.jpg";
export const BureauCer="https://i.postimg.cc/FRgWqXMV/certification.jpg";
export const PakStand="https://i.postimg.cc/cHNkXLbJ/paksitan-standard.jpg";
export const Swisso="https://i.postimg.cc/FzTPrgsf/swisso.jpg";