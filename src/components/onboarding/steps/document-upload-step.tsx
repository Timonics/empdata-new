'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, ImageIcon, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { AccountType } from '@/types/onboarding.types';

interface DocumentUploadStepProps {
  accountType: AccountType | null;
  onNext: () => void;
  onBack: () => void;
  onBoardingData: any;
  setOnBoardingData: (data: any) => void;
}

interface UploadedFile {
  file: File;
  preview?: string;
  type: 'identity' | 'cac' | 'passport' | 'signature' | 'nin';
  progress?: number;
  error?: string;
}

export function DocumentUploadStep({
  accountType,
  onNext,
  onBack,
  onBoardingData,
  setOnBoardingData,
}: DocumentUploadStepProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const isIndividual = accountType === 'individual';
  const isCorporate = accountType === 'corporate';
  const requiresNIN = onBoardingData?.identity_card_type === 'National Identity Number';

  const onDrop = useCallback((acceptedFiles: File[], fileType: UploadedFile['type']) => {
    const allowedTypes = {
      identity: ['application/pdf', 'image/jpeg', 'image/png'],
      cac: ['application/pdf', 'image/jpeg', 'image/png'],
      passport: ['image/jpeg', 'image/png'],
      signature: ['application/pdf', 'image/jpeg', 'image/png'],
      nin: ['application/pdf', 'image/jpeg', 'image/png'],
    };

    const maxSize = 5 * 1024 * 1024; // 5MB

    acceptedFiles.forEach((file) => {
      // Validate file type
      if (!allowedTypes[fileType].includes(file.type)) {
        toast.error(`${fileType} must be PDF or image`);
        return;
      }

      // Validate file size
      if (file.size > maxSize) {
        toast.error(`File size must be less than 5MB`);
        return;
      }

      const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;

      const newFile: UploadedFile = {
        file,
        preview,
        type: fileType,
        progress: 100, // Instant upload for UI
      };

      setUploadedFiles(prev => {
        // Remove existing file of same type
        const filtered = prev.filter(f => f.type !== fileType);
        return [...filtered, newFile];
      });

      // Update the main onboarding data
      setOnBoardingData((prev: any) => {
        const fieldMap = {
          identity: isCorporate ? 'director_identity_cards' : 'identity_card',
          cac: 'cac_document',
          passport: isCorporate ? 'director_passport_photograph' : 'passport_photograph',
          signature: 'scanned_signature',
          nin: 'nin_document',
        };
        
        return {
          ...prev,
          [fieldMap[fileType]]: file,
        };
      });

      toast.success(`${fileType} uploaded successfully`);
    });
  }, [isCorporate, setOnBoardingData]);

  const removeFile = (fileToRemove: UploadedFile) => {
    setUploadedFiles(prev => prev.filter(f => f.type !== fileToRemove.type));
    
    // Clear from onboarding data
    setOnBoardingData((prev: any) => {
      const fieldMap = {
        identity: isCorporate ? 'director_identity_cards' : 'identity_card',
        cac: 'cac_document',
        passport: isCorporate ? 'director_passport_photograph' : 'passport_photograph',
        signature: 'scanned_signature',
        nin: 'nin_document',
      };
      
      const newData = { ...prev };
      delete newData[fieldMap[fileToRemove.type]];
      return newData;
    });

    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  };

  const DropzoneComponent = ({ type, label, accept, multiple = false }: any) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (files) => onDrop(files, type),
      accept,
      maxSize: 5 * 1024 * 1024,
      multiple,
    });

    const existingFile = uploadedFiles.find(f => f.type === type);

    if (existingFile) {
      return (
        <div className="relative">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
            {existingFile.preview ? (
              <img src={existingFile.preview} alt="Preview" className="w-12 h-12 rounded object-cover" />
            ) : (
              <FileText className="w-12 h-12 text-blue-600 p-2 bg-blue-50 rounded" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{existingFile.file.name}</p>
              <p className="text-xs text-gray-500">
                {(existingFile.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <Check className="w-3 h-3" />
                Uploaded
              </div>
            </div>
            <button
              onClick={() => removeFile(existingFile)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
        <p className="text-sm font-medium text-gray-700">
          {isDragActive ? 'Drop your file here' : `Upload ${label}`}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PDF, PNG, JPG up to 5MB
        </p>
      </div>
    );
  };

  const isFormValid = () => {
    const requiredDocs = [];
    
    if (isIndividual) {
      requiredDocs.push('identity', 'passport', 'signature');
      if (requiresNIN) requiredDocs.push('nin');
    }
    
    if (isCorporate) {
      requiredDocs.push('identity', 'cac', 'passport');
    }

    return requiredDocs.every(type => 
      uploadedFiles.some(f => f.type === type)
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Document Upload</h3>
        <p className="text-sm text-gray-500">
          Upload the required documents for verification. All documents must be clear and legible.
        </p>
      </div>

      <div className="space-y-6">
        {/* Identity Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">
              1
            </span>
            {isCorporate ? "Director's Identity Card" : "Identity Card"}
            <span className="text-red-500 text-sm ml-auto">*Required</span>
          </h4>
          
          <DropzoneComponent
            type="identity"
            label="Identity Card"
            accept={{
              'application/pdf': ['.pdf'],
              'image/*': ['.png', '.jpg', '.jpeg'],
            }}
          />
        </div>

        {/* CAC Document (for corporate) */}
        {isCorporate && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs flex items-center justify-center font-bold">
                2
              </span>
              CAC Document
              <span className="text-red-500 text-sm ml-auto">*Required</span>
            </h4>
            
            <DropzoneComponent
              type="cac"
              label="CAC Document"
              accept={{
                'application/pdf': ['.pdf'],
                'image/*': ['.png', '.jpg', '.jpeg'],
              }}
            />
          </div>
        )}

        {/* Passport Photograph */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs flex items-center justify-center font-bold">
              {isCorporate ? '3' : '2'}
            </span>
            {isCorporate ? "Director's Passport Photograph" : "Passport Photograph"}
            <span className="text-red-500 text-sm ml-auto">*Required</span>
          </h4>
          
          <DropzoneComponent
            type="passport"
            label="Passport Photograph"
            accept={{
              'image/*': ['.png', '.jpg', '.jpeg'],
            }}
          />
        </div>

        {/* Scanned Signature (for individuals) */}
        {(isIndividual) && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center font-bold">
                3
              </span>
              Scanned Signature
              <span className="text-red-500 text-sm ml-auto">*Required</span>
            </h4>
            
            <DropzoneComponent
              type="signature"
              label="Scanned Signature"
              accept={{
                'application/pdf': ['.pdf'],
                'image/*': ['.png', '.jpg', '.jpeg'],
              }}
            />
          </div>
        )}

        {/* NIN Document (if applicable) */}
        {requiresNIN && (isIndividual) && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center font-bold">
                4
              </span>
              NIN Document
              <span className="text-red-500 text-sm ml-auto">*Required</span>
            </h4>
            
            <DropzoneComponent
              type="nin"
              label="NIN Document"
              accept={{
                'application/pdf': ['.pdf'],
                'image/*': ['.png', '.jpg', '.jpeg'],
              }}
            />
          </div>
        )}
      </div>

      {/* Upload Guidelines */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Upload Guidelines</h5>
        <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
          <li>Files must be in PDF, PNG, or JPG format</li>
          <li>Maximum file size: 5MB per file</li>
          <li>Documents must be clear and fully visible</li>
          <li>Passport photograph should be recent (not older than 6 months)</li>
          <li>All uploaded documents are encrypted for security</li>
        </ul>
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
          disabled={!isFormValid()}
          className={cn(
            "px-8 py-3 rounded-xl font-medium transition-all",
            isFormValid()
              ? "bg-linear-to-r from-blue-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}