// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// queries & backend
import { backend } from "../backend";
import { processError } from "../commons";

export interface IConnectResult { }

export interface IChartItem {
  date: string;
  data?: number | string;
  value?: number | string;
  transparent?: boolean;
  // label?: string
}
export interface IOsAnalyticsItem {
  uuid: string;
  name: string;
  value: number | string | IChartItem[];
  type: string;

  unit?: string;
  rate?: number | string;
  progress?: number;
  target?: number | string;

  info?: string;

  label?: string;
  display?: boolean;

  info_data?: any;

  chart?: boolean;

  // users: number;
  // customers: number;
  // customers_with_subscription: number;
  // customers_with_subscription_above_400: number;
  // visitors: number;
  // desks: number;
  // expected_revenue_this_month: number;
  // global_revenue_by_months: any;
  // average_revenue_per_customer_per_month: number;
  // occupancy: number;
  // revenue_per_desk: number;
  // average_cost_per_member: number;
  // monthly_cost: number;
  // leads_and_conversion_rate: number;
}

async function getTransactions(
  office_uuid: string,
  recurring?: boolean
): Promise<any[]> {
  // if (!office_uuid) {
  //   throw "office_uuid should not be empty in getTransactions()";
  // }
  try {
    const resp = await backend.get(
      `/analytics/transaction?${office_uuid ? `office_uuid=${office_uuid}&` : ""}${recurring ? `recurring=true` : ""}`,
      {}
    );
    const data = resp.data;
    let result = data?.data?.transactions;

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useRecurringTransactions(office_uuid: string, recurring?: boolean) {
  return useQuery<any[], Error>(
    ["appsOsAnalyticsTransactions2", office_uuid],
    () => getRecurringTransactions(office_uuid, recurring),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getRecurringTransactions(office_uuid: string, recurring?: boolean): Promise<any[]> {
  // if (!office_uuid) {
  //   throw "office_uuid should not be empty in getRecurringTransactions()";
  // }
  try {
    const resp = await backend.get(`/analytics/transaction?${office_uuid ? `office_uuid=${office_uuid}&` : ""}${recurring ? `recurring=true` : ""}`, {});
    const data = resp.data;
    let result = data?.data?.transactions;

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useTransactions(office_uuid: string, recurring?: boolean) {
  return useQuery<any[], Error>(
    ["appsOsAnalyticsTransactions", office_uuid],
    () => getTransactions(office_uuid, recurring),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IOsAnalyticsGetParams {
  office_uuid?: string,
  date?: string,
  uuid?: string,
}

async function getOsAnalytics(
  params: IOsAnalyticsGetParams
): Promise<IOsAnalyticsItem[]> {
  try {
    const resp = await backend.get(
      `/analytics`,
      {
        params: {
          ...(params.office_uuid ? { office_uuid: params.office_uuid } : {}),
          ...(params.uuid ? { uuid: params.uuid } : {}),
          ...(params.date ? { dete: params.date } : {})
        }
      }
    );
    const data = resp.data;
    let result = data?.data;
    // result = result.sort((a: any, b: any) => (a.type < b.type ? -1 : 1));

    // return [
    //   {
    //     "uuid": "a9e04d15-0abe-4b67-b4c3-5b1d3ca136c1",
    //     "name": "Users",
    //     "value": 11,
    //     "type": "number"
    //   },
    //   {
    //     "uuid": "cdd3e3b6-e684-4cea-8000-1ce5fadb3bc2",
    //     "name": "Customers",
    //     "value": 32,
    //     "type": "number"
    //   },
    //   {
    //     "uuid": "b4af3c23-ced7-4b70-b0a1-141938221a7c",
    //     "name": "Customers with subscription",
    //     "value": 20,
    //     "type": "number"
    //   },
    //   {
    //     "uuid": "4447eda9-fa24-4bf2-808f-be5b183023a3",
    //     "name": "Customers with subscription above 400",
    //     "value": 3,
    //     "type": "number"
    //   },
    //   {
    //     "uuid": "bd05d602-8382-4dc5-8fdc-6fa63775ee85",
    //     "name": "Visitors",
    //     "value": 7,
    //     "type": "number"
    //   },
    //   {
    //     "uuid": "c2c59190-6bc4-40cf-9fc3-34b54e3832db",
    //     "name": "Desks",
    //     "value": 120,
    //     "type": "number"
    //   },
    //   {
    //     "uuid": "7e402800-39d4-4e8b-a06a-c0da2c535574",
    //     "name": "Expected revenue this month",
    //     "value": 5421.0,
    //     "type": "number"
    //   },
    //   {
    //     "uuid": "ae888834-61d4-4ffc-9582-f74685050362",
    //     "name": "Global revenue by months",
    //     "value": [
    //       {
    //         "date": "2022-01-01",
    //         "data": 0
    //       },
    //       {
    //         "date": "2022-02-01",
    //         "data": 0
    //       },
    //       {
    //         "date": "2022-03-01",
    //         "data": 0
    //       },
    //       {
    //         "date": "2022-04-01",
    //         "data": 0
    //       },
    //       {
    //         "date": "2022-05-01",
    //         "data": 0
    //       },
    //       {
    //         "date": "2022-06-01",
    //         "data": 0
    //       },
    //       {
    //         "date": "2022-07-01",
    //         "data": 52521
    //       },
    //       {
    //         "date": "2022-08-01",
    //         "data": 694484
    //       },
    //       {
    //         "date": "2022-09-01",
    //         "data": 520193
    //       },
    //       {
    //         "date": "2022-10-01",
    //         "data": 340647
    //       },
    //       {
    //         "date": "2022-11-01",
    //         "data": 1461808
    //       },
    //       {
    //         "date": "2022-12-01",
    //         "data": 0
    //       }
    //     ],
    //     "type": "bar_chart"
    //   },
    //   {
    //     "uuid": "bd38b16b-f183-40e5-bd66-72a70acd9dcb",
    //     "name": "Average revenue per customer per month",
    //     "value": 0,
    //     "type": "number"
    //   },
    //   {
    //     "uuid": "39ef228f-1318-41a1-a896-9151ae82622b",
    //     "name": "Occupancy",
    //     "value": 800.0,
    //     "type": "number"
    //   },
    //   {
    //     "uuid": "61c2c358-d5aa-4623-ab72-81aaae246e44",
    //     "name": "Revenue per desk",
    //     "value": 0.008333333333333333,
    //     "type": "number"
    //   },
    //   {
    //     "uuid": "ada163ce-3df0-4a88-9989-665cbd2e2957",
    //     "name": "Average cost per member",
    //     "value": 90.91,
    //     "type": "number"
    //   },
    //   {
    //     "uuid": "f6aff5b6-ecae-4b1e-9755-9bab4e68834c",
    //     "name": "Monthly cost",
    //     "value": 0,
    //     "type": "number"
    //   },
    //   {
    //     "uuid": "388cc212-f40d-44b2-94b4-5c145baa7b48",
    //     "name": "Leads and conversion rate",
    //     "value": 0,
    //     "type": "number"
    //   }
    // ]
    // [
    //   {
    //     uuid: "12",
    //     name: 'Sales',
    //     value: '12,699',
    //     progress: 15.9,
    //     target: '80,000',
    //     rate: '-13.2',
    //     unit: "%",
    //     type: "number"
    //   },
    //   {
    //     uuid: "13",
    //     name: 'Profit',
    //     value: '45,564',
    //     unit: "",
    //     type: "number"
    //   },
    //   {
    //     uuid: "14",
    //     name: 'Customers',
    //     value: '1,072',
    //     progress: 53.6,
    //     target: '2,000',
    //     rate: '10.1',
    //     unit: "€",
    //     type: "number"
    //   },
    //   {
    //     uuid: "12",
    //     name: 'Sales',
    //     value: '12,699',
    //     progress: 15.9,
    //     target: '80,000',
    //     rate: '-13.2',
    //     unit: "%",
    //     type: "number"
    //   },
    //   {
    //     uuid: "13",
    //     name: 'Profit',
    //     value: '45,564',
    //     unit: "",
    //     type: "number"
    //   },
    //   {
    //     uuid: "14",
    //     name: 'Customers',
    //     value: '1,072',
    //     progress: 53.6,
    //     target: '2,000',
    //     rate: '10.1',
    //     unit: "€",
    //     type: "number"
    //   },
    //   {
    //     uuid: "12",
    //     name: 'Sales',
    //     value: '12,699',
    //     progress: 15.9,
    //     target: '80,000',
    //     rate: '-13.2',
    //     unit: "%",
    //     type: "number"
    //   },
    //   {
    //     uuid: "13",
    //     name: 'Profit',
    //     value: '45,564',
    //     unit: "",
    //     type: "number"
    //   },
    //   {
    //     uuid: "14",
    //     name: 'Customers',
    //     value: '1,072',
    //     progress: 53.6,
    //     target: '2,000',
    //     rate: '10.1',
    //     unit: "€",
    //     type: "number"
    //   },
    //   {
    //     uuid: "12",
    //     name: 'Sales',
    //     value: '12,699',
    //     progress: 15.9,
    //     target: '80,000',
    //     rate: '-13.2',
    //     unit: "%",
    //     type: "number"
    //   },
    //   {
    //     uuid: "13",
    //     name: 'Profit',
    //     value: '45,564',
    //     unit: "",
    //     type: "number"
    //   },
    //   {
    //     uuid: "14",
    //     name: 'Customers',
    //     value: '1,072',
    //     progress: 53.6,
    //     target: '2,000',
    //     rate: '10.1',
    //     unit: "€",
    //     type: "number"
    //   },
    // ];

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useOsAnalytics(params: IOsAnalyticsGetParams) {
  return useQuery<IOsAnalyticsItem[], Error>(
    ["appsOsAnalytics", params.office_uuid, params.date, params.uuid],
    () => getOsAnalytics(params),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export function useOsAnalyticsMutation() {
  const queryClient = useQueryClient();
  return useMutation<IOsAnalyticsItem[], Error, IOsAnalyticsGetParams>(
    getOsAnalytics,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["appsOsAnalytic", variables.office_uuid, variables.uuid, variables.date]);
      },
    }
  );
}

async function connect(): Promise<IConnectResult> {
  try {
    const data = {};
    const response = await backend.put(`/analytics/activate`, data, {});
    const result = response.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useConnect() {
  const queryClient = useQueryClient();
  return useMutation<IConnectResult, Error, void>(connect, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["apps"]);
    },
  });
}

async function disconnect(): Promise<void> {
  try {
    const result = await backend.delete(`/analytics/activate`, {});
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDisconnect() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>(disconnect, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["apps"]);
    },
  });
}

export interface IOsAnalyticsUpdateParams {
  name: string;
}
export interface IOsAnalyticsUpdateResult { }

async function updateOsAnalyticsCard(
  params: IOsAnalyticsUpdateParams
): Promise<IOsAnalyticsUpdateResult> {
  try {
    const data = params;

    const result = await backend.put(
      `/os-analytics/${params.name}`, ////////!!!!!!!!
      data,
      {}
    );
    return result.data?.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpdateOsAnalyticsCard() {
  const queryClient = useQueryClient();
  return useMutation<IOsAnalyticsUpdateResult, Error, IOsAnalyticsUpdateParams>(
    updateOsAnalyticsCard,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["appsOsAnalytics", variables.name]); ////////!!!!!!!!
      },
    }
  );
}

async function upsertTransaction(params: any): Promise<any> {
  try {
    const data = params;

    if (!params.uuid) {
      const result = await backend.post(
        `/analytics/transaction`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return { finalResult };
    } else {
      const result = await backend.put(
        `/analytics/transaction`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return { finalResult };
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpsertTransaction() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>(upsertTransaction, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["appsOsAnalyticsTransactions", office_uuid]);
      queryClient.invalidateQueries(["appsOsAnalyticsTransactions2", office_uuid]);
    },
  });
}

export interface ITransactionDeleteParams {
  uuids: string[];
}

async function deleteTransaction(params: ITransactionDeleteParams): Promise<void> {
  try {
    const data = params;
    const result = await backend.delete(
      `/analytics/transaction`,
      { data: params }
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, ITransactionDeleteParams>(deleteTransaction, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["appsOsAnalyticsTransactions"]);
      queryClient.invalidateQueries(["appsOsAnalyticsTransactions2"]);
    },
  });
}

export interface ISettingsOSAnalytics {
  office_uuid?: string;
  cost_per_month: number;
  additional_desks: number;
  additional_rented_desks: number;
  additional_customers: number;
  additional_revenue_per_month: number;
}

async function getOSAnalyticsSettings(
  office_uuid?: string
): Promise<ISettingsOSAnalytics> {
  try {
    const resp = await backend.get(
      `/analytics/settings?office_uuid=${office_uuid}`,
      {}
    );
    const data = resp.data;
    let result = data?.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useOSAnalyticsSettings(office_uuid?: string) {
  return useQuery<ISettingsOSAnalytics, Error>(
    ["oSAnalyticsSettings", office_uuid],
    () => getOSAnalyticsSettings(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function oSAnalyticsSettingsUpdate(
  params: ISettingsOSAnalytics
): Promise<ISettingsOSAnalytics> {
  try {
    const data = params;

    const response = await backend.put(`/analytics/settings`, data, {});
    const result = response.data.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useOSAnalyticsSettingsUpdate() {
  const queryClient = useQueryClient();
  return useMutation<ISettingsOSAnalytics, Error, ISettingsOSAnalytics>(
    oSAnalyticsSettingsUpdate,
    {
      onSuccess: (_, variables) => {
        const office_uuid = variables.office_uuid;
        queryClient.invalidateQueries(["oSAnalyticsSettings", office_uuid]);
      },
    }
  );
}

export interface IMetricChartGetParams {
  office_uuid?: string,
  metric_uuid: string
}

async function getOsAnalyticsMetricChart(params: IMetricChartGetParams): Promise<IChartItem[]> {
  try {
    const resp = await backend.get(`/analytics/history?${params.office_uuid ? `office_uuid=${params.office_uuid}&` : ""}metric_uuid=${params.metric_uuid}`, {});
    const data = resp.data;
    let result = data?.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useOsAnalyticsMetricChart(params: IMetricChartGetParams) {
  return useQuery<IChartItem[], Error>(
    ["osAnalyticsMetricChart", params.office_uuid, params.metric_uuid],
    () => getOsAnalyticsMetricChart(params),
    {
      refetchOnWindowFocus: false,
    }
  );
}

// export function useOsAnalyticsMetricChartMutation(params: IMetricChartGetParams) {
//   const queryClient = useQueryClient();
//   return useMutation<IChartItem[], Error, IMetricChartGetParams>(
//     getOsAnalyticsMetricChart,
//     {
//       onSuccess: (_, variables) => {
//         const office_uuid = variables.office_uuid;
//         const metric_uuid = variables.metric_uuid;
//         queryClient.invalidateQueries(["osAnalyticsMetricChart", office_uuid, metric_uuid]);
//       },
//     }
//   );
// }