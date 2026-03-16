import {
  IndividualOnboardingData,
  CompanyGroupLifeOnboardingData,
  EmployeeGroupLifeOnboardingData,
} from "@/types/onboarding.types";

// File validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(
  file: File,
  type: "image" | "document",
): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `${file.name} exceeds 5MB limit`,
    };
  }

  // Check file type
  const allowedTypes =
    type === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_DOCUMENT_TYPES;
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `${file.name} has invalid file type. Allowed: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}

export function validateAllFiles(
  data: any,
  accountType: string,
): FileValidationResult[] {
  const errors: FileValidationResult[] = [];

  if (accountType === "individual") {
    const individualData = data as IndividualOnboardingData;

    if (individualData.identity_card instanceof File) {
      const result = validateFile(individualData.identity_card, "document");
      if (!result.valid) errors.push(result);
    }
    if (individualData.scanned_signature instanceof File) {
      const result = validateFile(individualData.scanned_signature, "document");
      if (!result.valid) errors.push(result);
    }
    if (individualData.passport_photograph instanceof File) {
      const result = validateFile(individualData.passport_photograph, "image");
      if (!result.valid) errors.push(result);
    }
    if (individualData.nin_document instanceof File) {
      const result = validateFile(individualData.nin_document, "document");
      if (!result.valid) errors.push(result);
    }
  }

  if (accountType === "corporate") {
    const companyData = data as CompanyGroupLifeOnboardingData;

    // Validate multiple director identity cards
    if (companyData.director_identity_cards) {
      const files = Array.isArray(companyData.director_identity_cards)
        ? companyData.director_identity_cards
        : [companyData.director_identity_cards];

      files.forEach((file, index) => {
        if (file instanceof File) {
          const result = validateFile(file, "document");
          if (!result.valid) {
            errors.push({
              ...result,
              error: `Director ID card ${index + 1}: ${result.error}`,
            });
          }
        }
      });
    }

    if (companyData.cac_document instanceof File) {
      const result = validateFile(companyData.cac_document, "document");
      if (!result.valid) errors.push(result);
    }

    if (companyData.director_passport_photograph instanceof File) {
      const result = validateFile(
        companyData.director_passport_photograph,
        "image",
      );
      if (!result.valid) errors.push(result);
    }
  }

  if (accountType === "employee-group-life") {
    const employeeData = data as EmployeeGroupLifeOnboardingData;

    // Employee documents
    if (employeeData.identity_card instanceof File) {
      const result = validateFile(employeeData.identity_card, "document");
      if (!result.valid) errors.push(result);
    }
    if (employeeData.scanned_signature instanceof File) {
      const result = validateFile(employeeData.scanned_signature, "document");
      if (!result.valid) errors.push(result);
    }
    if (employeeData.passport_photograph instanceof File) {
      const result = validateFile(employeeData.passport_photograph, "image");
      if (!result.valid) errors.push(result);
    }
    if (employeeData.nin_document instanceof File) {
      const result = validateFile(employeeData.nin_document, "document");
      if (!result.valid) errors.push(result);
    }

    // Beneficiary documents
    if (employeeData.beneficiaries) {
      employeeData.beneficiaries.forEach((beneficiary, bIndex) => {
        if (beneficiary.utility_bill instanceof File) {
          const result = validateFile(beneficiary.utility_bill, "document");
          if (!result.valid) {
            errors.push({
              ...result,
              error: `Beneficiary ${bIndex + 1} utility bill: ${result.error}`,
            });
          }
        }
        if (beneficiary.identification_document instanceof File) {
          const result = validateFile(
            beneficiary.identification_document,
            "document",
          );
          if (!result.valid) {
            errors.push({
              ...result,
              error: `Beneficiary ${bIndex + 1} ID: ${result.error}`,
            });
          }
        }
      });
    }
  }

  return errors;
}

export function buildFormData(
  data:
    | IndividualOnboardingData
    | CompanyGroupLifeOnboardingData
    | EmployeeGroupLifeOnboardingData,
  accountType: string,
): FormData {
  const formData = new FormData();

  // First validate all files
  const fileErrors = validateAllFiles(data, accountType);
  if (fileErrors.length > 0) {
    throw new Error(fileErrors.map((e) => e.error).join("\n"));
  }

  // Add all non-file fields
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File) return; // Skip files, handled separately
    if (key === "beneficiaries" && Array.isArray(value)) return; // Skip beneficiaries, handled separately

    // Handle booleans
    if (typeof value === "boolean") {
      formData.append(key, value ? "1" : "0");
      return;
    }

    // Handle dates
    if (value instanceof Date) {
      formData.append(key, value.toISOString().split("T")[0]);
      return;
    }

    // Handle objects (encrypted data)
    if (typeof value === "object" && !Array.isArray(value)) {
      Object.entries(value).forEach(([objKey, objValue]) => {
        if (objValue !== undefined && objValue !== null) {
          formData.append(`${key}_${objKey}`, String(objValue));
        }
      });
      return;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object") {
          formData.append(`${key}[${index}]`, JSON.stringify(item));
        } else {
          formData.append(`${key}[${index}]`, String(item));
        }
      });
      return;
    }

    formData.append(key, String(value));
  });

  // Handle files with proper field names
  if (accountType === "individual") {
    const individualData = data as IndividualOnboardingData;

    if (individualData.identity_card instanceof File) {
      formData.append("identity_card", individualData.identity_card);
    }
    if (individualData.scanned_signature instanceof File) {
      formData.append("scanned_signature", individualData.scanned_signature);
    }
    if (individualData.passport_photograph instanceof File) {
      formData.append(
        "passport_photograph",
        individualData.passport_photograph,
      );
    }
    if (individualData.nin_document instanceof File) {
      formData.append("nin_document", individualData.nin_document);
    }
  }

  if (accountType === "corporate") {
    const companyData = data as CompanyGroupLifeOnboardingData;

    // Handle multiple director identity cards
    if (companyData.director_identity_cards) {
      const files = Array.isArray(companyData.director_identity_cards)
        ? companyData.director_identity_cards
        : [companyData.director_identity_cards];

      files.forEach((file) => {
        if (file instanceof File) {
          formData.append("director_identity_cards[]", file);
        }
      });
    }

    if (companyData.cac_document instanceof File) {
      formData.append("cac_document", companyData.cac_document);
    }

    if (companyData.director_passport_photograph instanceof File) {
      formData.append(
        "director_passport_photograph",
        companyData.director_passport_photograph,
      );
    }
  }

  if (accountType === "employee-group-life") {
    const employeeData = data as EmployeeGroupLifeOnboardingData;

    // Employee documents
    if (employeeData.identity_card instanceof File) {
      formData.append("identity_card", employeeData.identity_card);
    }
    if (employeeData.scanned_signature instanceof File) {
      formData.append("scanned_signature", employeeData.scanned_signature);
    }
    if (employeeData.passport_photograph instanceof File) {
      formData.append("passport_photograph", employeeData.passport_photograph);
    }
    if (employeeData.nin_document instanceof File) {
      formData.append("nin_document", employeeData.nin_document);
    }

    // Handle beneficiaries
    if (employeeData.beneficiaries && employeeData.beneficiaries.length > 0) {
      // Send beneficiaries metadata as JSON
      formData.append(
        "beneficiaries",
        JSON.stringify(
          employeeData.beneficiaries.map((b) => ({
            first_name: b.first_name,
            last_name: b.last_name,
            address: b.address,
            date_of_birth: b.date_of_birth,
            percentage_allocation: b.percentage_allocation,
          })),
        ),
      );

      // Add beneficiary files with proper field names
      employeeData.beneficiaries.forEach((beneficiary, index) => {
        if (beneficiary.utility_bill instanceof File) {
          formData.append(
            `beneficiaries[${index}][utility_bill]`,
            beneficiary.utility_bill,
          );
        }
        if (beneficiary.identification_document instanceof File) {
          formData.append(
            `beneficiaries[${index}][identification_document]`,
            beneficiary.identification_document,
          );
        }
      });
    }
  }

  // Log FormData contents for debugging (remove in production)
  if (process.env.NODE_ENV === "development") {
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(
          pair[0],
          "(File):",
          (pair[1] as File).name,
          (pair[1] as File).type,
        );
      } else {
        console.log(pair[0], ":", pair[1]);
      }
    }
  }

  return formData;
}
