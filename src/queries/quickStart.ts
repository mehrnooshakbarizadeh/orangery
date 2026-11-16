// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FloorState } from "../components/dashboard/overview/quickStart/HandleFloorView";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";
import { processError } from "./commons";

export interface IWizardParams {
  floors: { name: string; rooms: number; desks: number; meeting_rooms: number; }[];
  parking_spots: number;
  office_uuid?: string;
  
}
export interface IWizardResult {
  uuid: string;
}
async function postWizard(params: IWizardParams): Promise<IWizardResult> {
  try {
    const data = {
      floors: params.floors,
      parking_spots: params.parking_spots,
    };
    
      const response = await backend.post(
        `/office/${params.office_uuid}/dashboard/wizard`,
        data,
        {}
      );
      const result = response.data.data;
      return result;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function usePostWizard() {
  const queryClient = useQueryClient();
  return useMutation<IWizardResult, Error, IWizardParams>(postWizard, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["wizard", office_uuid]);
    },
  });
}