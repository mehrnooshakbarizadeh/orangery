import { useEffect, useState } from "react";
import {
  IDoorRequest,
  useDoorRequests,
} from "../../../../../queries/doorRequest";

export function useRequest() {
  const [request, setRequest] = useState({
    uuid: "",
    created: "",
    status: "pending",
    user: {
      uuid: "",
      name: "",
      email: "",
      image: null,
    },
    lock: {
      uuid: "",
      lock_id: 0,
      lock_name: "",
      lock_location: "",
      office: {
        name: "",
        uuid: "",
      },
    },
    product: {
      uuid: "",
      name: "",
      description: "",
      quantity: 0,
      type: "",
    },
  });
  const { data: doorRequests } = useDoorRequests();

  useEffect(() => {
    doorRequests?.map((r: IDoorRequest) => setRequest(r));
  });

  return request;
}
