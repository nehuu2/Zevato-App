process.env.NODE_ENV = 'test';
process.env.TEST_RUN = 'true';
import http from 'http';
import app from '../src/server';

let server: http.Server;
const PORT = 4099;
const BASE_URL = `http://localhost:${PORT}/api`;

const userAToken = 'test_user_alpha_001';
const userBToken = 'test_user_beta_002';

function request(
  method: string,
  path: string,
  body?: any,
  token?: string
): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      url.toString(),
      {
        method,
        headers,
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const data = JSON.parse(rawData);
            resolve({ status: res.statusCode || 500, data });
          } catch {
            resolve({ status: res.statusCode || 500, data: rawData });
          }
        });
      }
    );

    req.on('error', (e) => reject(e));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Zevota Backend API Comprehensive Test Suite...\n');
  server = app.listen(PORT);

  try {
    // 1. Health Check
    console.log('Test 1: GET /api/health');
    const health = await request('GET', '/api/health');
    if (health.status !== 200 || health.data.status !== 'online') {
      throw new Error(`Health check failed: ${JSON.stringify(health)}`);
    }
    console.log('  ✅ Server is healthy and online\n');

    // 2. Unauthenticated request rejection
    console.log('Test 2: GET /api/me without token -> 401 Unauthorized');
    const unauth = await request('GET', '/api/me');
    if (unauth.status !== 401) {
      throw new Error(`Expected 401, got ${unauth.status}`);
    }
    console.log('  ✅ Unauthenticated requests properly rejected with 401\n');

    // 3. User A Auto-Provisioning & Profile
    console.log('Test 3: GET /api/me with User A token');
    const meA = await request('GET', '/api/me', undefined, userAToken);
    if (meA.status !== 200 || !meA.data.data.id) {
      throw new Error(`User A provisioning failed: ${JSON.stringify(meA)}`);
    }
    console.log(`  ✅ User A provisioned: id=${meA.data.data.id}, clerkUserId=${meA.data.data.clerkUserId}\n`);

    // 4. Update Profile
    console.log('Test 4: PATCH /api/me -> Update profile for User A');
    const updateProfile = await request(
      'PATCH',
      '/api/me',
      { name: 'Arjun Sharma', phone: '+91 98765 43210', profileCompleted: true },
      userAToken
    );
    if (updateProfile.status !== 200 || updateProfile.data.data.name !== 'Arjun Sharma') {
      throw new Error(`Profile update failed: ${JSON.stringify(updateProfile)}`);
    }
    console.log('  ✅ Profile updated and persisted\n');

    // 5. Address CRUD for User A
    console.log('Test 5: POST /api/addresses -> Create Address for User A');
    const createAddr = await request(
      'POST',
      '/api/addresses',
      {
        label: 'Home',
        street: 'Flat 402, Tower B, Palm Grove',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122001',
        isDefault: true,
      },
      userAToken
    );
    if (createAddr.status !== 201 || !createAddr.data.data.id) {
      throw new Error(`Address creation failed: ${JSON.stringify(createAddr)}`);
    }
    const userAAddressId = createAddr.data.data.id;
    console.log(`  ✅ Address created: id=${userAAddressId}\n`);

    console.log('Test 5b: GET /api/addresses -> List User A addresses');
    const listAddr = await request('GET', '/api/addresses', undefined, userAToken);
    if (listAddr.status !== 200 || listAddr.data.data.length === 0) {
      throw new Error(`List addresses failed: ${JSON.stringify(listAddr)}`);
    }
    console.log(`  ✅ Retrieved ${listAddr.data.data.length} addresses for User A\n`);

    // 6. Catalog Endpoints
    console.log('Test 6: GET /api/categories');
    const cats = await request('GET', '/api/categories');
    if (cats.status !== 200 || cats.data.data.length < 8) {
      throw new Error(`Category listing failed: ${JSON.stringify(cats)}`);
    }
    console.log(`  ✅ Retrieved ${cats.data.data.length} categories`);

    console.log('Test 6b: GET /api/services?categoryId=ac');
    const srvs = await request('GET', '/api/services?categoryId=ac');
    if (srvs.status !== 200 || srvs.data.data.length === 0) {
      throw new Error(`Service listing failed: ${JSON.stringify(srvs)}`);
    }
    console.log(`  ✅ Retrieved ${srvs.data.data.length} services for AC\n`);

    // 7. Booking Creation for User A
    console.log('Test 7: POST /api/bookings -> Create Booking for User A');
    const createBooking = await request(
      'POST',
      '/api/bookings',
      {
        serviceOptionId: 'ac-foam-jet',
        addressId: userAAddressId,
        scheduledDate: 'Tomorrow',
        scheduledTimeSlot: '02:00 PM - 04:00 PM',
        paymentMethod: 'UPI Instant Pay',
        notes: 'Please bring ladder.',
      },
      userAToken
    );
    if (createBooking.status !== 201 || !createBooking.data.data.id) {
      throw new Error(`Booking creation failed: ${JSON.stringify(createBooking)}`);
    }
    const bookingA = createBooking.data.data;
    console.log(`  ✅ Booking created: ${bookingA.id} (${bookingA.serviceName}), Total: ₹${bookingA.totalAmount}\n`);

    // 8. Booking Status Update & History
    console.log('Test 8: PATCH /api/bookings/:id/status -> Update status to technician_assigned and in_progress');
    const statusUpdate = await request(
      'PATCH',
      `/api/bookings/${bookingA.id}/status`,
      { status: 'in_progress', note: 'Technician reached site and begun service.' },
      userAToken
    );
    if (statusUpdate.status !== 200 || statusUpdate.data.data.status !== 'in_progress') {
      throw new Error(`Status update failed: ${JSON.stringify(statusUpdate)}`);
    }
    console.log(`  ✅ Status updated to in_progress, history count: ${statusUpdate.data.data.statusHistory.length}\n`);

    // 9. Invoice Verification
    console.log('Test 9: GET /api/bookings/:id/invoice -> Retrieve authoritative invoice');
    const invoiceRes = await request('GET', `/api/bookings/${bookingA.id}/invoice`, undefined, userAToken);
    if (invoiceRes.status !== 200 || !invoiceRes.data.data.invoiceNumber || invoiceRes.data.data.total !== 499) {
      throw new Error(`Invoice retrieval failed: ${JSON.stringify(invoiceRes)}`);
    }
    console.log(`  ✅ Invoice verified: ${invoiceRes.data.data.invoiceNumber}, Subtotal: ₹${invoiceRes.data.data.subtotal}, CGST: ₹${invoiceRes.data.data.cgst}, SGST: ₹${invoiceRes.data.data.sgst}, Total: ₹${invoiceRes.data.data.total}\n`);

    // 10. Service Report
    console.log('Test 10: POST /api/bookings/:id/report -> Save service report');
    const reportRes = await request(
      'POST',
      `/api/bookings/${bookingA.id}/report`,
      {
        technicianNotes: 'Cleaned indoor coils, cleared drain tray, checked cooling pressure.',
        partsReplaced: ['Coil Filter Mesh'],
        ratingGiven: 5,
      },
      userAToken
    );
    if (reportRes.status !== 200) {
      throw new Error(`Report save failed: ${JSON.stringify(reportRes)}`);
    }
    console.log('  ✅ Service report saved\n');

    // 11. Cancellation
    console.log('Test 11: POST /api/bookings/:id/cancel -> Cancel booking');
    const cancelRes = await request(
      'POST',
      `/api/bookings/${bookingA.id}/cancel`,
      { reason: 'Need to reschedule for next week.' },
      userAToken
    );
    if (cancelRes.status !== 200 || cancelRes.data.data.status !== 'cancelled') {
      throw new Error(`Cancellation failed: ${JSON.stringify(cancelRes)}`);
    }
    console.log(`  ✅ Booking cancelled: reason="${cancelRes.data.data.cancellationReason}"\n`);

    // 12. Security & User Isolation
    console.log('Test 12: SECURITY ISOLATION CHECK: User B attempts to access User A data');
    const userBAccessingUserABooking = await request(
      'GET',
      `/api/bookings/${bookingA.id}`,
      undefined,
      userBToken
    );
    if (userBAccessingUserABooking.status !== 404 && userBAccessingUserABooking.status !== 403) {
      throw new Error(`SECURITY VIOLATION! User B was able to access User A booking with status ${userBAccessingUserABooking.status}`);
    }
    console.log(`  ✅ User B blocked from accessing User A booking (Status: ${userBAccessingUserABooking.status})`);

    const userBAccessingUserAInvoice = await request(
      'GET',
      `/api/bookings/${bookingA.id}/invoice`,
      undefined,
      userBToken
    );
    if (userBAccessingUserAInvoice.status !== 404 && userBAccessingUserAInvoice.status !== 403) {
      throw new Error(`SECURITY VIOLATION! User B was able to access User A invoice with status ${userBAccessingUserAInvoice.status}`);
    }
    console.log(`  ✅ User B blocked from accessing User A invoice (Status: ${userBAccessingUserAInvoice.status})`);

    const userBAccessingUserAAddress = await request(
      'DELETE',
      `/api/addresses/${userAAddressId}`,
      undefined,
      userBToken
    );
    if (userBAccessingUserAAddress.status !== 404 && userBAccessingUserAAddress.status !== 403) {
      throw new Error(`SECURITY VIOLATION! User B was able to delete User A address with status ${userBAccessingUserAAddress.status}`);
    }
    console.log(`  ✅ User B blocked from deleting User A address (Status: ${userBAccessingUserAAddress.status})\n`);

    console.log('====================================================');
    console.log('🎉 ALL 12 BACKEND INTEGRATION & SECURITY TESTS PASSED!');
    console.log('====================================================');
  } finally {
    server.close();
  }
}

runTests().catch((e) => {
  console.error('❌ Test failed with error:', e);
  if (server) server.close();
  process.exit(1);
});
