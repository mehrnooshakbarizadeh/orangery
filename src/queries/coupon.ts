// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";
import { processError } from "./commons";

export interface ICouponParams {
  uuid?: string;
  discount_code: string,
  discount_type: string,
  amount: number,
  active: boolean,
  user_uuids: string[],
  quantity: number,
  expire_date: Date | null,
  multi_use: boolean,
  office_uuid: string;

  product_uuids?: string[];
  remove_product_uuids?: string[];
}
export interface ICouponResult { }

async function upsertCoupon(params: ICouponParams): Promise<ICouponResult> {
  try {
    const data = {
      discount_code: params.discount_code,
      discount_type: params.discount_type,
      amount: params.amount,
      user_uuids: params.user_uuids,
      active: params.active,
      quantity: params.quantity,
      expire_date: params.expire_date,
      multi_use: params.multi_use,

      product_uuids: params.product_uuids,
      remove_product_uuids: params.remove_product_uuids,
    };

    if (params.uuid) {
      const result = await backend.put(
        `/office/${params.office_uuid}/coupon/${params.uuid}`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return { finalResult };
    } else {
      const result = await backend.post(
        `/office/${params.office_uuid}/coupon`,
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

export function useUpsertCoupon() {
  const queryClient = useQueryClient();
  return useMutation<ICouponResult, Error, ICouponParams>(upsertCoupon, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["coupon", office_uuid]);
    },
  });
}

export interface IDeleteCouponParams {
  office_uuid: string;
  uuid: string;
}
async function deleteCoupon(params: IDeleteCouponParams): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/coupon/${params.uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteCouponParams>(deleteCoupon, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["coupon", office_uuid]);
    },
  });
}

export interface ICouponProduct {
  uuid: string;
  name: string;
  description: string;
  quantity: number;
}

export interface ICoupon {
  amount: number,
  description: string,
  discount_code: string,
  discount_type: string,
  expire_date: Date,
  multi_use: boolean,
  active: boolean,
  quantity: number,
  stock: number,
  users: {
    uuid: string,
    name: string,
    first_name?: string,
    last_name?: string,
    image?: string
    email: string,
    checked_in: boolean,
  }[],
  uuid: string,
  office_uuid: string;

  products: ICouponProduct[];
}


async function getCoupon(office_uuid?: any, coupon_uuid?: any): Promise<ICoupon> {
  if (!office_uuid || !coupon_uuid) {
    throw "office_uuid and/or coupon_uuid should not be empty in getCoupon()";
  }
  try {
    const resp = await backend.get(
      `/office/${office_uuid}/coupon/${coupon_uuid}`,
      {}
    );
    const data = resp.data;
    let result = data?.data.coupon;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useCoupon(office_uuid?: any, coupon_uuid?: any) {
  return useQuery<ICoupon, Error>(
    ["coupon", office_uuid, coupon_uuid],
    () => getCoupon(office_uuid, coupon_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getCoupons(office_uuid: string): Promise<ICoupon[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getCoupons()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/coupon`, {});
    const data = resp.data;
    let result = data?.data.coupons;
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
    throw err;
  }
}

export function useCoupons(office_uuid: string) {
  return useQuery<ICoupon[], Error>(
    ["coupon", office_uuid],
    () => getCoupons(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

