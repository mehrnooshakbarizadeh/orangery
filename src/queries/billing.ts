// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";
import { OrangeryToast } from "../components/OrangeryElements";

// queries & backend
import { backend } from "./backend";
import { processError } from "./commons";

export interface IInvocieResult {
}

export interface IInvoiceParams {
  office_uuid?: string;

  billing_date: Date;

  customer_uuid: string;

  product_uuid?: string;

  billing_name?: string;
  billing_price?: number;
  discount?: number;
  tax?: number;
}

async function insertInvoice(
  params: IInvoiceParams
): Promise<IBillingResult> {
  try {
    const data = {
      billing_date: params.billing_date,

      customer_uuid: params.customer_uuid,

      product_uuid: params.product_uuid,

      billing_name: params.billing_name,
      billing_price: params.billing_price,
      discount: params.discount,
      tax: params.tax,
    };
    const response = await backend.post(
      `billing/office/${params.office_uuid}/create-billing`,
      data,
      {}
    );
    const result = response.data.data;
    return result;
  } catch (err: any) {
    const processedError = processError(err);

    try {
      OrangeryToast(
        processedError.errors[0].error, "error"
      );
    } catch (err: any) { }

    throw processedError;
  }
}

export function useInsertInvoice() {
  const queryClient = useQueryClient();
  return useMutation<IInvocieResult, Error, IInvoiceParams>(
    insertInvoice,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["tenantPayments"]);  ////////!!!!!!!! tenantPayments?!
      },
    }
  );
}

export interface IBilling {
  uuid: string;
  name: string;
  price: number;
  number_of_employees: number;
  date: string; ////////!!!!!!!!
  plan: string;
  charge_success: boolean;
  created_date: string; ////////!!!!!!!!
}

export interface IBillingParams {
  billing_uuid: string;
  tax?: number;
  rabatt?: number;
  amount?: number;
  status?: string;
  invoice_number?: string;
}

async function getBillings(): Promise<IBilling[]> {
  try {
    const resp = await backend.get(`company/billing`, {});
    const data = resp.data;
    let result = data?.data
    // let result = [
    //   ...data?.data,
    //   {
    //     uuid: "09a6e980-2db2-4bd3-b1a5-5ac339b67027",
    //     name: "2x Users for plan -Premium-, discount = 10%",
    //     billing_price: 1258,
    //     number_of_employees: 2,
    //     date: "Mon, 04 Apr 2022 00:00:00 GMT",
    //     plan: "Premium 699 Eur pp.",
    //     charge_success: false,
    //     // "created_by": "Server",
    //     created_date: "Mon, 04 Apr 2022 15:59:19 GMT",
    //     // "updated_by": "Server",
    //     // "timestamp": 1649087959.506353
    //   },
    //   {
    //     uuid: "b95597e9-5a05-4216-b2fd-50ba2965cce0",
    //     name: "2x Users for plan -Premium-, discount = 10%",
    //     billing_price: 1258,
    //     number_of_employees: 2,
    //     date: "Wed, 06 Apr 2022 00:00:00 GMT",
    //     plan: "Premium 699 Eur pp.",
    //     charge_success: true,
    //     // "created_by": "Server",
    //     created_date: "Wed, 06 Apr 2022 00:06:33 GMT",
    //     // "updated_by": "Server",
    //     // "timestamp": 1649203593.006356
    //   }
    // ]
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useBillings() {
  return useQuery<IBilling[], Error>(
    ["billings",],
    () => getBillings(),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IBillingResult {
}

async function updateGenenrateInvoice(
  params: IBillingParams
): Promise<IBillingResult> {
  try {
    const data = {
      tax: params.tax,
      rabatt: params.rabatt,
    };
    const response = await backend.put(
      `/billing/${params.billing_uuid}/generate-invoice`,
      data,
      {}
    );
    const result = response.data.data;
    return result;
  } catch (err: any) {
    const processedError = processError(err);

    try {
      OrangeryToast(
        processedError.errors[0].error, "error"
      );
    } catch (err: any) { }

    throw processedError;
  }
}

export function useUpdateGenerateInvoice() {
  const queryClient = useQueryClient();
  return useMutation<IBillingResult, Error, IBillingParams>(
    updateGenenrateInvoice,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["tenantPayments"]);  ////////!!!!!!!! tenantPayments?!
      },
    }
  );
}

async function updateSetStatus(
  params: IBillingParams
): Promise<IBillingResult> {
  try {
    const data = {
      status: params.status,
    };
    const response = await backend.put(
      `/billing/${params.billing_uuid}/status`,
      data,
      {}
    );
    const result = response.data.data;
    return result;
  } catch (err: any) {
    const processedError = processError(err);

    try {
      OrangeryToast(
        processedError.errors[0].error, "error"
      );
    } catch (err: any) { }

    throw processedError;
  }
}

export function useUpdateSetStatus() {
  const queryClient = useQueryClient();
  return useMutation<IBillingResult, Error, IBillingParams>(
    updateSetStatus,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["tenantPayments"]);  ////////!!!!!!!! tenantPayments?!
      },
    }
  );
}

async function updateSendInvoice(
  params: IBillingParams
): Promise<IBillingResult> {
  try {
    const data = {
    };
    const response = await backend.put(
      `/billing/${params.billing_uuid}/send-invoice`,
      data,
      {}
    );
    const result = response.data.data;
    return result;
  } catch (err: any) {
    const processedError = processError(err);

    try {
      OrangeryToast(
        processedError.errors[0].error, "error"
      );
    } catch (err: any) { }

    throw processedError;
  }
}

export function useUpdateSendInvoice() {
  const queryClient = useQueryClient();
  return useMutation<IBillingResult, Error, IBillingParams>(
    updateSendInvoice,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["tenantPayments"]);  ////////!!!!!!!! tenantPayments?!
      },
    }
  );
}

async function updateSendStornoInvoice(
  params: IBillingParams
): Promise<IBillingResult> {
  try {
    const data = {
    };
    const response = await backend.put(
      `/billing/${params.billing_uuid}/send-storno-invoice`,
      data,
      {}
    );
    const result = response.data.data;
    return result;
  } catch (err: any) {
    const processedError = processError(err);

    try {
      OrangeryToast(
        processedError.errors[0].error, "error"
      );
    } catch (err: any) { }

    throw processedError;
  }
}

export function useUpdateSendStornoInvoice() {
  const queryClient = useQueryClient();
  return useMutation<IBillingResult, Error, IBillingParams>(
    updateSendStornoInvoice,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["tenantPayments"]);  ////////!!!!!!!! tenantPayments?!
      },
    }
  );
}

async function updateSendDepositInvoice(
  params: IBillingParams
): Promise<IBillingResult> {
  try {
    const data = {
      amount: params.amount,
    };
    const response = await backend.put(
      `/billing/${params.billing_uuid}/send-deposit-invoice`,
      data,
      {}
    );
    const result = response.data.data;
    return result;
  } catch (err: any) {
    const processedError = processError(err);

    try {
      OrangeryToast(
        processedError.errors[0].error, "error"
      );
    } catch (err: any) { }

    throw processedError;
  }
}

export function useUpdateSendDepositInvoice() {
  const queryClient = useQueryClient();
  return useMutation<IBillingResult, Error, IBillingParams>(
    updateSendDepositInvoice,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["tenantPayments"]);  ////////!!!!!!!! tenantPayments?!
      },
    }
  );
}

async function updateRefund(params: IBillingParams): Promise<IBillingResult> {
  try {
    const data = {};

    const result = await backend.put(
      `/billing/${params.billing_uuid}/refund`,
      data,
      {}
    );
    return result?.data?.data;
  } catch (err: any) {
    const processedError = processError(err);

    try {
      OrangeryToast(
        processedError.errors[0].error, "error"
      );
    } catch (err: any) { }

    throw processedError;
  }
}

export function useUpdateRefund() {
  const queryClient = useQueryClient();
  return useMutation<IBillingResult, Error, IBillingParams>(updateRefund, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["tenantPayments"]);  ////////!!!!!!!! tenantPayments?!
    },
  });
}


async function updateRegenerateInvoice(
  params: IBillingParams
): Promise<IBillingResult> {
  try {
    const data = {
    };
    const response = await backend.put(
      `/billing/${params.billing_uuid}/regenerate-invoice`,
      data,
      {}
    );
    const result = response.data.data;
    return result;
  } catch (err: any) {
    const processedError = processError(err);

    try {
      OrangeryToast(
        processedError.errors[0].error, "error"
      );
    } catch (err: any) { }

    throw processedError;
  }
}

export function useUpdateRegenerateInvoice() {
  const queryClient = useQueryClient();
  return useMutation<IBillingResult, Error, IBillingParams>(
    updateRegenerateInvoice,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["tenantPayments"]);  ////////!!!!!!!! tenantPayments?!
      },
    }
  );
}

async function updateSendPaymentReminder(
  params: IBillingParams
): Promise<IBillingResult> {
  try {
    const data = {
    };
    const response = await backend.put(
      `/billing/${params.billing_uuid}/send-payment-reminder`,
      data,
      {}
    );
    const result = response.data.data;
    return result;
  } catch (err: any) {
    const processedError = processError(err);

    try {
      OrangeryToast(
        processedError.errors[0].error, "error"
      );
    } catch (err: any) { }

    throw processedError;
  }
}

export function useUpdateSendPaymentReminder() {
  const queryClient = useQueryClient();
  return useMutation<IBillingResult, Error, IBillingParams>(
    updateSendPaymentReminder,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["tenantPayments"]);  ////////!!!!!!!! tenantPayments?!
      },
    }
  );
}

async function updateChargeCustomer(
  params: IBillingParams
): Promise<IBillingResult> {
  try {
    const data = {
    };
    const response = await backend.put(
      `/billing/${params.billing_uuid}/charge`,
      data,
      {}
    );
    const result = response.data.data;
    return result;
  } catch (err: any) {
    const processedError = processError(err);

    try {
      OrangeryToast(
        processedError.errors[0].error, "error"
      );
    } catch (err: any) { }

    throw processedError;
  }
}

export function useUpdateChargeCustomer() {
  const queryClient = useQueryClient();
  return useMutation<IBillingResult, Error, IBillingParams>(
    updateChargeCustomer,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["tenantPayments"]);  ////////!!!!!!!! tenantPayments?!
      },
    }
  );
}