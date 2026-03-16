"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Calendar,
  ChevronDown,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  House,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccountType } from "@/types/onboarding.types";

interface PersonalInfoSectionProps {
  accountType: AccountType | null;
  onBoardingData: any;
  setOnBoardingData: (data: any) => void;
}

const titles = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Engr."];
const genders = ["Male", "Female", "Other"];
const nationalities = [
  "Nigerian",
  "Ghanaian",
  "Kenyan",
  "South African",
  "Other",
];

// Country data with states and cities
const countries = [
  {
    name: "Nigeria",
    states: [
      {
        name: "Lagos",
        cities: [
          "Ikeja",
          "Victoria Island",
          "Lekki",
          "Surulere",
          "Yaba",
          "Apapa",
          "Mainland",
        ],
      },
      {
        name: "Abuja FCT",
        cities: ["Garki", "Wuse", "Maitama", "Asokoro", "Gwarinpa", "Kubwa"],
      },
      {
        name: "Rivers",
        cities: ["Port Harcourt", "Obio-Akpor", "Eleme", "Oyigbo", "Okrika"],
      },
      {
        name: "Oyo",
        cities: ["Ibadan", "Ogbomosho", "Oyo", "Iseyin", "Saki"],
      },
      {
        name: "Kano",
        cities: ["Kano", "Fagge", "Dala", "Nassarawa", "Gwale"],
      },
      {
        name: "Kaduna",
        cities: ["Kaduna", "Zaria", "Kafanchan", "Saminaka"],
      },
      {
        name: "Delta",
        cities: ["Warri", "Asaba", "Ughelli", "Sapele", "Agbor"],
      },
      {
        name: "Edo",
        cities: ["Benin City", "Auchi", "Ekpoma", "Uromi"],
      },
      {
        name: "Ogun",
        cities: ["Abeokuta", "Ijebu Ode", "Sagamu", "Ota"],
      },
      {
        name: "Anambra",
        cities: ["Awka", "Onitsha", "Nnewi", "Ekwulobia"],
      },
      {
        name: "Enugu",
        cities: ["Enugu", "Nsukka", "Agbani", "Oji River"],
      },
      {
        name: "Cross River",
        cities: ["Calabar", "Ikom", "Obudu", "Ogoja"],
      },
    ],
  },
  {
    name: "Ghana",
    states: [
      {
        name: "Greater Accra",
        cities: ["Accra", "Tema", "Ada", "Dodowa"],
      },
      {
        name: "Ashanti",
        cities: ["Kumasi", "Obuasi", "Mampong", "Konongo"],
      },
      {
        name: "Western",
        cities: ["Sekondi-Takoradi", "Tarkwa", "Axim", "Half Assini"],
      },
    ],
  },
  {
    name: "Kenya",
    states: [
      {
        name: "Nairobi",
        cities: ["Nairobi", "Kiambu", "Thika", "Kikuyu"],
      },
      {
        name: "Mombasa",
        cities: ["Mombasa", "Kilifi", "Kwale", "Malindi"],
      },
    ],
  },
  {
    name: "South Africa",
    states: [
      {
        name: "Gauteng",
        cities: ["Johannesburg", "Pretoria", "Soweto", "Germiston"],
      },
      {
        name: "Western Cape",
        cities: ["Cape Town", "Stellenbosch", "George", "Paarl"],
      },
    ],
  },
  {
    name: "Other",
    states: [
      {
        name: "Other",
        cities: ["Other"],
      },
    ],
  },
];

export function PersonalInfoSection({
  accountType,
  onBoardingData,
  setOnBoardingData,
}: PersonalInfoSectionProps) {
  const [openTitle, setOpenTitle] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const [openNationality, setOpenNationality] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);
  const [openState, setOpenState] = useState(false);
  const [openCity, setOpenCity] = useState(false);

  const isIndividual = accountType === "individual";
  const isCorporate = accountType === "corporate";

  const handleChange = (field: string, value: any) => {
    setOnBoardingData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Get available states based on selected country
  const selectedCountry = countries.find(
    (c) => c.name === onBoardingData?.country,
  );
  const availableStates = selectedCountry?.states || [];

  // Get available cities based on selected state
  const selectedState = selectedCountry?.states.find(
    (s) => s.name === onBoardingData?.state,
  );
  const availableCities = selectedState?.cities || [];

  console.log(onBoardingData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-auto">
      {/* Title (Optional) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Title (Optional)
        </label>
        <div className="relative">
          <button
            onClick={() => setOpenTitle(!openTitle)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:border-gray-300 transition-colors"
          >
            <span
              className={
                onBoardingData?.title ? "text-gray-900" : "text-gray-400"
              }
            >
              {onBoardingData?.title || "Select your title"}
            </span>
            <ChevronDown
              className={cn("w-4 h-4 text-gray-400", openTitle && "rotate-180")}
            />
          </button>
          {openTitle && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {titles.map((title) => (
                <button
                  key={title}
                  onClick={() => {
                    handleChange("title", title);
                    setOpenTitle(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  {title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* First Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          First Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={onBoardingData?.first_name || ""}
            onChange={(e) => handleChange("first_name", e.target.value)}
            placeholder="Enter your first name"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Last Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Last Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={onBoardingData?.last_name || ""}
            onChange={(e) => handleChange("last_name", e.target.value)}
            placeholder="Enter your last name"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Middle Name (Optional) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Middle Name (Optional)
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={onBoardingData?.middle_name || ""}
            onChange={(e) => handleChange("middle_name", e.target.value)}
            placeholder="Enter your middle name"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Gender (Optional)
        </label>
        <div className="relative">
          <button
            onClick={() => setOpenGender(!openGender)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:border-gray-300 transition-colors"
          >
            <span
              className={
                onBoardingData?.gender ? "text-gray-900" : "text-gray-400"
              }
            >
              {onBoardingData?.gender || "Select your gender"}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-gray-400",
                openGender && "rotate-180",
              )}
            />
          </button>
          {openGender && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {genders.map((gender) => (
                <button
                  key={gender}
                  onClick={() => {
                    handleChange("gender", gender);
                    setOpenGender(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  {gender}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Date of Birth */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
          <DatePicker
            selected={
              onBoardingData?.date_of_birth
                ? new Date(onBoardingData.date_of_birth)
                : null
            }
            onChange={(date: any) => handleChange("date_of_birth", date)}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select your date of birth"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            maxDate={new Date()}
          />
        </div>
      </div>

      {/* Nationality */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Nationality <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <button
            onClick={() => setOpenNationality(!openNationality)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:border-gray-300 transition-colors"
          >
            <span
              className={
                onBoardingData?.nationality ? "text-gray-900" : "text-gray-400"
              }
            >
              {onBoardingData?.nationality || "Select your nationality"}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-gray-400",
                openNationality && "rotate-180",
              )}
            />
          </button>
          {openNationality && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {nationalities.map((nationality) => (
                <button
                  key={nationality}
                  onClick={() => {
                    handleChange("nationality", nationality);
                    setOpenNationality(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  {nationality}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="tel"
            value={onBoardingData?.phone_number || ""}
            onChange={(e) => handleChange("phone_number", e.target.value)}
            placeholder="+234 801 234 5678"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Confirm Phone Number */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Confirm Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="tel"
            value={onBoardingData?.confirm_phone_number || ""}
            onChange={(e) =>
              handleChange("confirm_phone_number", e.target.value)
            }
            placeholder="Confirm phone number"
            className={cn(
              "w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              onBoardingData?.phone_number &&
                onBoardingData?.confirm_phone_number &&
                onBoardingData?.phone_number !==
                  onBoardingData?.confirm_phone_number
                ? "border-red-300 bg-red-50"
                : "border-gray-200",
            )}
          />
        </div>
        {onBoardingData?.phone_number &&
          onBoardingData?.confirm_phone_number &&
          onBoardingData?.phone_number !==
            onBoardingData?.confirm_phone_number && (
            <p className="text-xs text-red-500 mt-1">
              Phone numbers do not match
            </p>
          )}
      </div>

      {/* Foreign Number (Optional) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Foreign Number (Optional)
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="tel"
            value={onBoardingData?.foreign_number || ""}
            onChange={(e) => handleChange("foreign_number", e.target.value)}
            placeholder="International phone number"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={onBoardingData?.email_address || ""}
            onChange={(e) => handleChange("email_address", e.target.value)}
            placeholder="you@example.com"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Confirm Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Confirm Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={onBoardingData?.confirm_email_address || ""}
            onChange={(e) =>
              handleChange("confirm_email_address", e.target.value)
            }
            placeholder="Confirm your email"
            className={cn(
              "w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              onBoardingData?.email_address &&
                onBoardingData?.confirm_email_address &&
                onBoardingData?.email_address !==
                  onBoardingData?.confirm_email_address
                ? "border-red-300 bg-red-50"
                : "border-gray-200",
            )}
          />
        </div>
        {onBoardingData?.email_address &&
          onBoardingData?.confirm_email_address &&
          onBoardingData?.email_address !==
            onBoardingData?.confirm_email_address && (
            <p className="text-xs text-red-500 mt-1">
              Email addresses do not match
            </p>
          )}
      </div>

      {/* Country Dropdown */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Country <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
          <button
            onClick={() => setOpenCountry(!openCountry)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:border-gray-300 transition-colors"
          >
            <span
              className={
                onBoardingData?.country ? "text-gray-900" : "text-gray-400"
              }
            >
              {onBoardingData?.country || "Select your country"}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-gray-400",
                openCountry && "rotate-180",
              )}
            />
          </button>
          {openCountry && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
              {countries.map((country) => (
                <button
                  key={country.name}
                  onClick={() => {
                    handleChange("country", country.name);
                    handleChange("state", "");
                    handleChange("city", "");
                    setOpenCountry(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  {country.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* State Dropdown */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          State <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
          <button
            onClick={() => setOpenState(!openState)}
            disabled={!onBoardingData?.country}
            className={cn(
              "w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:border-gray-300 transition-colors",
              !onBoardingData?.country && "opacity-50 cursor-not-allowed",
            )}
          >
            <span
              className={
                onBoardingData?.state ? "text-gray-900" : "text-gray-400"
              }
            >
              {onBoardingData?.state || "Select your state"}
            </span>
            <ChevronDown
              className={cn("w-4 h-4 text-gray-400", openState && "rotate-180")}
            />
          </button>
          {openState && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
              {availableStates.map((state) => (
                <button
                  key={state.name}
                  onClick={() => {
                    handleChange("state", state.name);
                    handleChange("city", "");
                    setOpenState(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  {state.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* City Dropdown */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          City <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
          <button
            onClick={() => setOpenCity(!openCity)}
            disabled={!onBoardingData?.state}
            className={cn(
              "w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:border-gray-300 transition-colors",
              !onBoardingData?.state && "opacity-50 cursor-not-allowed",
            )}
          >
            <span
              className={
                onBoardingData?.city ? "text-gray-900" : "text-gray-400"
              }
            >
              {onBoardingData?.city || "Select your city"}
            </span>
            <ChevronDown
              className={cn("w-4 h-4 text-gray-400", openCity && "rotate-180")}
            />
          </button>
          {openCity && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
              {availableCities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    handleChange("city", city);
                    setOpenCity(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4 pr-1">
        <label className="text-sm font-medium text-gray-700">
          Residential Address <span className="text-red-500">*</span>
        </label>{" "}
        <div className="relative">
          <House className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={onBoardingData?.house_address || ""}
            onChange={(e) => handleChange("house_address", e.target.value)}
            placeholder="Residential Address"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
