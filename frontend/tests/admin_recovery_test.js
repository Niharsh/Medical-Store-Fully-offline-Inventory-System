const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Adjust if your dev server runs on a different port
  const base = process.env.BASE_URL || "http://localhost:5173";

  try {
    console.log("Opening login page...");
    await page.goto(`${base}/login`, { waitUntil: "domcontentloaded" });

    // Pre-seed the admin recovery code locally (as would be done via Settings)
    await page.evaluate(() => {
      localStorage.setItem("admin_recovery_code", "TESTCODE123");
    });

    // Navigate through the admin recovery flow
    await page.click("text=Forgot Password?");
    await page.waitForURL("**/forgot-password");

    // Choose Admin Code option
    await page.click("text=Reset using Admin Code");
    await page.waitForURL("**/forgot-password/admin");

    // Proceed to verification
    await page.click("text=Proceed to Admin Code Verification");
    await page.waitForURL("**/forgot-password/admin/verify");

    // Enter code and verify
    await page.fill('input[placeholder="Admin Recovery Code"]', "TESTCODE123");
    await page.click("text=Verify Code");

    // Should go to set-new-password
    await page.waitForURL("**/forgot-password/admin/reset");

    // Enter email and set a new password locally
    const testEmail = "owner@example.test";
    const testPassword = "NewPass123!";

    await page.fill('input[placeholder="Account Email"]', testEmail);
    await page.fill('input[placeholder="New Password"]', testPassword);
    await page.fill('input[placeholder="Confirm Password"]', testPassword);
    await page.click("text=Set Password Locally");

    // After submission we should land back on login
    await page.waitForURL("**/login");

    // Now attempt to log in using new credentials (this should pass via local override)
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click("text=Login");

    // Wait a little for redirection (dashboard) – allow for server or local fallback
    await page.waitForTimeout(1500);

    const finalUrl = page.url();
    console.log("Final URL after login:", finalUrl);

    const passed = finalUrl.includes("/dashboard");
    console.log(
      passed ? "ADMIN RECOVERY TEST: PASSED" : "ADMIN RECOVERY TEST: FAILED",
    );

    await browser.close();
    process.exit(passed ? 0 : 1);
  } catch (err) {
    console.error("Test failed with error:", err);
    await browser.close();
    process.exit(2);
  }
})();
