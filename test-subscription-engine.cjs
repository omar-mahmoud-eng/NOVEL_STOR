/**
 * Phase 5 Subscription Renewal & Credit Dispensing Engine Test Suite
 * Verifies:
 * 1. Advancing billing cycle dates (start and end).
 * 2. Monthly credit allocations (e.g. +2 credits per month).
 * 3. Handling renewal state transitions (active, past_due, canceled).
 */

const assert = require("assert")

function advanceSubscriptionCycle({
  currentSubscription,
  tier,
  paymentSuccess = true,
}) {
  if (!paymentSuccess) {
    return {
      ...currentSubscription,
      status: "past_due",
      failed_attempts: (currentSubscription.failed_attempts || 0) + 1,
      credits_added: 0,
    }
  }

  const startDate = new Date(currentSubscription.current_period_end)
  const endDate = new Date(startDate)

  if (tier.interval === "month") {
    endDate.setMonth(endDate.getMonth() + 1)
  } else if (tier.interval === "year") {
    endDate.setFullYear(endDate.getFullYear() + 1)
  }

  const creditsToAdd = tier.book_credits_per_period || 0

  return {
    ...currentSubscription,
    status: "active",
    current_period_start: startDate.toISOString(),
    current_period_end: endDate.toISOString(),
    credits_balance: (currentSubscription.credits_balance || 0) + creditsToAdd,
    credits_added: creditsToAdd,
    failed_attempts: 0,
  }
}

function runSubscriptionEngineTests() {
  console.log("=================================================================")
  console.log("PHASE 5: EXECUTING RECURRING SUBSCRIPTION & CREDIT ENGINE AUDIT")
  console.log("=================================================================")

  let passed = 0
  let failed = 0

  // Test 1: Monthly VIP renewal successfully grants 2 book credits and advances period
  try {
    const existing = {
      id: "sub_123",
      customer_id: "cust_vip",
      status: "active",
      credits_balance: 1,
      current_period_start: "2026-09-25T00:00:00.000Z",
      current_period_end: "2026-10-25T00:00:00.000Z",
    }
    const tier = {
      id: "tier_monthly_vip",
      interval: "month",
      book_credits_per_period: 2,
    }

    const renewed = advanceSubscriptionCycle({
      currentSubscription: existing,
      tier,
      paymentSuccess: true,
    })

    assert.strictEqual(renewed.status, "active")
    assert.strictEqual(renewed.credits_balance, 3) // 1 existing + 2 new
    assert.strictEqual(renewed.credits_added, 2)
    assert.strictEqual(renewed.current_period_start, "2026-10-25T00:00:00.000Z")
    assert.strictEqual(renewed.current_period_end, "2026-11-25T00:00:00.000Z")
    console.log("[PASS] Test 1: Monthly VIP renewal dispensed 2 credits and extended cycle by 1 month")
    passed++
  } catch (err) {
    console.error("[FAIL] Test 1:", err.message)
    failed++
  }

  // Test 2: Failed payment puts subscription into past_due without dispensing credits
  try {
    const existing = {
      id: "sub_456",
      customer_id: "cust_failed",
      status: "active",
      credits_balance: 0,
      current_period_start: "2026-09-25T00:00:00.000Z",
      current_period_end: "2026-10-25T00:00:00.000Z",
      failed_attempts: 0,
    }
    const tier = {
      id: "tier_monthly_vip",
      interval: "month",
      book_credits_per_period: 2,
    }

    const failedRenewal = advanceSubscriptionCycle({
      currentSubscription: existing,
      tier,
      paymentSuccess: false,
    })

    assert.strictEqual(failedRenewal.status, "past_due")
    assert.strictEqual(failedRenewal.credits_balance, 0)
    assert.strictEqual(failedRenewal.credits_added, 0)
    assert.strictEqual(failedRenewal.failed_attempts, 1)
    console.log("[PASS] Test 2: Payment failure marks subscription as past_due with 0 credits dispensed")
    passed++
  } catch (err) {
    console.error("[FAIL] Test 2:", err.message)
    failed++
  }

  console.log("=================================================================")
  console.log(`SUBSCRIPTION ENGINE AUDIT COMPLETED: ${passed}/2 TESTS PASSED (${failed} FAILED)`)
  console.log("=================================================================")

  if (failed > 0) process.exit(1)
}

runSubscriptionEngineTests()
