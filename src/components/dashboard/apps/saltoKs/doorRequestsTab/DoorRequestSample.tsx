// import { DoorRequestActionStatus } from "../../../../../queries/doorRequest";

export interface IDoorRequest {
  uuid: string;
  created: string;
  status: string;
  // status: DoorRequestActionStatus;
  user: {
    uuid: string;
    name: string;
    email: string;
    image: null;
  };
  lock: {
    uuid: string;
    lock_id: number;
    lock_name: string;
    lock_location: string;
    office: {
      name: string;
      uuid: string;
    };
  };
  product: {
    uuid: string;
    name: string;
    description: string;
    quantity: number;
    type: string;
  };
}

export const doorRequest: IDoorRequest[] = [
  {
    uuid: "c1d5fe8d-4401-423b-be26-3672721850e8",
    created: "Thu, 12 Jan 2023 17:48:25 GMT",
    status: "accept",
    user: {
      uuid: "d828aacf-9aa9-4b4f-90b8-fb6d94d23c34",
      name: "Sarik GünSarik GünSarik Gün",
      email: "sarik56Sarik GünSarik Gün@hotmail.de",
      image: null,
    },
    lock: {
      uuid: "30aad76a-14a8-4883-8055-f180a775c101",
      lock_id: 12345,
      lock_name: "A Test Door 1A Test Door 1A Test Door 1",
      lock_location: "Hamburg",
      office: {
        name: "Orangery Coworking GmbH",
        uuid: "83b58066-bb8b-41ff-a53b-a72773b05365",
      },
    },
    product: {
      uuid: "2a55bbe7-558b-4e4a-996a-2e280e5aa5e8",
      name: "AA Product 333AA Product 333AA Product 333",
      description: "this is my description",
      quantity: 20,
      type: "unknown",
    },
  },
  {
    uuid: "6b314075-a1ed-46d3-8ea3-f0b5873a79db",
    created: "Thu, 12 Jan 2023 17:48:31 GMT",
    status: "reject",
    user: {
      uuid: "d828aacf-9aa9-4b4f-90b8-fb6d94d23c34",
      name: "Tarik Gün",
      email: "tarik56@hotmail.de",
      image: null,
    },
    lock: {
      uuid: "30aad76a-14a8-4883-8055-f180a775c111",
      lock_id: 12345,
      lock_name: "B Test Door 2",
      lock_location: "Hamburg",
      office: {
        name: "Orangery Coworking GmbH",
        uuid: "83b58066-bb8b-41ff-a53b-a72773b05365",
      },
    },
    product: {
      uuid: "2a55bbe7-558b-4e4a-996a-2e280e5aa588",
      name: "BB Product 444",
      description: "this is my description",
      quantity: 20,
      type: "unknown",
    },
  },
  {
    uuid: "1v314075-a1ed-46d3-8ea3-f0b5873a79db",
    created: "Thu, 12 Jan 2023 17:48:31 GMT",
    status: "pending",
    user: {
      uuid: "d828aacf-9aa9-4b4f-90b8-fb6d94d23c34",
      name: "Martin Gün",
      email: "martin@hotmail.de",
      image: null,
    },
    lock: {
      uuid: "30aad76a-14a8-4883-8055-f180a775c111",
      lock_id: 12345,
      lock_name: "C Test Door 3",
      lock_location: "Hamburg",
      office: {
        name: "Orangery Coworking GmbH",
        uuid: "83b58066-bb8b-41ff-a53b-a72773b05365",
      },
    },
    product: {
      uuid: "2a55bbe7-558b-4e4a-996a-2e280e5aa588",
      name: "CC Product 666",
      description: "this is my description",
      quantity: 20,
      type: "unknown",
    },
  },
];
