export const fetchCampaigns = async () => {
  const response = await fetch("/api/campaign");
  if (!response.ok) {
    throw new Error("Failed to fetch campaigns");
  }
  return response.json();
};
export const fetchMedicines = async ({
  page,
  limit,
  search,
  stockStatus,
}: {
  page?: number;
  limit?: string;
  search?: string;
  stockStatus?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit);
  if (search) queryParams.append("search", search);
  if (stockStatus) queryParams.append("stockStatus", stockStatus);

  const response = await fetch(`/api/medicine?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch medicines");
  }
  return response.json();
};

export const fetchTreatments = async ({
  page,
  limit,
  search,
  status,
}: {
  page?: number;
  limit?: string;
  search?: string;
  status?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit);
  if (search) queryParams.append("search", search);
  if (status) queryParams.append("status", status);

  const response = await fetch(`/api/treatment?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch treatments");
  }
  return response.json();
};

export const fetchPatients = async ({
  gender,
  dateRange,
  sort,
  page,
  limit,
  search,
}: {
  gender?: string;
  dateRange?: string;
  sort?: "newest" | "oldest";
  page?: number;
  limit?: string;
  search?: string;
}) => {
  try {
    const url = new URL("/api/patient", window.location.origin);

    // Add query parameters to the URL
    if (gender) url.searchParams.append("gender", gender);
    if (dateRange) url.searchParams.append("dateRange", dateRange);
    if (sort) url.searchParams.append("sort", sort);
    if (page) url.searchParams.append("page", page.toString());
    if (limit) url.searchParams.append("limit", limit);
    if (search) url.searchParams.append("search", search);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("Failed to fetch patients");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
};

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return date.toLocaleDateString("en-GB", options);
}

export const fetchPatientById = async (id: string) => {
  try {
    // Construct the URL using the patient ID
    const url = new URL(`/api/patient/${id}`, window.location.origin);

    // Fetch the patient data
    const response = await fetch(url.toString());

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Failed to fetch patient");
    }

    // Parse the JSON response
    return response.json();
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw error;
  }
};

export function formatDateString(dateStr: string): string {
  const date = new Date(dateStr);

  const day = date.getUTCDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getUTCFullYear();

  // Determine the ordinal suffix
  const ordinalSuffix = (n: number) => {
    if (n > 3 && n < 21) return "th"; // Handle 11th, 12th, 13th
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${ordinalSuffix(day)} ${month}, ${year}`;
}

export function formatTimeString(dateStr: string): string {
  const date = new Date(dateStr);
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12; // Convert to 12-hour format
  hours = hours ? hours : 12; // The hour '0' should be '12'

  // Pad minutes with leading zero if necessary
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${formattedMinutes} ${ampm}`;
}
