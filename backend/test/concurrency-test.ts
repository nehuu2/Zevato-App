process.env.NODE_ENV = 'test';
process.env.TEST_RUN = 'true';

import http from 'http';
import { io as ioClient } from 'socket.io-client';
import app from '../src/server';
import { initSocket } from '../src/socket';
import { prisma } from '../src/config';

let server: http.Server;
const PORT = 4097;
const BASE_URL = `http://localhost:${PORT}/api`;
const WS_URL = `http://localhost:${PORT}`;

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

async function runConcurrencyTests() {
  console.log('🧪 Starting SQLite Concurrency & Race-Condition Test Suite...\n');

  server = http.createServer(app);
  initSocket(server);
  await new Promise<void>((resolve) => server.listen(PORT, resolve));

  const uniqueSuffix = Date.now();
  const testNewUserToken = `test_user_concurrent_${uniqueSuffix}`;

  try {
    console.log(`Test 1: Simulating 10 simultaneous parallel requests + WebSocket connection for brand new user "${testNewUserToken}"...`);

    // Clean up if already exists
    await prisma.user.deleteMany({ where: { clerkUserId: testNewUserToken } });

    const wsPromise = new Promise<boolean>((resolve, reject) => {
      const socket = ioClient(WS_URL, {
        auth: { token: testNewUserToken },
        transports: ['websocket'],
        forceNew: true,
        timeout: 5000,
      });

      socket.on('connect', () => {
        socket.close();
        resolve(true);
      });
      socket.on('connect_error', (err) => {
        socket.close();
        reject(err);
      });
    });

    const parallelRequests = [
      request('GET', '/api/me', undefined, testNewUserToken),
      request('GET', '/api/bookings', undefined, testNewUserToken),
      request('GET', '/api/addresses', undefined, testNewUserToken),
      request('POST', '/api/notifications/register-token', { token: `ExponentPushToken[Test_${uniqueSuffix}]`, platform: 'android' }, testNewUserToken),
      request('GET', '/api/me', undefined, testNewUserToken),
      request('GET', '/api/bookings?status=active', undefined, testNewUserToken),
      request('GET', '/api/addresses', undefined, testNewUserToken),
      request('GET', '/api/me', undefined, testNewUserToken),
      request('GET', '/api/bookings?status=completed', undefined, testNewUserToken),
      request('POST', '/api/addresses', { label: 'Office', street: '100 Tech Park', city: 'Gurugram', pincode: '122001' }, testNewUserToken),
    ];

    const results = await Promise.all([wsPromise, ...parallelRequests]);
    const wsSuccess = results[0];
    const httpResponses = results.slice(1) as { status: number; data: any }[];

    console.log(`  🔌 WebSocket Connection: ${wsSuccess ? 'SUCCESS' : 'FAILED'}`);

    let failedCount = 0;
    httpResponses.forEach((res, index) => {
      const isSuccess = res.status >= 200 && res.status < 300;
      if (!isSuccess) {
        failedCount++;
        console.error(`  ❌ Request ${index + 1} failed: Status ${res.status}, Body:`, res.data);
      } else {
        console.log(`  ✅ Request ${index + 1} succeeded: Status ${res.status}`);
      }
    });

    if (failedCount > 0) {
      throw new Error(`${failedCount} concurrent requests failed due to race condition!`);
    }

    // Verify SQLite user record
    const userInDb = await prisma.user.findUnique({
      where: { clerkUserId: testNewUserToken },
      include: { addresses: true, pushTokens: true },
    });

    if (!userInDb) {
      throw new Error('User was not found in SQLite database after concurrent provisioning!');
    }

    console.log(`\n  ✅ User properly persisted in SQLite database: id=${userInDb.id}, clerkUserId=${userInDb.clerkUserId}`);
    console.log(`  ✅ Addresses attached to user: ${userInDb.addresses.length}`);
    console.log(`  ✅ Push tokens attached to user: ${userInDb.pushTokens.length}\n`);

    console.log('====================================================');
    console.log('🎉 CONCURRENCY TEST PASSED! ZERO RACE CONDITIONS OR 500 ERRORS!');
    console.log('====================================================');
  } finally {
    if (server) server.close();
    process.exit(0);
  }
}

runConcurrencyTests().catch((e) => {
  console.error('❌ Concurrency test failed:', e);
  if (server) server.close();
  process.exit(1);
});
