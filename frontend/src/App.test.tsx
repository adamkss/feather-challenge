import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import App from "./App";
import { KEY_STRINGS_MAP } from "./i18n";
import { TPolicy } from "./models";
import { getNameOnPolicy, PAGE_SIZE } from "./Table";
import { POLICIES } from "./api/policies/urls";

export const MOCKED_POLICIES: TPolicy[] = [
  {
    id: "e743d4f6-5aa8-4628-920e-ac89d2d6eaa7",
    provider: "BARMER",
    insuranceType: "HEALTH",
    status: "PENDING",
    startDate: "2017-04-26T05:32:06.000Z",
    endDate: null,
    customer: {
      id: "a8994e97-c574-476f-becc-8eab780e1870",
      firstName: "Cyrillus",
      lastName: "Biddlecombe",
      dateOfBirth: "1978-12-03T06:33:17.000Z",
    },
  },
  {
    id: "9d3fd3cf-5e0d-4844-92f2-5cb09bd65150",
    provider: "BARMER",
    insuranceType: "LIABILITY",
    status: "PENDING",
    startDate: "2015-01-13T04:52:15.000Z",
    endDate: null,
    customer: {
      id: "0f6b7bb1-c365-45af-97fb-e87703a658f5",
      firstName: "Brandy",
      lastName: "Harbour",
      dateOfBirth: "1985-02-28T12:51:27.000Z",
    },
  },
  {
    id: "a4c8c549-fc54-4b6f-8ee1-0adb68346bb1",
    provider: "AOK",
    insuranceType: "HEALTH",
    status: "DROPPED_OUT",
    startDate: "2014-07-14T00:54:34.000Z",
    endDate: null,
    customer: {
      id: "560a1568-2247-443f-bb99-2163bc80d0d0",
      firstName: "Ailina",
      lastName: "Harber",
      dateOfBirth: "1993-01-20T02:51:20.000Z",
    },
  },
  {
    id: "e803e25e-7ef4-46c2-aaf8-647024e7d202",
    provider: "AOK",
    insuranceType: "HEALTH",
    status: "PENDING",
    startDate: "2020-07-21T19:40:35.000Z",
    endDate: null,
    customer: {
      id: "038a5a36-6840-4c60-9e9e-98941b2af96a",
      firstName: "Aguste",
      lastName: "Bilsford",
      dateOfBirth: "1997-04-24T11:26:05.000Z",
    },
  },
  {
    id: "b5885a83-9141-47b5-9bbf-d86837f051ef",
    provider: "BARMER",
    insuranceType: "HOUSEHOLD",
    status: "ACTIVE",
    startDate: "2013-03-30T19:27:54.000Z",
    endDate: null,
    customer: {
      id: "b2925805-4dcc-4780-9dd0-2d59e09c2e38",
      firstName: "Haydon",
      lastName: "Ballay",
      dateOfBirth: "2006-12-04T01:13:38.000Z",
    },
  },
  {
    id: "941a4c1b-72f6-4f15-a975-f81ecaf7d000",
    provider: "AOK",
    insuranceType: "HEALTH",
    status: "CANCELLED",
    startDate: "2021-01-12T19:24:41.000Z",
    endDate: null,
    customer: {
      id: "7870f984-e4a1-48bf-8a6d-f1aba24925e6",
      firstName: "Brandyn",
      lastName: "Argyle",
      dateOfBirth: "2006-03-17T03:35:43.000Z",
    },
  },
  {
    id: "2993b67f-361d-4667-824b-f3852be59c7c",
    provider: "BARMER",
    insuranceType: "HEALTH",
    status: "ACTIVE",
    startDate: "2018-05-11T11:56:51.000Z",
    endDate: null,
    customer: {
      id: "c15566de-e79e-456c-9a58-a6436d7dd430",
      firstName: "Tani",
      lastName: "Erasmus",
      dateOfBirth: "2022-03-06T08:51:11.000Z",
    },
  },
  {
    id: "bf486791-e0a8-42eb-8b47-c103293dc45e",
    provider: "TK",
    insuranceType: "HOUSEHOLD",
    status: "PENDING",
    startDate: "2013-01-25T04:14:34.000Z",
    endDate: null,
    customer: {
      id: "6436d375-81b2-44a0-8f83-0edac9f03c1d",
      firstName: "Galvan",
      lastName: "Suggey",
      dateOfBirth: "1992-05-23T18:12:40.000Z",
    },
  },
  {
    id: "f8ca555d-2145-4ae0-a636-6a9d5381ddfa",
    provider: "TK",
    insuranceType: "HEALTH",
    status: "ACTIVE",
    startDate: "2012-09-24T09:55:17.000Z",
    endDate: null,
    customer: {
      id: "19db1a65-a818-49f9-845b-d30077a544fb",
      firstName: "Rozelle",
      lastName: "Nipper",
      dateOfBirth: "2005-08-12T07:01:40.000Z",
    },
  },
  {
    id: "f2be0054-2241-494d-8a42-6d63f305cacc",
    provider: "AOK",
    insuranceType: "HEALTH",
    status: "PENDING",
    startDate: "2020-05-02T05:53:46.000Z",
    endDate: null,
    customer: {
      id: "f1c53bae-0758-4f31-938d-22b4afbef941",
      firstName: "Flossie",
      lastName: "Camings",
      dateOfBirth: "2004-06-15T14:20:52.000Z",
    },
  },
  {
    id: "613e4a41-782b-4d14-b551-9603b3f83712",
    provider: "BARMER",
    insuranceType: "HOUSEHOLD",
    status: "PENDING",
    startDate: "2022-01-12T17:47:41.000Z",
    endDate: null,
    customer: {
      id: "78d7a147-1b4b-4c4c-bf8f-7d2afda83765",
      firstName: "Derril",
      lastName: "Gildersleeve",
      dateOfBirth: "2006-02-23T00:10:07.000Z",
    },
  },
  {
    id: "79276d18-41c7-498e-b7f2-e2d193ff1c29",
    provider: "TK",
    insuranceType: "HEALTH",
    status: "ACTIVE",
    startDate: "2012-07-04T15:31:29.000Z",
    endDate: null,
    customer: {
      id: "6c36015e-6e48-480e-a260-f643a5bb6cbe",
      firstName: "Amanda",
      lastName: "McPherson",
      dateOfBirth: "1977-10-16T17:54:53.000Z",
    },
  },
  {
    id: "2afbc790-a025-4a9e-87b9-5e57e4bfdd9b",
    provider: "TK",
    insuranceType: "HEALTH",
    status: "PENDING",
    startDate: "2012-08-01T03:25:59.000Z",
    endDate: null,
    customer: {
      id: "f9fc3f36-573d-405c-a19c-8d5638fee77c",
      firstName: "Garnette",
      lastName: "Benda",
      dateOfBirth: "1986-12-29T08:02:10.000Z",
    },
  },
  {
    id: "7957e5ca-a7c9-480f-9545-0bc9d7675585",
    provider: "DAK",
    insuranceType: "LIABILITY",
    status: "DROPPED_OUT",
    startDate: "2014-02-22T06:02:58.000Z",
    endDate: null,
    customer: {
      id: "89e8eca3-817f-4d12-a2c5-2f9f5d5e0d66",
      firstName: "Yoko",
      lastName: "Becker",
      dateOfBirth: "2005-06-10T22:51:36.000Z",
    },
  },
  {
    id: "398b9b80-45bd-45f0-aeb9-d70f7399218c",
    provider: "BARMER",
    insuranceType: "LIABILITY",
    status: "ACTIVE",
    startDate: "2014-04-14T12:39:02.000Z",
    endDate: null,
    customer: {
      id: "25fd94a1-3e77-4281-abd0-0f550d6a9206",
      firstName: "Sam",
      lastName: "Penni",
      dateOfBirth: "2002-03-24T11:34:21.000Z",
    },
  },
  {
    id: "3e0c7dd9-eb9c-4ea8-9c34-03ab8a798b1a",
    provider: "TK",
    insuranceType: "HOUSEHOLD",
    status: "DROPPED_OUT",
    startDate: "2017-05-28T11:56:27.000Z",
    endDate: null,
    customer: {
      id: "990345c6-f044-4131-a0d3-071c8ffac946",
      firstName: "Jeffie",
      lastName: "Pinyon",
      dateOfBirth: "2009-10-26T12:24:25.000Z",
    },
  },
  {
    id: "eb071f78-e9be-49f2-a8d9-7a830192933f",
    provider: "AOK",
    insuranceType: "HOUSEHOLD",
    status: "CANCELLED",
    startDate: "2012-03-29T01:59:13.000Z",
    endDate: null,
    customer: {
      id: "ab2f368b-e79d-457e-9102-2c429716129c",
      firstName: "Mariette",
      lastName: "Cristofanini",
      dateOfBirth: "2011-08-01T11:56:32.000Z",
    },
  },
  {
    id: "68727afb-067a-41f7-af82-f8455ddcd2de",
    provider: "DAK",
    insuranceType: "LIABILITY",
    status: "PENDING",
    startDate: "2013-11-15T09:58:45.000Z",
    endDate: null,
    customer: {
      id: "c8e4a305-978d-4894-be02-0b9d24e2fd56",
      firstName: "Jess",
      lastName: "Whittle",
      dateOfBirth: "2017-08-20T14:53:21.000Z",
    },
  },
  {
    id: "199c8596-7ecd-4236-be43-585f785699a3",
    provider: "DAK",
    insuranceType: "HEALTH",
    status: "ACTIVE",
    startDate: "2020-08-16T03:24:30.000Z",
    endDate: null,
    customer: {
      id: "4ace373a-67fa-4a20-9276-379f9969f563",
      firstName: "Graeme",
      lastName: "Ternent",
      dateOfBirth: "1988-10-25T13:37:10.000Z",
    },
  },
  {
    id: "a57f8a95-fa9c-4e36-a01c-3493b7e3eb86",
    provider: "AOK",
    insuranceType: "LIABILITY",
    status: "ACTIVE",
    startDate: "2016-04-14T02:53:58.000Z",
    endDate: null,
    customer: {
      id: "61cb56b8-8c87-47a9-8e5f-c129ddb1298e",
      firstName: "Valeria",
      lastName: "Keysel",
      dateOfBirth: "1979-04-23T10:03:12.000Z",
    },
  },
];

const server = setupServer(
  rest.get(POLICIES, (req, res, ctx) => {
    return res(ctx.json(MOCKED_POLICIES));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const policyFilterStatusPredicate = (policy: TPolicy) =>
  policy.status === "ACTIVE" || policy.status === "PENDING";

test("renders the first page of the policies table (only ACTIVE and PENDING)", async () => {
  render(<App />);
  // get first page of table
  const firtsPage = MOCKED_POLICIES.filter(policyFilterStatusPredicate).slice(
    0,
    PAGE_SIZE
  );
  for (const policy of firtsPage) {
    // check the name
    expect(
      await screen.findByText(getNameOnPolicy(policy))
    ).toBeInTheDocument();

    // check the provider
    expect(
      (await screen.findAllByText(policy.provider))[0]
    ).toBeInTheDocument();

    // check the type
    expect(
      (
        await screen.findAllByText(
          KEY_STRINGS_MAP.insuranceType[policy.insuranceType]
        )
      )[0]
    ).toBeInTheDocument();

    // check the status
    expect((await screen.findAllByText(policy.status))[0]).toBeInTheDocument();
  }
});

test("does not render an entry that should not be on the second page", async () => {
  const usedMockedPolicies = MOCKED_POLICIES.filter(
    policyFilterStatusPredicate
  );

  render(<App />);
  // get the first element that should be on the second page
  const policySecondPage = usedMockedPolicies[PAGE_SIZE];

  // wait and assert the first element which should show up
  expect(
    await screen.findByText(getNameOnPolicy(usedMockedPolicies[0]))
  ).toBeInTheDocument();

  // check that the first element from the second page is not shown
  expect(
    screen.queryByText(getNameOnPolicy(policySecondPage))
  ).not.toBeInTheDocument();
});

test("moving to the next page of pagination should show the next page of entries", async () => {
  const filteredMockedPolicies = MOCKED_POLICIES.filter(
    policyFilterStatusPredicate
  );

  // get second page of table
  const secondPage = filteredMockedPolicies.slice(PAGE_SIZE, PAGE_SIZE * 2);

  render(<App />);

  // wait until the first entry is rendered on the first page
  expect(
    await screen.findByText(getNameOnPolicy(filteredMockedPolicies[0]))
  ).toBeInTheDocument();

  // click the second page button to go to the second page of policies
  const secondPageButton = screen.getByRole("button", {
    name: /2/i,
  });
  await waitFor(() => {
    fireEvent.click(secondPageButton);
  });

  // test second page elements
  for (const policy of secondPage) {
    // check the name
    expect(
      await screen.findByText(getNameOnPolicy(policy))
    ).toBeInTheDocument();

    // check the provider
    expect(
      (await screen.findAllByText(policy.provider))[0]
    ).toBeInTheDocument();

    // check the type
    expect(
      (
        await screen.findAllByText(
          KEY_STRINGS_MAP.insuranceType[policy.insuranceType]
        )
      )[0]
    ).toBeInTheDocument();

    // check the status
    expect((await screen.findAllByText(policy.status))[0]).toBeInTheDocument();
  }
});

test("renders as many pagination buttons as are pages", async () => {
  const filteredMockedPolicies = MOCKED_POLICIES.filter(
    policyFilterStatusPredicate
  );

  render(<App />);

  // wait until the first entry is rendered on the first page
  expect(
    await screen.findByText(getNameOnPolicy(filteredMockedPolicies[0]))
  ).toBeInTheDocument();

  const numberOfPaginationButtonsThatShouldExist = Math.ceil(
    filteredMockedPolicies.length / PAGE_SIZE
  );

  for (
    let index = 1;
    index <= numberOfPaginationButtonsThatShouldExist;
    index++
  ) {
    expect(
      screen.getByRole("button", {
        name: `${index}`,
      })
    ).toBeInTheDocument();
  }
});

test("filters the table by name via the name input", async () => {
  const filteredMockedPolicies = MOCKED_POLICIES.filter(
    policyFilterStatusPredicate
  );

  render(<App />);
  // get first page of table
  const firtsPage = filteredMockedPolicies.slice(0, PAGE_SIZE);

  // wait until the first entry is rendered on the first page
  expect(
    await screen.findByText(getNameOnPolicy(firtsPage[0]))
  ).toBeInTheDocument();

  // choose the first element from the second page as the filter item
  const nameToFilterAfter = getNameOnPolicy(filteredMockedPolicies[PAGE_SIZE]);

  // check that it's not actually visible
  expect(
    screen.queryByText(getNameOnPolicy(filteredMockedPolicies[PAGE_SIZE]))
  ).not.toBeInTheDocument();

  // put the name to filter after into the name input
  const nameInput = screen.getByLabelText("Name:");
  await waitFor(() => {
    fireEvent.change(nameInput, { target: { value: nameToFilterAfter } });
  });

  // wait until the item is visible
  expect(
    await screen.findByText(getNameOnPolicy(filteredMockedPolicies[PAGE_SIZE]))
  ).toBeInTheDocument();
});

test("filters the table by provider via the provider input", async () => {
  const filteredMockedPolicies = MOCKED_POLICIES.filter(
    policyFilterStatusPredicate
  );

  render(<App />);
  // get first page of table
  const firtsPage = filteredMockedPolicies.slice(0, PAGE_SIZE);

  // wait until the first entry is rendered on the first page
  expect(
    await screen.findByText(getNameOnPolicy(firtsPage[0]))
  ).toBeInTheDocument();

  const providersOnFirstPage = Array.from(
    new Set(firtsPage.map((policy) => policy.provider))
  );

  for (const provider of providersOnFirstPage) {
    // check that all of these providers are visible
    expect(screen.queryAllByText(provider)[0]).toBeInTheDocument();
  }

  // Choose the first provider to filter after
  const providerToFilterAfter = providersOnFirstPage[0];

  // put a provider to filter after into the provider input
  const nameInput = screen.getByLabelText("Provider:");
  await waitFor(() => {
    fireEvent.change(nameInput, { target: { value: providerToFilterAfter } });
  });

  // wait a bit
  await new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, 200);
  });

  // check that the other providers are no longer visible
  providersOnFirstPage.slice(1).forEach((provider) => {
    expect(screen.queryByText(provider)).not.toBeInTheDocument();
  });
});

test("filters the table by insurance type via the insurance type select input", async () => {
  const filteredMockedPolicies = MOCKED_POLICIES.filter(
    policyFilterStatusPredicate
  );

  render(<App />);
  // get first page of table
  const firtsPage = filteredMockedPolicies.slice(0, PAGE_SIZE);

  // wait until the first entry is rendered on the first page
  expect(
    await screen.findByText(getNameOnPolicy(firtsPage[0]))
  ).toBeInTheDocument();

  const insuranceTypesOnFirstPage = Array.from(
    new Set(firtsPage.map((policy) => policy.insuranceType))
  );

  for (const type of insuranceTypesOnFirstPage) {
    // check that all of these types are visible
    expect(
      screen.queryAllByText(KEY_STRINGS_MAP.insuranceType[type])[0]
    ).toBeInTheDocument();
  }

  // Choose the first insurance type to filter after
  const insuranceTypeToFilterAfter = insuranceTypesOnFirstPage[0];

  // put the insurance type to filter after into the insurance type input
  const insuranceTypeInput = screen.getByLabelText("Type:");
  await waitFor(() => {
    fireEvent.change(insuranceTypeInput, {
      target: { value: insuranceTypeToFilterAfter },
    });
  });

  // wait a bit
  await new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, 200);
  });

  const table = document.getElementById("table");
  if (!table) throw new Error("Table not found");

  // check that the other types are no longer visible
  insuranceTypesOnFirstPage.slice(1).forEach((insuranceType) => {
    expect(
      within(table).queryByText(KEY_STRINGS_MAP.insuranceType[insuranceType])
    ).not.toBeInTheDocument();
  });

  expect(
    within(table).queryAllByText(
      KEY_STRINGS_MAP.insuranceType[insuranceTypeToFilterAfter]
    )[0]
  ).toBeInTheDocument();
});

test("filters the table by status via the status select input", async () => {
  const filteredMockedPolicies = MOCKED_POLICIES.filter(
    policyFilterStatusPredicate
  );

  render(<App />);
  // get first page of table
  const firtsPage = filteredMockedPolicies.slice(0, PAGE_SIZE);

  // wait until the first entry is rendered on the first page
  expect(
    await screen.findByText(getNameOnPolicy(firtsPage[0]))
  ).toBeInTheDocument();

  const statusesOnFirstPage = Array.from(
    new Set(firtsPage.map((policy) => policy.status))
  );

  for (const status of statusesOnFirstPage) {
    // check that all of these statuses are visible
    expect(screen.queryAllByText(status)[0]).toBeInTheDocument();
  }

  // Choose the first status to filter after
  const statusToFilterAfter = statusesOnFirstPage[0];

  // put the status to filter after into the status input
  const statusInput = screen.getByLabelText("Status:");
  await waitFor(() => {
    fireEvent.change(statusInput, {
      target: { value: statusToFilterAfter },
    });
  });

  // wait a bit
  await new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, 200);
  });

  const table = document.getElementById("table");
  if (!table) throw new Error("Table not found");

  // check that the other statuses are no longer visible
  statusesOnFirstPage.slice(1).forEach((status) => {
    expect(within(table).queryByText(status)).not.toBeInTheDocument();
  });

  // check that the status to filter after is visible
  expect(
    within(table).queryAllByText(statusToFilterAfter)[0]
  ).toBeInTheDocument();
});

test("resets the filters and the table when the reset button is clicked", async () => {
  const filteredMockedPolicies = MOCKED_POLICIES.filter(
    policyFilterStatusPredicate
  );

  render(<App />);
  // get first page of table
  const firtsPage = filteredMockedPolicies.slice(0, PAGE_SIZE);

  // wait until the first entry is rendered on the first page
  expect(
    await screen.findByText(getNameOnPolicy(firtsPage[0]))
  ).toBeInTheDocument();

  const statusesOnFirstPage = Array.from(
    new Set(firtsPage.map((policy) => policy.status))
  );

  for (const status of statusesOnFirstPage) {
    // check that all of these statuses are visible
    expect(screen.queryAllByText(status)[0]).toBeInTheDocument();
  }

  // Choose the first status to filter after
  const statusToFilterAfter = statusesOnFirstPage[0];

  // put the status to filter after into the status input
  const statusInput = screen.getByLabelText("Status:");
  await waitFor(() => {
    fireEvent.change(statusInput, {
      target: { value: statusToFilterAfter },
    });
  });

  // wait a bit
  await new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, 200);
  });

  const table = document.getElementById("table");
  if (!table) throw new Error("Table not found");

  // check that the other statuses are no longer visible
  statusesOnFirstPage.slice(1).forEach((status) => {
    expect(within(table).queryByText(status)).not.toBeInTheDocument();
  });

  // check that the status to filter after is visible
  expect(
    within(table).queryAllByText(statusToFilterAfter)[0]
  ).toBeInTheDocument();

  // click the clear filters button
  const clearFiltersButton = screen.getByRole("button", {
    name: "Clear filters",
  });
  await waitFor(() => {
    fireEvent.click(clearFiltersButton);
  });

  // check that all statuses from the first page are visible again
  for (const status of statusesOnFirstPage) {
    // check that all of these statuses are visible
    expect((await screen.findAllByText(status))[0]).toBeInTheDocument();
  }
});
