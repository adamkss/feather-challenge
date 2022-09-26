export type TInsuranceType = "LIABILITY" | "HOUSEHOLD" | "HEALTH";

export type TPolicyStatus = "ACTIVE" | "PENDING" | "CANCELLED" | "DROPPED_OUT";

export type TCustomer = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
};

export type TPolicy = {
  id: string;
  provider: string;
  insuranceType: TInsuranceType;
  status: TPolicyStatus;
  startDate: string;
  endDate: string | null;
  customer: TCustomer;
};
