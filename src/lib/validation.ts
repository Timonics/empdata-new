import { AccountType } from "@/types/onboarding.types";

export function validateOnboardingData(
  accountType: AccountType | null,
  data: any,
): boolean {
  if (!accountType || !data) {
    return false;
  }

  // Common required fields for all types
  const commonRequired = ["consent_checkbox", "selected_plan"];

  for (const field of commonRequired) {
    if (!data[field]) {
      console.log(`Missing common field: ${field}`);
      return false;
    }
  }

  if (accountType === "individual") {
    const required = [
      "first_name",
      "last_name",
      "date_of_birth",
      "nationality",
      "phone_number",
      "confirm_phone_number",
      "email_address",
      "confirm_email_address",
      "country",
      "state",
      "city",
      "house_address",
      "identity_card_type",
    ];

    for (const field of required) {
      if (!data[field]) {
        console.log(`Missing individual field: ${field}`);
        return false;
      }
    }

    // Email and phone validation
    if (data.email_address !== data.confirm_email_address) {
      console.log("Email mismatch");
      return false;
    }

    if (data.phone_number !== data.confirm_phone_number) {
      console.log("Phone mismatch");
      return false;
    }

    // Identity validation based on type
    if (data.identity_card_type === "National Identity Number") {
      if (!data.national_identification_number) {
        console.log("Missing NIN");
        return false;
      }
      if (!/^\d{11}$/.test(data.national_identification_number)) {
        console.log("Invalid NIN format - must be 11 digits");
        return false;
      }
      // Allow if verified OR pending admin review
      const isVerificationValid = 
        data.nin_verification_status === "verified" || 
        data.nin_verification_status === "pending_admin";
      
      if (!isVerificationValid) {
        console.log("NIN verification required - please verify or skip");
        return false;
      }
    } else {
      if (!data.identity_card_number) {
        console.log("Missing identity card number");
        return false;
      }
    }
  }

  if (accountType === "corporate") {
    const required = [
      "company_name",
      "rc_number",
      "phone_number",
      "confirm_phone_number",
      "email_address",
      "confirm_email_address",
      "country",
      "state",
      "city",
      "house_address",
      "director_name",
      "director_bank_name",
      "director_bank_acct_number",
      "identity_card_type",
    ];

    for (const field of required) {
      if (!data[field]) {
        console.log(`Missing corporate field: ${field}`);
        return false;
      }
    }

    // Email and phone validation
    if (data.email_address !== data.confirm_email_address) {
      console.log("Email mismatch");
      return false;
    }

    if (data.phone_number !== data.confirm_phone_number) {
      console.log("Phone mismatch");
      return false;
    }

    // Identity validation based on type
    if (data.identity_card_type === "National Identity Number") {
      if (!data.director_national_identification_number) {
        console.log("Missing director NIN");
        return false;
      }
      if (!/^\d{11}$/.test(data.director_national_identification_number)) {
        console.log("Invalid director NIN format - must be 11 digits");
        return false;
      }
      // Allow if verified OR pending admin review
      const isVerificationValid = 
        data.nin_verification_status === "verified" || 
        data.nin_verification_status === "pending_admin";
      
      if (!isVerificationValid) {
        console.log("Director NIN verification required - please verify or skip");
        return false;
      }
    } else {
      if (!data.identity_card_number) {
        console.log("Missing director identity card number");
        return false;
      }
    }

    // CAC validation
    if (!data.rc_number) {
      console.log("Missing RC number");
      return false;
    }
    // Allow if CAC verified OR pending admin review
    const isCacValid = 
      data.cac_verification_status === "verified" || 
      data.cac_verification_status === "pending_admin";
    
    if (!isCacValid) {
      console.log("CAC verification required - please verify or skip");
      return false;
    }
  }

  if (accountType === "employee-group-life") {
    const required = [
      "first_name",
      "last_name",
      "date_of_birth",
      "nationality",
      "phone_number",
      "confirm_phone_number",
      "email_address",
      "confirm_email_address",
      "country",
      "state",
      "city",
      "house_address",
      "identity_card_type",
    ];

    for (const field of required) {
      if (!data[field]) {
        console.log(`Missing employee field: ${field}`);
        return false;
      }
    }

    // Email and phone validation
    if (data.email_address !== data.confirm_email_address) {
      console.log("Email mismatch");
      return false;
    }

    if (data.phone_number !== data.confirm_phone_number) {
      console.log("Phone mismatch");
      return false;
    }

    // Identity validation based on type
    if (data.identity_card_type === "National Identity Number") {
      if (!data.national_identification_number) {
        console.log("Missing employee NIN");
        return false;
      }
      if (!/^\d{11}$/.test(data.national_identification_number)) {
        console.log("Invalid employee NIN format - must be 11 digits");
        return false;
      }
      const isVerificationValid = 
        data.nin_verification_status === "verified" || 
        data.nin_verification_status === "pending_admin";
      
      if (!isVerificationValid) {
        console.log("Employee NIN verification required - please verify or skip");
        return false;
      }
    } else {
      if (!data.identity_card_number) {
        console.log("Missing employee identity card number");
        return false;
      }
    }
  }

  return true;
}

export function validateFiles(accountType: string, data: any): string[] {
  const errors: string[] = [];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
  const allowedDocTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (accountType === "individual") {
    if (!data.identity_card) {
      errors.push("Identity card is required");
    } else if (data.identity_card.size > maxSize) {
      errors.push("Identity card must be less than 5MB");
    } else if (!allowedDocTypes.includes(data.identity_card.type)) {
      errors.push("Identity card must be PDF, JPG, or PNG");
    }

    if (!data.scanned_signature) {
      errors.push("Scanned signature is required");
    } else if (data.scanned_signature.size > maxSize) {
      errors.push("Scanned signature must be less than 5MB");
    } else if (!allowedDocTypes.includes(data.scanned_signature.type)) {
      errors.push("Scanned signature must be PDF, JPG, or PNG");
    }

    if (!data.passport_photograph) {
      errors.push("Passport photograph is required");
    } else if (data.passport_photograph.size > maxSize) {
      errors.push("Passport photograph must be less than 5MB");
    } else if (!allowedImageTypes.includes(data.passport_photograph.type)) {
      errors.push("Passport photograph must be JPG or PNG");
    }

    if (
      data.identity_card_type === "National Identity Number" &&
      !data.nin_document
    ) {
      errors.push("NIN document is required");
    }
  }

  if (accountType === "corporate") {
    if (!data.director_identity_cards) {
      errors.push("Director's identity card is required");
    } else if (data.director_identity_cards.size > maxSize) {
      errors.push("Director's identity card must be less than 5MB");
    } else if (!allowedDocTypes.includes(data.director_identity_cards.type)) {
      errors.push("Director's identity card must be PDF, JPG, or PNG");
    }

    if (!data.cac_document) {
      errors.push("CAC document is required");
    } else if (data.cac_document.size > maxSize) {
      errors.push("CAC document must be less than 5MB");
    } else if (!allowedDocTypes.includes(data.cac_document.type)) {
      errors.push("CAC document must be PDF, JPG, or PNG");
    }

    if (!data.director_passport_photograph) {
      errors.push("Director's passport photograph is required");
    } else if (data.director_passport_photograph.size > maxSize) {
      errors.push("Director's passport photograph must be less than 5MB");
    } else if (
      !allowedImageTypes.includes(data.director_passport_photograph.type)
    ) {
      errors.push("Director's passport photograph must be JPG or PNG");
    }
  }

  if (accountType === "employee-group-life") {
    if (!data.identity_card) {
      errors.push("Identity card is required");
    } else if (data.identity_card.size > maxSize) {
      errors.push("Identity card must be less than 5MB");
    } else if (!allowedDocTypes.includes(data.identity_card.type)) {
      errors.push("Identity card must be PDF, JPG, or PNG");
    }

    if (!data.scanned_signature) {
      errors.push("Scanned signature is required");
    } else if (data.scanned_signature.size > maxSize) {
      errors.push("Scanned signature must be less than 5MB");
    } else if (!allowedDocTypes.includes(data.scanned_signature.type)) {
      errors.push("Scanned signature must be PDF, JPG, or PNG");
    }

    if (!data.passport_photograph) {
      errors.push("Passport photograph is required");
    } else if (data.passport_photograph.size > maxSize) {
      errors.push("Passport photograph must be less than 5MB");
    } else if (!allowedImageTypes.includes(data.passport_photograph.type)) {
      errors.push("Passport photograph must be JPG or PNG");
    }

    if (
      data.identity_card_type === "National Identity Number" &&
      !data.nin_document
    ) {
      errors.push("NIN document is required");
    }
  }

  return errors;
}