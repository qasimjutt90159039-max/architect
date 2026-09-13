/**
 * Archtech Architecture Firm - Backend Automated Verification Test Suite
 * Tests all REST API endpoints, validations, data persistence, and page routing
 */

const http = require('http');
const app = require('../server');

const TEST_PORT = 5055;
let server;

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: TEST_PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          // not json (e.g. HTML)
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          json: json
        });
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('========================================================');
  console.log('  STARTING ARCHTECH BACKEND AUTOMATED VERIFICATION');
  console.log('========================================================\n');

  server = app.listen(TEST_PORT);
  let passed = 0;
  let failed = 0;

  async function assertTest(name, fn) {
    try {
      await fn();
      console.log(`✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // 1. Static Pages Tests
  await assertTest('GET / (Home) returns HTTP 200 HTML', async () => {
    const res = await request('GET', '/');
    if (res.statusCode !== 200 || !res.data.includes('Archtech')) throw new Error(`Status ${res.statusCode}`);
  });

  await assertTest('GET /about returns HTTP 200 HTML', async () => {
    const res = await request('GET', '/about');
    if (res.statusCode !== 200 || !res.data.includes('About Archtech')) throw new Error(`Status ${res.statusCode}`);
  });

  await assertTest('GET /services returns HTTP 200 HTML', async () => {
    const res = await request('GET', '/services');
    if (res.statusCode !== 200 || !res.data.includes('Architectural Services')) throw new Error(`Status ${res.statusCode}`);
  });

  await assertTest('GET /projects returns HTTP 200 HTML', async () => {
    const res = await request('GET', '/projects');
    if (res.statusCode !== 200 || !res.data.includes('Project Portfolio')) throw new Error(`Status ${res.statusCode}`);
  });

  await assertTest('GET /team returns HTTP 200 HTML', async () => {
    const res = await request('GET', '/team');
    if (res.statusCode !== 200 || !res.data.includes('Studio Leadership')) throw new Error(`Status ${res.statusCode}`);
  });

  await assertTest('GET /testimonials returns HTTP 200 HTML', async () => {
    const res = await request('GET', '/testimonials');
    if (res.statusCode !== 200 || !res.data.includes('Client Endorsements')) throw new Error(`Status ${res.statusCode}`);
  });

  await assertTest('GET /contact returns HTTP 200 HTML', async () => {
    const res = await request('GET', '/contact');
    if (res.statusCode !== 200 || !res.data.includes('Initiate Your Commission')) throw new Error(`Status ${res.statusCode}`);
  });

  await assertTest('GET /admin returns HTTP 200 HTML', async () => {
    const res = await request('GET', '/admin');
    if (res.statusCode !== 200 || !res.data.includes('Studio Command')) throw new Error(`Status ${res.statusCode}`);
  });

  await assertTest('GET /random-page returns HTTP 404 custom branded HTML', async () => {
    const res = await request('GET', '/random-page');
    if (res.statusCode !== 404 || !res.data.includes('Spatial Blueprint Not Found')) throw new Error(`Status ${res.statusCode}`);
  });

  // 2. Projects API Tests
  await assertTest('GET /api/projects returns all 9 projects', async () => {
    const res = await request('GET', '/api/projects');
    if (res.statusCode !== 200 || !res.json.success || res.json.count < 9) {
      throw new Error(`Expected >= 9 projects, got ${res.json ? res.json.count : 'no json'}`);
    }
  });

  await assertTest('GET /api/projects?category=residential filters properly', async () => {
    const res = await request('GET', '/api/projects?category=residential');
    if (res.statusCode !== 200 || !res.json.success) throw new Error('Failed response');
    const allRes = res.json.data.every(p => p.category === 'residential');
    if (!allRes) throw new Error('Not all returned projects were residential');
  });

  await assertTest('GET /api/projects/res-01 returns Travertine Pavilion', async () => {
    const res = await request('GET', '/api/projects/res-01');
    if (res.statusCode !== 200 || res.json.data.title !== 'The Travertine Pavilion') {
      throw new Error('Project title did not match');
    }
  });

  await assertTest('GET /api/projects/non-existent returns HTTP 404 JSON', async () => {
    const res = await request('GET', '/api/projects/fake-id');
    if (res.statusCode !== 404 || res.json.success !== false) throw new Error('Expected 404');
  });

  // 3. Contact Form Submission API Tests
  let createdInquiryId = null;
  await assertTest('POST /api/contact with valid data creates inquiry', async () => {
    const payload = {
      name: 'Chaudhry Kamran Nawaz',
      email: 'kamran.nawaz@heritage.org.pk',
      phone: '+92 300 8472910',
      typology: 'residential',
      area: '1 Kanal / 5,200 sq.ft',
      location: 'DHA Phase 6, Lahore',
      message: 'Requesting consultation regarding a bioclimatic residence with internal brick courtyards.'
    };
    const res = await request('POST', '/api/contact', payload);
    if (res.statusCode !== 201 || !res.json.success || !res.json.inquiryId.startsWith('ARCH-INQ-')) {
      throw new Error(`Invalid response: ${JSON.stringify(res.json)}`);
    }
    createdInquiryId = res.json.inquiryId;
  });

  await assertTest('POST /api/contact with invalid data returns 400 with errors', async () => {
    const invalidPayload = {
      name: 'A', // too short
      email: 'invalid-email',
      phone: '123', // too short
      typology: '',
      message: 'short'
    };
    const res = await request('POST', '/api/contact', invalidPayload);
    if (res.statusCode !== 400 || res.json.success !== false || !Array.isArray(res.json.errors)) {
      throw new Error('Expected 400 Bad Request with validation errors array');
    }
  });

  // 4. Studio Consultation API Tests
  let createdConsultationId = null;
  await assertTest('POST /api/consultation books an appointment', async () => {
    const payload = {
      name: 'Mian Salman Mansha',
      email: 'salman.mansha@manshagroup.com',
      phone: '+92 321 8899001',
      preferredDate: '2026-09-22',
      meetingType: 'studio',
      projectType: 'commercial',
      notes: 'Initial feasibility discussion for corporate office building on Main Boulevard Gulberg.'
    };
    const res = await request('POST', '/api/consultation', payload);
    if (res.statusCode !== 201 || !res.json.success || !res.json.consultationId.startsWith('ARCH-CON-')) {
      throw new Error(`Invalid response: ${JSON.stringify(res.json)}`);
    }
    createdConsultationId = res.json.consultationId;
  });

  await assertTest('POST /api/consultation with missing date returns 400', async () => {
    const payload = {
      name: 'Test Client',
      email: 'client@test.com',
      phone: '+92 300 1234567'
      // missing preferredDate
    };
    const res = await request('POST', '/api/consultation', payload);
    if (res.statusCode !== 400 || res.json.success !== false) throw new Error('Expected 400');
  });

  // 5. Newsletter Subscription API Tests
  await assertTest('POST /api/newsletter subscribes a new email', async () => {
    const testEmail = `architectural.patron.${Date.now()}@lahore.pk`;
    const res = await request('POST', '/api/newsletter', { email: testEmail });
    if (res.statusCode !== 201 || !res.json.success) throw new Error('Expected 201 Created');
  });

  await assertTest('POST /api/newsletter handles duplicate email gracefully', async () => {
    const duplicateEmail = 'design.patron@lahorearch.org';
    const res = await request('POST', '/api/newsletter', { email: duplicateEmail });
    if (res.statusCode !== 200 || !res.json.success) throw new Error('Expected 200 OK');
  });

  // 6. Admin API Tests
  await assertTest('GET /api/inquiries contains created inquiry', async () => {
    const res = await request('GET', '/api/inquiries');
    if (res.statusCode !== 200 || !res.json.success) throw new Error('Failed GET /api/inquiries');
    const found = res.json.data.some(i => i.id === createdInquiryId);
    if (!found) throw new Error(`Created inquiry ${createdInquiryId} not found in database`);
  });

  await assertTest('PATCH /api/inquiries/:id updates status to contacted', async () => {
    const res = await request('PATCH', `/api/inquiries/${createdInquiryId}`, { status: 'contacted' });
    if (res.statusCode !== 200 || res.json.data.status !== 'contacted') {
      throw new Error('Status was not updated');
    }
  });

  await assertTest('GET /api/stats returns all metric counts', async () => {
    const res = await request('GET', '/api/stats');
    if (res.statusCode !== 200 || !res.json.success) throw new Error('Failed GET /api/stats');
    const data = res.json.data;
    if (typeof data.inquiriesCount !== 'number' || typeof data.consultationsCount !== 'number') {
      throw new Error('Invalid metric counts');
    }
  });

  // Close Server
  server.close(() => {
    console.log('\n========================================================');
    console.log(`  VERIFICATION FINISHED: ${passed} PASSED, ${failed} FAILED`);
    console.log('========================================================\n');
    process.exit(failed > 0 ? 1 : 0);
  });
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  if (server) server.close();
  process.exit(1);
});
