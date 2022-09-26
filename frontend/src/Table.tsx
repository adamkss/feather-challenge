import React, { useCallback, useEffect, useState } from "react";
import { getPolicies } from "./api/policies";
import Badge from "./Badge";
import Select from "./components/select";
import TextInput from "./components/text-input";
import { KEY_STRINGS_MAP } from "./i18n";
import { TPolicy } from "./models";

type TFilters = {
  name: string;
  provider: string;
  type: string;
  status: string;
};

const FILTERS_EMPTY_VALUE = {
  name: "",
  provider: "",
  type: "",
  status: "",
};

export const PAGE_SIZE = 5;

export const getNameOnPolicy = (policy: TPolicy) => {
  return `${policy.customer.firstName} ${policy.customer.lastName}`;
};

const getFilteredPolicies = (policies: TPolicy[], filters: TFilters) => {
  return policies.filter((policy) => {
    if (filters.name !== "") {
      if (
        !getNameOnPolicy(policy)
          .toLowerCase()
          .includes(filters.name.toLowerCase())
      ) {
        return false;
      }
    }

    if (filters.provider !== "") {
      if (
        !policy.provider.toLowerCase().includes(filters.provider.toLowerCase())
      ) {
        return false;
      }
    }

    if (filters.type !== "") {
      if (policy.insuranceType !== filters.type) {
        return false;
      }
    }

    if (filters.status !== "") {
      if (policy.status !== filters.status) {
        return false;
      }
    }

    return true;
  });
};

const Table = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [policies, setPolicies] = useState<TPolicy[]>([]);
  const [filters, setFilters] = useState<TFilters>(FILTERS_EMPTY_VALUE);
  const [page, setPage] = useState<number>(0);

  const loadPolicies = useCallback(async () => {
    setIsLoading(true);
    try {
      const policies = await getPolicies();
      setPolicies(
        policies.filter(
          (policy) => policy.status === "ACTIVE" || policy.status === "PENDING"
        )
      );
    } catch {
      alert("The policies request failed.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Loading the policies on startup
  useEffect(() => {
    loadPolicies();
  }, [loadPolicies]);

  // Set the page to 0 when a filter changes
  useEffect(() => {
    setPage(0);
  }, [filters]);

  const filteredPolicies = getFilteredPolicies(policies, filters);

  // Generate the policies to show based on pagination
  const policiesToShow = filteredPolicies.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  const onFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-4 items-end">
        <div className="flex flex-col gap-4">
          <TextInput
            label="Name:"
            name="name"
            value={filters.name}
            onChange={onFilterChange}
          />
          <TextInput
            label="Provider:"
            name="provider"
            onChange={onFilterChange}
          />
          <Select
            label="Type:"
            name="type"
            options={[
              {
                label: "Liability",
                value: "LIABILITY",
              },
              {
                label: "Household",
                value: "HOUSEHOLD",
              },
              {
                label: "Health",
                value: "HEALTH",
              },
            ]}
            value={filters.type}
            onChange={onFilterChange}
          />
          <Select
            label="Status:"
            name="status"
            options={[
              {
                label: "Active",
                value: "ACTIVE",
              },
              {
                label: "Pending",
                value: "PENDING",
              },
            ]}
            value={filters.status}
            onChange={onFilterChange}
          />
        </div>
        <button
          className="p-2 border bg-gray-100 hover:bg-gray-200"
          onClick={() => {
            setFilters(FILTERS_EMPTY_VALUE);
          }}
        >
          Clear filters
        </button>
      </div>
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-lg shadow-sm">
            <table className="min-w-full" id="table">
              <thead className="border-b bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Provider
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {policiesToShow.map((policy, index) => (
                  <tr className="border-b" key={policy.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {page * PAGE_SIZE + index + 1}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {getNameOnPolicy(policy)}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {policy.provider}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {`${KEY_STRINGS_MAP.insuranceType[policy.insuranceType]}`}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      <Badge status={policy.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {policiesToShow.length === 0 && !isLoading && (
              <div className="p-2 flex justify-center">
                <span>No data.</span>
              </div>
            )}
            {policiesToShow.length === 0 && isLoading && (
              <div className="p-2 flex justify-center">
                <span>Loading...</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 py-4">
            {/* Generating the pagination buttons */}
            {[...Array(Math.ceil(filteredPolicies.length / PAGE_SIZE))].map(
              (_, index) => (
                <button
                  key={Math.random()}
                  className={`py-1 px-2 border border-gray-300 hover:bg-gray-200 ${
                    page === index ? "bg-blue-100" : ""
                  }`}
                  onClick={() => {
                    setPage(index);
                  }}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
