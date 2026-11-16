// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { processError } from "./commons";

// queries & backend
import { backend } from "./backend";

export interface IBankAccountParams {
  office_uuid?: string;
  uuid?: string;

  country_uuid: string;
  bank_uuid: string;

  receive_option: string;
  access_detail: string;
}

export interface IBankAccountResult { }

async function upsertBankAccount(params: IBankAccountParams): Promise<IBankAccountResult> {
  try {
    const data = {
      country_uuid: params.country_uuid,
      bank_uuid: params.bank_uuid,
      receive_option: params.receive_option,
      access_detail: params.access_detail,
    };

    if (params.uuid) {
      const result = await backend.put(
        `/office/${params.office_uuid}/bank_account/${params.uuid}`,
        data,
        {}
      );
      return result.data.data?.bank_account;
    } else {
      const result = await backend.post(
        `/office/${params.office_uuid}/bank_account`,
        data,
        {}
      );
      return result.data.data?.bank_account;
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpsertBankAccount() {
  const queryClient = useQueryClient();
  return useMutation<IBankAccountResult, Error, IBankAccountParams>(upsertBankAccount, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["bankAccounts", office_uuid]);
    },
  });
}

export interface IDeleteBankAccountParams {
  office_uuid: string;
  uuid: string;
}

async function deleteBankAccount(params: IDeleteBankAccountParams): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/bank_account/${params.uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteBankAccount() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteBankAccountParams>(deleteBankAccount, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["bankAccounts", office_uuid]);
    },
  });
}

export interface IOption {
  uuid: string;
  name: string;
}

export interface ICountry {
  uuid: string;
  name: string;
  banks?: IBank[]
}

export interface IBankAccount {
  uuid: string;
  country: ICountry;
  bank: IBankSummary;
  iban: string;
  active: boolean;
  is_expired: boolean;
}

async function getBankAccount(office_uuid?: any, uuid?: any): Promise<IBankAccount> {
  if (!office_uuid || !uuid) {
    throw "office_uuid and/or uuid should not be empty in getBankAccount()";
  }
  try {
    const resp = await backend.get(
      `/office/${office_uuid}/bank_account/${uuid}`,
      {}
    );
    const data = resp.data;
    let result = data?.data.bank_account;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useBankAccount(office_uuid?: any, uuid?: any) {
  return useQuery<IBankAccount, Error>(
    ["bankAccounts", office_uuid, uuid],
    () => getBankAccount(office_uuid, uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getBankAccounts(office_uuid: string): Promise<IBankAccount[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getBankAccounts()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/bank_account`, {});
    const data = resp.data;
    let result = data?.data.bank_account;
    result = result
      .map((f: any) => ({
        ...f,
        office_uuid,
      }))
      .sort((a: any, b: any) =>
        new Date(a.created_date).getTime() < new Date(b.created_date).getTime()
          ? 1
          : -1
      );
    return result;
  } catch (err: any) {
    return [
      {
        "uuid": "uiuiui",
        "iban": "dddd",
        country: {
          name: "Germany",
          uuid: "hjsdfjsdhf"
        },
        "bank": {
          "uuid": "sss",
          "name": "saman",
          "link": "saman.ir",
          "receive_option": {
            "name": "sss",
            "uuid": "sdsd"
          },
          "access_detail": {
            "name": "sss",
            "uuid": "sdsd"
          }
        },
        "active": true,
        "is_expired": false
      },
      {
        "uuid": "uiuiui2",
        "iban": "dddd",
        country: {
          name: "Germany",
          uuid: "hjsdfjsdhf"
        },
        "bank": {
          "uuid": "sss",
          "name": "saman",
          "link": "saman.ir",
          "receive_option": {
            "name": "sss",
            "uuid": "sdsd"
          },
          "access_detail": {
            "name": "sss",
            "uuid": "sdsd"
          }
        },
        "active": false,
        "is_expired": false
      },
      {
        "uuid": "uiuiui3",
        "iban": "dddd",
        country: {
          name: "Germany",
          uuid: "hjsdfjsdhf"
        },
        "bank": {
          "uuid": "sss",
          "name": "saman",
          "link": "saman.ir",
          "receive_option": {
            "name": "sss",
            "uuid": "sdsd"
          },
          "access_detail": {
            "name": "sss",
            "uuid": "sdsd"
          }
        },
        "active": false,
        "is_expired": true
      }
    ]

    throw err;
  }
}

export function useBankAccounts(office_uuid: string) {
  return useQuery<IBankAccount[], Error>(
    ["bankAccounts", office_uuid],
    () => getBankAccounts(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IBank {
  uuid?: string;
  name?: string;
  link?: string;
  receive_options?: IOption[];
  access_details?: IOption[]
}

export interface IBankSummary {
  uuid: string;
  name: string;
  link: string;
  receive_option: IOption;
  access_detail: IOption;
}

async function getCountryBanks(): Promise<ICountry[]> {
  // if (!office_uuid) {
  //   throw "office_uuid should not be empty in getCountryBanks()";
  // }
  try {
    const resp = await backend.get(
      `/banks`,
      {}
    );
    const data = resp.data;
    let result = data?.data.countries;
    return result;
  } catch (err: any) {
    return [
      {
        "name": "Germany",
        "uuid": "qwer",
        "banks": [
          {
            "name": "saman",
            "uuid": "qwerrr",
            "link": "saman.ir"
          },
          {
            "name": "melat",
            "uuid": "qwerrr",
            "link": "melat.ir"
          }
        ]
      },
      {
        "name": "Germany2",
        "uuid": "qwer2",
        "banks": [
          {
            "name": "saman2",
            "uuid": "qwerrr",
            "link": "saman.ir"
          },
          {
            "name": "melat2",
            "uuid": "qwerrr",
            "link": "melat.ir"
          }
        ]
      }
    ];

    throw err;
  }
}

export function useCountryBanks() {
  return useQuery<ICountry[], Error>(
    ["countryBanks"],
    () => getCountryBanks(),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getBankOptions(office_uuid?: string, bank_uuid?: string): Promise<IBank> {
  if (!office_uuid || !bank_uuid) {
    throw "office_uuid and/or bank_uuid should not be empty in getBankOptions()";
  }
  try {
    const resp = await backend.get(
      `/office/${office_uuid}/bank/${bank_uuid}`,
      {}
    );
    const data = resp.data;
    let result = data?.data;
    return result;
  } catch (err: any) {
    return {
      receive_options: [
        {
          uuid: "123",
          name: "option 1"
        },
        {
          uuid: "1234",
          name: "option 2"
        }
      ],
      access_details: [
        {
          uuid: "1235",
          name: "ad 1"
        },
        {
          uuid: "12346",
          name: "ad 2"
        }
      ]
    }
    throw err;
  }
}

export function useBankOptions(office_uuid?: any, bank_uuid?: any) {
  return useQuery<IBank, Error>(
    ["bank", office_uuid, bank_uuid],
    () => getBankOptions(office_uuid, bank_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}