import { TPolicy } from "../../models";
import { POLICIES } from "./urls";

export const getPolicies: () => Promise<TPolicy[]> = () => {
  return fetch(POLICIES).then((res) => {
    if (res.status < 200 || res.status >= 300) {
      throw new Error(`The request failed with status code ${res.status}`);
    }
    return res.json();
  });
};
