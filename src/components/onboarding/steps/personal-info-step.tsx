'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, ChevronDown, User, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { AccountType } from '@/types/onboarding.types';

interface PersonalInfoStepProps {
  accountType: AccountType | null;
  onNext: () => void;
  onBack: () => void;
  onBoardingData: any;
  setOnBoardingData: (data: any) => void;
}

const titles = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.', 'Engr.'];
const genders = ['Male', 'Female', 'Other'];
const nationalities = ['Nigerian', 'Ghanaian', 'Kenyan', 'South African', 'Other'];

export function PersonalInfoStep({
  accountType,
  onNext,
  onBack,
  onBoardingData,
  setOnBoardingData,
}: PersonalInfoStepProps) {
  const [openTitle, setOpenTitle] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const [openNationality, setOpenNationality] = useState(false);

  const handleChange = (field: string, value: any) => {
    setOnBoardingData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    const required = [
      'first_name',
      'last_name',
      'date_of_birth',
      'nationality',
      'phone_number',
      'email_address',
      'country',
      'state',
      'city',
      'house_address',
    ];
    
    // Email confirmation is required
    if (onBoardingData?.email_address !== onBoardingData?.confirm_email_address) {
      return false;
    }
    
    // Phone confirmation is required
    if (onBoardingData?.phone_number !== onBoardingData?.confirm_phone_number) {
      return false;
    }
    
    return required.every((field) => onBoardingData?.[field]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
        <p className="text-sm text-gray-500">
          Tell us about yourself. This information helps us personalize your insurance coverage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title (Optional) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Title (Optional)</label>
          <div className="relative">
            <button
              onClick={() => setOpenTitle(!openTitle)}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:border-gray-300 transition-colors"
            >
              <span className={onBoardingData?.title ? 'text-gray-900' : 'text-gray-400'}>
                {onBoardingData?.title || 'Select your title'}
              </span>
              <ChevronDown className={cn("w-4 h-4 text-gray-400", openTitle && "rotate-180")} />
            </button>
            {openTitle && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {titles.map((title) => (
                  <button
                    key={title}
                    onClick={() => {
                      handleChange('title', title);
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
              value={onBoardingData?.first_name || ''}
              onChange={(e) => handleChange('first_name', e.target.value)}
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
              value={onBoardingData?.last_name || ''}
              onChange={(e) => handleChange('last_name', e.target.value)}
              placeholder="Enter your last name"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Middle Name (Optional) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Middle Name (Optional)</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={onBoardingData?.middle_name || ''}
              onChange={(e) => handleChange('middle_name', e.target.value)}
              placeholder="Enter your middle name"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Gender (Optional)</label>
          <div className="relative">
            <button
              onClick={() => setOpenGender(!openGender)}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:border-gray-300 transition-colors"
            >
              <span className={onBoardingData?.gender ? 'text-gray-900' : 'text-gray-400'}>
                {onBoardingData?.gender || 'Select your gender'}
              </span>
              <ChevronDown className={cn("w-4 h-4 text-gray-400", openGender && "rotate-180")} />
            </button>
            {openGender && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {genders.map((gender) => (
                  <button
                    key={gender}
                    onClick={() => {
                      handleChange('gender', gender);
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
              selected={onBoardingData?.date_of_birth ? new Date(onBoardingData.date_of_birth) : null}
              onChange={(date: any) => handleChange('date_of_birth', date)}
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
              <span className={onBoardingData?.nationality ? 'text-gray-900' : 'text-gray-400'}>
                {onBoardingData?.nationality || 'Select your nationality'}
              </span>
              <ChevronDown className={cn("w-4 h-4 text-gray-400", openNationality && "rotate-180")} />
            </button>
            {openNationality && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {nationalities.map((nationality) => (
                  <button
                    key={nationality}
                    onClick={() => {
                      handleChange('nationality', nationality);
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
              value={onBoardingData?.phone_number || ''}
              onChange={(e) => handleChange('phone_number', e.target.value)}
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
              value={onBoardingData?.confirm_phone_number || ''}
              onChange={(e) => handleChange('confirm_phone_number', e.target.value)}
              placeholder="Confirm phone number"
              className={cn(
                "w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                onBoardingData?.phone_number && 
                onBoardingData?.confirm_phone_number && 
                onBoardingData?.phone_number !== onBoardingData?.confirm_phone_number
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200"
              )}
            />
          </div>
          {onBoardingData?.phone_number && 
           onBoardingData?.confirm_phone_number && 
           onBoardingData?.phone_number !== onBoardingData?.confirm_phone_number && (
            <p className="text-xs text-red-500 mt-1">Phone numbers do not match</p>
          )}
        </div>

        {/* Foreign Number (Optional) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Foreign Number (Optional)</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={onBoardingData?.foreign_number || ''}
              onChange={(e) => handleChange('foreign_number', e.target.value)}
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
              value={onBoardingData?.email_address || ''}
              onChange={(e) => handleChange('email_address', e.target.value)}
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
              value={onBoardingData?.confirm_email_address || ''}
              onChange={(e) => handleChange('confirm_email_address', e.target.value)}
              placeholder="Confirm your email"
              className={cn(
                "w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                onBoardingData?.email_address && 
                onBoardingData?.confirm_email_address && 
                onBoardingData?.email_address !== onBoardingData?.confirm_email_address
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200"
              )}
            />
          </div>
          {onBoardingData?.email_address && 
           onBoardingData?.confirm_email_address && 
           onBoardingData?.email_address !== onBoardingData?.confirm_email_address && (
            <p className="text-xs text-red-500 mt-1">Email addresses do not match</p>
          )}
        </div>

        {/* Country */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={onBoardingData?.country || 'Nigeria'}
            onChange={(e) => handleChange('country', e.target.value)}
            placeholder="e.g., Nigeria"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* State */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={onBoardingData?.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
            placeholder="e.g., Lagos State"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={onBoardingData?.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="e.g., Lagos"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* CHN (Optional) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">CHN (Clearing House Number) (Optional)</label>
          <input
            type="text"
            value={onBoardingData?.chn || ''}
            onChange={(e) => handleChange('chn', e.target.value)}
            placeholder="Enter CHN if applicable"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Address */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Residential Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={onBoardingData?.house_address || ''}
              onChange={(e) => handleChange('house_address', e.target.value)}
              placeholder="Enter your residential address"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Previous Address (Optional) */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Previous Address (Optional)</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={onBoardingData?.previous_address || ''}
              onChange={(e) => handleChange('previous_address', e.target.value)}
              placeholder="Enter previous address if applicable"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          // disabled={!isFormValid()}
          className={cn(
            "px-8 py-3 rounded-xl font-medium transition-all",
            // isFormValid()
               "bg-linear-to-r from-blue-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105"
              // : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}