import { BACKEND_BASE_URL } from "@/constants";
import { ListResponse } from "@/types";
import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    mapResponse: async (response) => {
      const payload: ListResponse = await response.clone().json();
      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      const payload: ListResponse = await response.clone().json();

      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);
export { dataProvider };
