import {
  IndividualOnboardingData,
  CompanyGroupLifeOnboardingData,
  EmployeeGroupLifeOnboardingData,
} from "@/types/onboarding.types";

export function buildFormData(
  data:
    | IndividualOnboardingData
    | CompanyGroupLifeOnboardingData
    | EmployeeGroupLifeOnboardingData,
  accountType: string,
): FormData {
  const formData = new FormData();

  // Add all non-file fields
  Object.entries(data).forEach(([key, value]) => {
    // Skip files (handled separately) and undefined/null values
    if (
      value === undefined ||
      value === null ||
      value instanceof File ||
      (key === "beneficiaries" && Array.isArray(value))
    ) {
      return;
    }

    // Handle booleans
    if (typeof value === "boolean") {
      formData.append(key, value ? "true" : "false");
      return;
    }

    // Handle dates
    if (value instanceof Date) {
      formData.append(key, value.toISOString());
      return;
    }

    // Handle everything else
    formData.append(key, String(value));
  });

  // Handle files based on account type
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

  if (accountType === "corporate" || accountType === "employee-group-life") {
    const companyData = data as
      | CompanyGroupLifeOnboardingData
      | EmployeeGroupLifeOnboardingData;

    if (
      "director_identity_cards" in companyData &&
      companyData.director_identity_cards instanceof File
    ) {
      formData.append(
        "director_identity_cards",
        companyData.director_identity_cards,
      );
    }
    if (
      "cac_document" in companyData &&
      companyData.cac_document instanceof File
    ) {
      formData.append("cac_document", companyData.cac_document);
    }
    if (
      "director_passport_photograph" in companyData &&
      companyData.director_passport_photograph instanceof File
    ) {
      formData.append(
        "director_passport_photograph",
        companyData.director_passport_photograph,
      );
    }
  }

  // Handle beneficiaries for employee group life
  if (accountType === "employee-group-life") {
    const employeeData = data as EmployeeGroupLifeOnboardingData;
    if (employeeData.beneficiaries && employeeData.beneficiaries.length > 0) {
      // Send beneficiaries as JSON string
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

      // Add beneficiary files
      employeeData.beneficiaries.forEach((beneficiary, index) => {
        if (beneficiary.utility_bill instanceof File) {
          formData.append(
            `beneficiary_${index}_utility_bill`,
            beneficiary.utility_bill,
          );
        }
        if (beneficiary.identification_document instanceof File) {
          formData.append(
            `beneficiary_${index}_identification`,
            beneficiary.identification_document,
          );
        }
      });
    }
  }

  return formData;
}
