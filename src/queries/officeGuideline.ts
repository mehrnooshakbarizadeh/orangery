// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";
import { backendMock } from "./backendMock";
import { IUser } from "./dashboard";
import { IMedia } from "./media";

export interface IAmenities {
  data?: string[];
}

async function getAmenities(office_uuid?: any): Promise<IAmenities> {
  if (!office_uuid) {
    throw "uuid should not be empty in getAmenities()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/amenities`, {});
    const data = resp.data;
    let result = data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useAmenities(office_uuid?: any) {
  return useQuery<IAmenities, Error>(
    ["amenities", office_uuid],
    () => getAmenities(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IOptionalInformation {
  uuid?: string;
  title: string;
  description: string;
  images?: IMedia[];
}

export interface IOfficeGuideline {
  uuid: string;
  name: string;
  introduction: string;
  community_managers: IUser[];
  amenities?: string[];
  images: IMedia[];
  optional_information: IOptionalInformation[];
}

async function getOfficeGuideline(
  office_uuid?: any
): Promise<IOfficeGuideline> {
  if (!office_uuid) {
    throw "uuid should not be empty in getOfficeGuideline()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/guideline`, {});
    const data = resp.data;
    let result = data?.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useOfficeGuideline(office_uuid?: any) {
  return useQuery<IOfficeGuideline, Error>(
    ["officeGuideline", office_uuid],
    () => getOfficeGuideline(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IOptionalInformationUpdateParams {
  uuid?: string;
  title: string;
  description: string;
  image_uuids: string[];
}

export interface IOfficeGuidelineUpdateParams {
  uuid?: string;
  introduction: string;
  amenities?: string[];
  community_manager_uuids: string[];
  image_uuids: string[];
  optional_information: IOptionalInformationUpdateParams[];
}

async function updateOfficeGuideline(
  params: IOfficeGuidelineUpdateParams
): Promise<IOfficeGuideline> {
  try {
    const data = {
      introduction: params.introduction,
      amenities: params.amenities,
      community_manager_uuids: params.community_manager_uuids,
      image_uuids: params.image_uuids,
      optional_information: params.optional_information,
    };

    const response = await backend.put(
      `/office/${params.uuid}/guideline`,
      data,
      {}
    );
    const result = response.data.data?.guideline;
    return result;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpdateOfficeGuideline() {
  const queryClient = useQueryClient();
  return useMutation<IOfficeGuideline, Error, IOfficeGuidelineUpdateParams>(
    updateOfficeGuideline,
    {
      onSuccess: (_, variables) => {
        const officeGuideline_uuid = variables.uuid;
        queryClient.invalidateQueries([
          "officeGuideline",
          officeGuideline_uuid,
        ]);
      },
    }
  );
}

export function processError(err: any) {
  if (err.response) {
    if (err.response.data.error_code === 500) {
      const error: FormError = {
        errors: [
          {
            field: "",
            error: err.response.data.msg || "Something went wrong on server!",
          },
        ],
      };
      return error;
    }
    if (err.response.data.error_code === 400) {
      const error: FormError = {
        errors: [
          {
            field: "",
            error: err.response.data.msg || "Something went wrong on client!",
          },
        ],
      };
      return error;
    }
    if (err.response.data.error_code === 403) {
      const error: FormError = {
        errors: [
          {
            field: "",
            error:
              err.response.data.msg || "the username is already registered!",
          },
        ],
      };
      return error;
    }
    // debugger;
    //TODO handle 400 / 500
    const error: FormError = {
      errors: [
        {
          field: "firstName",
          error: "bad name",
        },
      ],
    };
    return error;
  } else if (err.request) {
    // debugger;
    // TODO network error
    const error: FormError = {
      errors: [
        {
          field: "",
          error: "Network Error",
        },
      ],
    };
    return error;
  } else {
    // debugger;
    //TODO something else
    const error: FormError = {
      errors: [
        {
          field: "",
          error: "Something went wrong!",
        },
      ],
    };
    return error;
  }
}
