# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: setup/auth.setup.ts >> authenticate
- Location: e2e/setup/auth.setup.ts:5:6

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/overview" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - region "Notifications alt+T"
  - generic [ref=e2]:
    - generic [ref=e3]:
      - text: Ledgr
      - paragraph [ref=e4]: Sign in to your account
    - generic [ref=e7]:
      - generic [ref=e9]:
        - button "Continue with Google" [ref=e10] [cursor=pointer]:
          - generic [ref=e11]:
            - img [ref=e12]
            - text: Continue with Google
        - generic [ref=e19]: or
        - generic [ref=e21]:
          - generic [ref=e22]:
            - generic [ref=e23]: Email
            - textbox "Email" [ref=e24]:
              - /placeholder: you@example.com
              - text: toluo@gmail.com
          - generic [ref=e25]:
            - generic [ref=e26]:
              - generic [ref=e27]: Password
              - link "Forgot password?" [ref=e28] [cursor=pointer]:
                - /url: /forgot-password
            - generic [ref=e29]:
              - textbox "Password" [ref=e30]:
                - /placeholder: ••••••••
                - text: qwerty1234
              - button [ref=e31]:
                - img [ref=e32]
          - button "Sign in" [ref=e35] [cursor=pointer]:
            - generic [ref=e36]: Sign in
      - paragraph [ref=e37]:
        - text: Don't have an account?
        - link "Create one" [ref=e38] [cursor=pointer]:
          - /url: /register
  - generic [ref=e43] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e44]:
      - img [ref=e45]
    - generic [ref=e48]:
      - button "Open issues overlay" [ref=e49]:
        - generic [ref=e50]:
          - generic [ref=e51]: "0"
          - generic [ref=e52]: "1"
        - generic [ref=e53]: Issue
      - button "Collapse issues badge" [ref=e54]:
        - img [ref=e55]
  - alert [ref=e57]
```

# Test source

```ts
  1  | import { test as setup } from "@playwright/test";
  2  | 
  3  | const authFile = "playwright/.auth/user.json";
  4  | 
  5  | setup("authenticate", async ({ page }) => {
  6  |   await page.goto("http://localhost:3000/login");
  7  |   await page.fill("#email", "toluo@gmail.com");
  8  |   await page.fill("#password", "qwerty1234");
  9  |   await page.click('button[type="submit"]');
> 10 |   await page.waitForURL("**/overview");
     |              ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  11 | 
  12 |   await page.context().storageState({ path: authFile });
  13 | });
  14 | 
```