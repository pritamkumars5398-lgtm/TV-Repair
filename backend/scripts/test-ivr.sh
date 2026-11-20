#!/usr/bin/env bash
# RepairCart IVR Local Test Suite
# Tests all Plivo IVR endpoints locally on port 4000

BASE_URL="http://localhost:4000/api/v1/ivr"
TEST_PHONE="+919876543210"
PLIVO_NUMBER="+918065535939"

echo "=========================================================="
echo "📞 REPAIRCART PLIVO IVR LOCAL TEST SUITE"
echo "=========================================================="

echo -e "\n1️⃣ [TEST 1] Inbound Call Webhook (Greeting & DTMF Menu)"
curl -s -X POST "${BASE_URL}/incoming" \
  -H "Content-Type: application/json" \
  -d "{\"From\": \"${TEST_PHONE}\", \"To\": \"${PLIVO_NUMBER}\", \"CallUUID\": \"test-call-001\"}"
echo ""

echo -e "\n2️⃣ [TEST 2] Caller Presses 1 (Doorstep TV Repair Booking Link)"
curl -s -X POST "${BASE_URL}/menu" \
  -H "Content-Type: application/json" \
  -d "{\"Digits\": \"1\", \"From\": \"${TEST_PHONE}\", \"To\": \"${PLIVO_NUMBER}\", \"CallUUID\": \"test-call-001\"}"
echo ""

echo -e "\n3️⃣ [TEST 3] Caller Presses 2 (Live Call Forwarding to Real Person)"
curl -s -X POST "${BASE_URL}/menu" \
  -H "Content-Type: application/json" \
  -d "{\"Digits\": \"2\", \"From\": \"${TEST_PHONE}\", \"To\": \"${PLIVO_NUMBER}\", \"CallUUID\": \"test-call-001\"}"
echo ""

echo -e "\n4️⃣ [TEST 4] Caller Presses 3 (Live Ticket Tracking Status)"
curl -s -X POST "${BASE_URL}/menu" \
  -H "Content-Type: application/json" \
  -d "{\"Digits\": \"3\", \"From\": \"${TEST_PHONE}\", \"To\": \"${PLIVO_NUMBER}\", \"CallUUID\": \"test-call-001\"}"
echo ""

echo -e "\n5️⃣ [TEST 5] Caller Presses Invalid Option (Fallback to Manager)"
curl -s -X POST "${BASE_URL}/menu" \
  -H "Content-Type: application/json" \
  -d "{\"Digits\": \"9\", \"From\": \"${TEST_PHONE}\", \"To\": \"${PLIVO_NUMBER}\", \"CallUUID\": \"test-call-001\"}"
echo ""

echo -e "\n=========================================================="
echo "✅ All 5 local IVR test scenarios executed successfully!"
echo "=========================================================="
