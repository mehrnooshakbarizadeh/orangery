// external dependencies
// import { AnyPointerEvent } from "framer-motion/types/gestures/PanSession";
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
// import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";
// import { processError } from "./commons";

export interface IReportItem {
  date: string;
  columns: number[];
}

export interface IReports {
  uuid?: string;
  items: IReportItem[];
  titles: string[];
}

async function getReports(office_uuid: string): Promise<IReports> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getReports()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/report`, {});
    const data = resp.data;
    return data.data;
  } catch (err: any) {
    throw err;
  }
}

export function useReports(reports_uuid: string) {
  return useQuery<IReports, Error>(
    ["reports", reports_uuid],
    () => getReports(reports_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getAllReports(office_uuid: string): Promise<IReports> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getAllReports()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/report/all`, {});
    const data = resp.data;
    return data.data;
  } catch (err: any) {
    throw err;
  }
}

export function useAllReports(reports_uuid: string) {
  return useQuery<IReports, Error>(
    ["allReports", reports_uuid],
    () => getAllReports(reports_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IPercentageReport {
  value: number;
  total?: number;
  percentage: string;
}

export interface IFinancialReports {
  uuid?: string;
  current_month: IPercentageReport;
  previous_month: IPercentageReport;
  last_three_months: IPercentageReport;
  total_sales: number;
}

async function getFinancialReports(
  office_uuid: string
): Promise<IFinancialReports> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getFinancialReports()";
  }
  try {
    const resp = await backend.get(
      `/office/${office_uuid}/report/financial`,
      {}
    );
    const data = resp.data;
    return data.data.financialReports;
  } catch (err: any) {
    throw err;
  }
}

export function useFinancialReports(financialReports_uuid: string) {
  return useQuery<IFinancialReports, Error>(
    ["financialReports", financialReports_uuid],
    () => getFinancialReports(financialReports_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IOverviewReports {
  users: IPercentageReport;
  customers: IPercentageReport;
  visitors: IPercentageReport;
  booked_meeting_rooms: IPercentageReport;
  booked_parking_spots: IPercentageReport;
  occupancy: number;
  total_assets: number;
  assets_in_use: number;
  total_desks: number;
  free_desks: number;
}

export interface IOverviewReportsGetParams {
  office_uuid: string
}

async function getOverviewReports(params: IOverviewReportsGetParams): Promise<IOverviewReports> {
  if (!params.office_uuid) {
    throw "office_uuid should not be empty in getOverviewReports()";
  }
  try {
    const resp = await backend.get(
      `/office/${params.office_uuid}/report/overview`,
      {}
    );
    const data = resp.data;

    // return {
    //   "users": {
    //     "value": 4,
    //     "percentage": "40000.0"
    //   },
    //   "customers": {
    //     "value": 3,
    //     "percentage": "30000.0"
    //   },
    //   "visitors": {
    //     "value": 0,
    //     "percentage": "0.0"
    //   },
    //   "booked_meeting_rooms": {
    //     "value": 1,
    //     "percentage": "10000.0"
    //   },
    //   "booked_parking_spots": {
    //     "value": 0,
    //     "percentage": "0.0"
    //   },
    //   "occupancy": 1,
    //   "total_assets": 0,
    //   "assets_in_use": 0,
    //   "total_desks": 3,
    //   "free_desks": 2
    // }

    return data.data;
  } catch (err: any) {
    // return {
    //   "users": {
    //     "value": 4,
    //     "percentage": "40000.0"
    //   },
    //   "customers": {
    //     "value": 3,
    //     "percentage": "30000.0"
    //   },
    //   "visitors": {
    //     "value": 0,
    //     "percentage": "0.0"
    //   },
    //   "booked_meeting_rooms": {
    //     "value": 1,
    //     "percentage": "10000.0"
    //   },
    //   "booked_parking_spots": {
    //     "value": 0,
    //     "percentage": "0.0"
    //   },
    //   "occupancy": 1,
    //   "total_assets": 0,
    //   "assets_in_use": 0,
    //   "total_desks": 3,
    //   "free_desks": 2
    // }

    throw err;
  }
}

export function useOverviewReports(params: IOverviewReportsGetParams) {
  return useQuery<IOverviewReports, Error>(
    ["overviewReports", params.office_uuid],
    () => getOverviewReports(params),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export function useOverviewReportsMutation() {
  const queryClient = useQueryClient();
  return useMutation<IOverviewReports, Error, IOverviewReportsGetParams>(
    getOverviewReports,
    {
      onSuccess: (_, variables) => {
        const office_uuid = variables.office_uuid
        queryClient.invalidateQueries(["overviewReports", office_uuid]);
      },
    }
  );
}