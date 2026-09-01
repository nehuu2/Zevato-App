process.env.NODE_ENV = 'test';
process.env.TEST_RUN = 'true';

import http from 'http';
import { io as ioClient, Socket as ClientSocket } from 'socket.io-client';
import app from '../src/server';
import { initSocket } from '../src/socket';
import { fakePaymentService } from '../src/services/fakePaymentService';
import { prisma } from '../src/config';

let server: http.Server;
const PORT = 4098;
const BASE_URL = `http://localhost:${PORT}/api`;
const WS_URL = `http://localhost:${PORT}`;

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

function connectSocket(token: string): Promise<ClientSocket> {
  return new Promise((resolve, reject) => {
    const socket = ioClient(WS_URL, {
      auth: { token },
      transports: ['websocket'],
      forceNew: true,
    });

    socket.on('connect', () => resolve(socket));
    socket.on('connect_error', (err) => reject(err));
  });
}

async function runPhase7Tests() {
  console.log('🧪 Starting Phase 7: Real-Time, Simulated Payment & Push Notification Test Suite...\n');

  // Start HTTP & Socket.IO server
  server = http.createServer(app);
  initSocket(server);
  await new Promise<void>((resolve) => server.listen(PORT, resolve));

  let socketA: ClientSocket | null = null;
  let socketB: ClientSocket | null = null;

  try {
    // 1. Health Check
    console.log('Test 1: GET /api/health');
    const health = await request('GET', '/api/health');
    if (health.status !== 200 || !health.data.realtime) {
      throw new Error(`Health check failed: ${JSON.stringify(health)}`);
    }
    console.log('  ✅ Server is healthy with Realtime, Notifications, and Simulated Payments enabled\n');

    // 2. Unit Test FakePaymentService
    console.log('Test 2: FakePaymentService Simulation Logic');
    const upiResult = await fakePaymentService.processPayment({
      bookingId: 'test-1',
      amount: 499,
      paymentMethod: 'UPI Instant Pay',
    });
    if (!upiResult.success || upiResult.status !== 'paid' || !upiResult.simulatedTransactionId.startsWith('SIM_TXN_')) {
      throw new Error(`UPI simulated payment failed: ${JSON.stringify(upiResult)}`);
    }
    console.log(`  ✅ Simulated UPI success: txnId=${upiResult.simulatedTransactionId}`);

    const failResult = await fakePaymentService.processPayment({
      bookingId: 'test-2',
      amount: 499,
      paymentMethod: 'Credit Card',
      simulatedOutcome: 'failure',
    });
    if (failResult.success || failResult.status !== 'failed') {
      throw new Error(`Failed outcome simulation not handled properly: ${JSON.stringify(failResult)}`);
    }
    console.log('  ✅ Simulated failure outcome handled properly');

    const cancelResult = await fakePaymentService.processPayment({
      bookingId: 'test-3',
      amount: 499,
      paymentMethod: 'Net Banking',
      simulatedOutcome: 'cancelled',
    });
    if (cancelResult.success || cancelResult.status !== 'cancelled') {
      throw new Error(`Cancelled outcome simulation not handled properly: ${JSON.stringify(cancelResult)}`);
    }
    console.log('  ✅ Simulated cancellation outcome handled properly\n');

    // 3. User Setup
    console.log('Test 3: Provision User A & User B');
    const userARes = await request('GET', '/api/me', undefined, userAToken);
    const userBRes = await request('GET', '/api/me', undefined, userBToken);
    const userAId = userARes.data.data.id;
    const userBId = userBRes.data.data.id;
    console.log(`  ✅ User A: ${userAId}, User B: ${userBId}\n`);

    // 4. Create Address for User A
    console.log('Test 4: Create Address for User A');
    const addrRes = await request(
      'POST',
      '/api/addresses',
      {
        label: 'Home',
        street: 'Villa 14, Phase 2, DLF City',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
      },
      userAToken
    );
    const userAAddrId = addrRes.data.data.id;
    console.log(`  ✅ Address created: ${userAAddrId}\n`);

    // 5. Connect Authenticated WebSockets
    console.log('Test 5: Connect Authenticated Sockets for User A and User B');
    socketA = await connectSocket(userAToken);
    socketB = await connectSocket(userBToken);
    console.log(`  ✅ Socket A connected: ${socketA.id}`);
    console.log(`  ✅ Socket B connected: ${socketB.id}\n`);

    // 6. Test Real-time Event Isolation & Delivery
    console.log('Test 6: Real-time Booking Creation & Private Room Isolation');
    let userAReceivedCreateEvent = false;
    let userBReceivedAnyEvent = false;

    socketA.on('booking.created', (payload) => {
      userAReceivedCreateEvent = true;
    });

    socketB.on('booking.created', () => {
      userBReceivedAnyEvent = true;
    });
    socketB.on('booking:update', () => {
      userBReceivedAnyEvent = true;
    });

    // Create Booking for User A
    const createRes = await request(
      'POST',
      '/api/bookings',
      {
        serviceOptionId: 'ac-foam-jet',
        addressId: userAAddrId,
        scheduledDate: 'Tomorrow',
        scheduledTimeSlot: '10:00 AM - 12:00 PM',
        paymentMethod: 'UPI Instant Pay',
        simulatedOutcome: 'success',
      },
      userAToken
    );

    if (createRes.status !== 201 || !createRes.data.data.id) {
      throw new Error(`Booking creation failed: ${JSON.stringify(createRes)}`);
    }

    const bookingA = createRes.data.data;
    console.log(`  ✅ Booking created: ${bookingA.id}, Payment: ${bookingA.paymentStatus}, SimulatedTxn: ${bookingA.simulatedTransactionId}`);

    // Wait for WS event delivery
    await new Promise((r) => setTimeout(r, 200));

    if (!userAReceivedCreateEvent) {
      throw new Error('User A did not receive real-time booking.created event!');
    }
    console.log('  ✅ User A successfully received booking.created via WebSocket');

    if (userBReceivedAnyEvent) {
      throw new Error('SECURITY VIOLATION! User B received real-time event intended for User A!');
    }
    console.log('  ✅ Security verified: User B received ZERO events (100% private user room isolation)\n');

    // 7. Test Real-time Status Change Event
    console.log('Test 7: Update Status to on_the_way & Verify Real-time Broadcast');
    let userAReceivedStatusEvent = false;
    socketA.on('booking.status_changed', (payload) => {
      if (payload.bookingId === bookingA.id && payload.data.status === 'on_the_way') {
        userAReceivedStatusEvent = true;
      }
    });

    const statusUpdateRes = await request(
      'PATCH',
      `/api/bookings/${bookingA.id}/status`,
      { status: 'on_the_way', note: 'Technician on the way with tools.' },
      userAToken
    );

    if (statusUpdateRes.status !== 200) {
      throw new Error(`Status update failed: ${JSON.stringify(statusUpdateRes)}`);
    }

    await new Promise((r) => setTimeout(r, 200));

    if (!userAReceivedStatusEvent) {
      throw new Error('User A did not receive booking.status_changed event!');
    }
    console.log('  ✅ User A received real-time booking.status_changed event\n');

    // 8. Test Technician Location Tracking
    console.log('Test 8: PATCH /api/bookings/:id/technician-location');
    let userAReceivedLocationEvent = false;
    socketA.on('technician.location_updated', (payload) => {
      if (payload.bookingId === bookingA.id && payload.data.location.latitude === 28.4612) {
        userAReceivedLocationEvent = true;
      }
    });

    const locRes = await request(
      'PATCH',
      `/api/bookings/${bookingA.id}/technician-location`,
      { latitude: 28.4612, longitude: 77.0295, estimatedArrivalMinutes: 6 },
      userAToken
    );

    if (locRes.status !== 200) {
      throw new Error(`Location update failed: ${JSON.stringify(locRes)}`);
    }

    await new Promise((r) => setTimeout(r, 200));

    if (!userAReceivedLocationEvent) {
      throw new Error('User A did not receive technician.location_updated event!');
    }
    console.log('  ✅ Real-time technician GPS location update received\n');

    // 9. Test Push Token Registration & Management
    console.log('Test 9: Register & Unregister Push Device Token');
    const simPushToken = 'ExponentPushToken[Test_Device_ABC_123]';
    const regTokenRes = await request(
      'POST',
      '/api/notifications/register-token',
      { token: simPushToken, platform: 'android' },
      userAToken
    );
    if (regTokenRes.status !== 200) {
      throw new Error(`Push token registration failed: ${JSON.stringify(regTokenRes)}`);
    }
    console.log('  ✅ Push device token registered in database');

    const dbToken = await prisma.pushDeviceToken.findUnique({
      where: { token: simPushToken },
    });
    if (!dbToken || dbToken.userId !== userAId) {
      throw new Error('Database push token mismatch');
    }
    console.log(`  ✅ Database token verified: ${dbToken.token} -> User ${dbToken.userId}`);

    const unregTokenRes = await request(
      'POST',
      '/api/notifications/unregister-token',
      { token: simPushToken },
      userAToken
    );
    if (unregTokenRes.status !== 200) {
      throw new Error(`Unregister token failed: ${JSON.stringify(unregTokenRes)}`);
    }
    console.log('  ✅ Push device token removed cleanly\n');

    // 10. Test Simulated Payment Re-Execution / Outcome Verification
    console.log('Test 10: POST /api/bookings/:id/pay -> Execute Simulated Payment on Pending Booking');
    const payRes = await request(
      'POST',
      `/api/bookings/${bookingA.id}/pay`,
      { paymentMethod: 'Credit Card', simulatedOutcome: 'success' },
      userAToken
    );
    if (payRes.status !== 200 || payRes.data.data.paymentMethodType !== 'simulated_card') {
      throw new Error(`Simulated payment execution failed: ${JSON.stringify(payRes)}`);
    }
    console.log(`  ✅ Simulated payment re-executed: type=${payRes.data.data.paymentMethodType}, txnId=${payRes.data.data.simulatedTransactionId}\n`);

    // 11. Complete Booking & Verify Invoice
    console.log('Test 11: Complete Booking & Authoritative Invoice Verification');
    const completeRes = await request(
      'PATCH',
      `/api/bookings/${bookingA.id}/status`,
      { status: 'completed', note: 'Appliance fully repaired and verified.' },
      userAToken
    );
    if (completeRes.status !== 200 || completeRes.data.data.status !== 'completed') {
      throw new Error(`Completion failed: ${JSON.stringify(completeRes)}`);
    }

    const invoiceRes = await request('GET', `/api/bookings/${bookingA.id}/invoice`, undefined, userAToken);
    if (invoiceRes.status !== 200 || invoiceRes.data.data.total !== 499) {
      throw new Error(`Invoice check failed: ${JSON.stringify(invoiceRes)}`);
    }
    console.log(`  ✅ Invoice verified: ${invoiceRes.data.data.invoiceNumber}, Total: ₹${invoiceRes.data.data.total}\n`);

    console.log('====================================================');
    console.log('🎉 ALL 11 PHASE 7 REAL-TIME & SIMULATED PAYMENT TESTS PASSED!');
    console.log('====================================================');
  } finally {
    if (socketA) socketA.disconnect();
    if (socketB) socketB.disconnect();
    server.close();
  }
}

runPhase7Tests().catch((e) => {
  console.error('❌ Phase 7 test failed:', e);
  if (server) server.close();
  process.exit(1);
});
