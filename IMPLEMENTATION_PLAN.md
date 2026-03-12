# OmniVertex Digital - Payment Queue System Implementation Plan

## Project Analysis

### Current Implementation:
- Service marketplace website with 10 digital services
- Users can submit service requests through forms
- Requests are stored in-memory with status 'pending'
- No payment processing exists

### Required Flow (Your Business Model):
1. User selects a service → Fills request form
2. Request goes into queue (pending payment)
3. User pays for the service
4. Payment confirmed → Service is applied/implemented
5. Admin can manage the queue and mark services as completed

---

## Implementation Plan

### Phase 1: Backend - Payment Integration (server/src/index.js)

#### 1.1 Add Stripe Payment Integration
- Install `stripe` package
- Create Stripe payment intents
- Store payment intent IDs with service requests
- Add payment status field: 'pending' | 'paid' | 'failed'

#### 1.2 Update Service Request Data Model
```javascript
{
  id: uuid,
  serviceId, serviceName,
  name, email, phone, company,
  requirements, budget, timeline,
  status: 'pending' | 'in-progress' | 'completed',
  paymentStatus: 'pending' | 'paid' | 'failed',
  paymentId: null | stripe_payment_id,
  amount: 0,
  createdAt, updatedAt
}
```

#### 1.3 New API Endpoints
- `POST /api/create-payment-intent` - Create Stripe payment intent
- `POST /api/payment-webhook` - Handle Stripe webhook for payment confirmation
- `GET /api/admin/requests` - Get all requests (admin)
- `PUT /api/admin/requests/:id/status` - Update request status (admin)
- `GET /api/requests/:id` - User checks their request status

---

### Phase 2: Frontend - Payment & Admin UI (client/src/App.js)

#### 2.1 Payment Integration
- Install `@stripe/stripe-js` and `@stripe/react-stripe-js`
- Create payment component with Stripe Elements
- Handle payment submission and confirmation

#### 2.2 Updated Request Flow
- After form submission, redirect to payment page
- Show payment amount based on service pricing
- Handle payment success/failure
- Show confirmation with request ID

#### 2.3 Admin Dashboard View
- New 'admin' view accessible via secret route
- Display all service requests in a table
- Show payment status (paid/pending)
- Allow status updates: pending → in-progress → completed
- Filter by status, payment status, date

#### 2.4 User Request Status View
- New 'my-requests' view for users to check their request
- Show current status and payment status

---

### Phase 3: Estimated Pricing Mapping

Map services to prices for payment:
- Web App Development: $500
- Domain Services: $12
- CDN Services: $25
- Server Services: $30
- Database Services: $20
- Hosting & Deployment: $15
- Rendering Services: $50/hour
- Mobile App Development: $1000
- UI/UX Design: $300
- SEO Services: $200

---

## Files to Modify

1. **server/package.json** - Add stripe dependency
2. **server/src/index.js** - Add payment endpoints and admin routes
3. **client/package.json** - Add Stripe React components
4. **client/src/App.js** - Add payment view, admin dashboard, status view
5. **client/src/App.css** - Add styles for new components

---

## Follow-up Steps

1. Install dependencies (server: stripe, client: @stripe/stripe-js @stripe/react-stripe-js)
2. Run the application to verify
3. Test the complete flow: request → payment → admin management

