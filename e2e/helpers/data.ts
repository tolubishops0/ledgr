import { Page } from "@playwright/test";

export async function mockOverview(page: Page) {
  await page.route("**/rest/v1/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        totalBalance: 14500,
        income: 50000,
        expenses: 35500,
      }),
    });
  });

  await page.route("**/api/transactions", async (route) => {
    const transactions = [
      {
        id: "t1",
        user_id: "u1",
        amount: 8000,
        type: "expense",
        category_id: "c1",
        description: "Food - groceries",
        date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
      {
        id: "t2",
        user_id: "u1",
        amount: 1000,
        type: "expense",
        category_id: "c2",
        description: "Transport",
        date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
    ];

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(transactions),
    });
  });

  await page.route("**/api/budgets", async (route) => {
    const budgets = [
      {
        id: "b1",
        user_id: "u1",
        category_id: "c1",
        amount: 20000,
        month: "2026-04",
        created_at: new Date().toISOString(),
      },
      {
        id: "b2",
        user_id: "u1",
        category_id: "c2",
        amount: 10000,
        month: "2026-04",
        created_at: new Date().toISOString(),
      },
    ];

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(budgets),
    });
  });

  await page.addStyleTag({
    content: `[role="dialog"], .backdrop-blur-sm, [class*="toast"] { display: none !important; pointer-events: none !important; }`,
  });
}
