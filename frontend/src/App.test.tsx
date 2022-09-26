import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MOCKED_POLICIES } from "./api/policies";
import App from "./App";
import { KEY_STRINGS_MAP } from "./i18n";
import { TPolicy } from "./models";
import { getNameOnPolicy, PAGE_SIZE } from "./Table";

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
